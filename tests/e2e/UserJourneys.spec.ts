import { test, expect } from '@playwright/test';
import { Header, LoginForm, Footer } from '../../pageObjects/global';
import { ProductsListPage } from '../../pageObjects/productsList';
import { ProductItemPage } from '../../pageObjects/productItem';
import { Cart } from '../../pageObjects/cart';

const users = [
  { name: 'standard_user', state: 'playwright/.auth/standard_user.json' },
  { name: 'performance_glitch_user', state: 'playwright/.auth/performance_glitch_user.json' },
  { name: 'problem_user', state: 'playwright/.auth/problem_user.json' },
  { name: 'error_user', state: 'playwright/.auth/error_user.json' },
  { name: 'visual_user', state: 'playwright/.auth/visual_user.json' },
];

for (const user of users) {
  test.describe(`${user.name} - Products List Page`, () => {
    test.use({ storageState: user.state });

    test.beforeEach(async ({ page }) => {
      await page.goto('/inventory.html');
    });

    test('Display of Products', async ({ page }) => {
      const header = new Header(page);
      const productsList = new ProductsListPage(page);

      await expect(productsList.productsListContainer).toBeVisible();
      await expect.soft(header.pageTitle).toHaveText('Products');
      await expect.soft(page).toHaveScreenshot('products_list.png', { fullPage: true });
      // Add first product to cart from list view
      await productsList.firstAddToCartButton.click();
      await expect(header.cartCounter).toHaveText('1');
      // Remove first product from cart from list view
      await productsList.firstRemoveButton.click();
      await expect(header.cartCounter).not.toBeVisible();
    });

    test('Sorting of Products', async ({ page }) => {
      const productsList = new ProductsListPage(page);

      await productsList.SortByNameZA();
      await productsList.SortByNameAZ();
      await productsList.SortByPriceLowHigh();
      await productsList.SortByPriceHighLow();
    });
  });

  test.describe(`${user.name} - Product Details Page`, () => {
    test.use({ storageState: user.state });

    test('Display of a Product Details Page', async ({ page }) => {
      const header = new Header(page);
      const productsList = new ProductsListPage(page);
      const productItem = new ProductItemPage(page);

      await page.goto('/inventory.html');
      //Go to product details page
      await productsList.firstProductName.click();
      await expect(productItem.productImage).toBeVisible();
      await expect(productItem.productName).toBeVisible();
      //Visual comparison of Product details page
      await expect.soft(page).toHaveScreenshot('product_page.png', { fullPage: true });
      //Add to cart and remove from cart from product details page
      await productItem.addToCartButton.click();
      await expect(header.cartCounter).toHaveText('1');
      await productItem.removeButton.click();
      await expect(header.cartCounter).not.toBeVisible();
      //Go back to products list from product details page
      await header.visitMenuLink(header.productsLink, '/inventory.html');
      await productsList.firstProductName.click();
      await productItem.backToProductsButton.click();
      await expect(page).toHaveURL('/inventory.html', { timeout: 5000 });
      await expect(header.pageTitle).toHaveText('Products');
    });
  });

  test.describe(`${user.name} - Cart and Checkout`, () => {
    test.use({ storageState: user.state });

    test('Cart and Checkout Page navigation and validations', async ({ page }) => {
      const header = new Header(page);
      const productsList = new ProductsListPage(page);
      const cart = new Cart(page);

      await page.goto('/inventory.html');
      // Validate Remove and Continue Shopping buttons in cart
      await productsList.firstAddToCartButton.click();
      await expect(header.cartCounter).toHaveText('1');
      //Go to cart
      await header.cartButton.click();
      await expect(header.pageTitle).toHaveText('Your Cart');
      await cart.removeButton.click();
      await expect(header.cartCounter).not.toBeVisible();
      await cart.continueShoppingButton.click();
      await expect(page).toHaveURL('/inventory.html');
      await expect(header.pageTitle).toHaveText('Products');

      // Go to Checkout and validate required fields and Cancel button
      await productsList.firstAddToCartButton.click();
      await expect(header.cartCounter).toHaveText('1');
      await header.cartButton.click();
      await expect(header.pageTitle).toHaveText('Your Cart');
      await expect(page).toHaveURL('/cart.html');
      await expect.soft(cart.cartItem).toHaveCount(1);
      // Checkout Information - validate required fields
      await cart.checkoutButton.click();
      await expect(header.pageTitle).toHaveText('Checkout: Your Information');
      await cart.continueButton.click();
      await expect(cart.error).toHaveText('Error: First Name is required');
      await cart.firstNameInput.fill('Test First Name');
      await cart.continueButton.click();
      await expect(cart.error).toHaveText('Error: Last Name is required');
      await cart.lastNameInput.fill('Test Last Name');
      await cart.continueButton.click();
      await expect(cart.error).toHaveText('Error: Postal Code is required');
      // Cancel and go back to cart
      await cart.cancelButton.click();
      await expect(header.pageTitle).toHaveText('Your Cart');
      await expect(page).toHaveURL('/cart.html');

      //Cancel on Checkout: Overview
      await cart.checkoutButton.click();
      await expect(header.pageTitle).toHaveText('Checkout: Your Information');
      await cart.firstNameInput.fill('Test First Name');
      await cart.lastNameInput.fill('Test Last Name');
      await cart.postalCodeInput.fill('12345');
      await cart.continueButton.click();
      await expect(header.pageTitle).toHaveText('Checkout: Overview');
      await expect(cart.finishButton).toBeVisible();
      await cart.cancelButton.click();
      await expect(page).toHaveURL('/inventory.html');
      await expect(header.pageTitle).toHaveText('Products');
    });
  });

  test.describe(`${user.name} - Main Menu`, () => {
    test.use({ storageState: user.state });

    test.beforeEach(async ({ page }) => {
      await page.goto('/inventory.html');
    });

    test('Logout and login with cart persistence', async ({ page }) => {
      const header = new Header(page);
      const productsList = new ProductsListPage(page);
      const loginForm = new LoginForm(page);
      const cart = new Cart(page);
      // Add products to cart
      await productsList.firstAddToCartButton.click();
      await productsList.secondAddToCartButton.click();
      await expect(header.cartCounter).toHaveText('2');
      // Go to cart
      await header.cartButton.click();
      await expect(header.pageTitle).toHaveText('Your Cart');
      await expect(page).toHaveURL('/cart.html');
      await expect.soft(cart.cartItem).toHaveCount(2);
      // Logout
      await header.visitMenuLink(header.logoutLink, '/');
      await expect(page).toHaveURL('/');
      await expect(page.locator('.login_container')).toBeVisible();
      //Login and validate products are still in cart
      await loginForm.login(user.name);
      await expect(page).toHaveURL('/inventory.html');
      await expect(header.cartCounter).toHaveText('2');
      // Go to cart
      await header.cartButton.click();
      await expect(header.pageTitle).toHaveText('Your Cart');
      await expect(page).toHaveURL('/cart.html');
      await expect.soft(cart.cartItem).toHaveCount(2);
    });

    test('Other Menu operations', async ({ page }) => {
      const header = new Header(page);
      const productsList = new ProductsListPage(page);
      const productItem = new ProductItemPage(page);

      // Go to a product and navigate to products list
      await productsList.firstProductName.click();
      await expect(productItem.productImage).toBeVisible();
      await header.visitMenuLink(header.productsLink, '/inventory.html');
      // Add items to cart to verify reset app state
      await productsList.firstAddToCartButton.click();
      await productsList.secondAddToCartButton.click();
      await productsList.thirdAddToCartButton.click();
      await expect.soft(header.cartCounter).toHaveText('3');
      await expect.soft(productsList.firstRemoveButton).toBeVisible();
      await expect.soft(productsList.secondRemoveButton).toBeVisible();
      await expect.soft(productsList.thirdRemoveButton).toBeVisible();
      // Reset App State
      await header.visitMenuLink(header.resetAppStateLink, '/inventory.html');
      await expect(header.cartCounter).not.toBeVisible();
      //await expect.soft(productsList.firstRemoveButton).not.toBeVisible(); // As it is a demo Remove button remains visible
      // Close menu
      await header.closeMenuButton.click();
      await expect(header.mainMenu).not.toBeVisible();
      // About link
      await header.visitMenuLink(header.aboutLink, 'https://saucelabs.com/');
      await page.goBack();
      await expect(page).toHaveURL('/inventory.html');

    });
  });

  test.describe(`${user.name} - Footer`, () => {
    test.use({ storageState: user.state });

    test('Display of social media links and copyright', async ({ page }) => {
      const footer = new Footer(page);
      await page.goto('/inventory.html', { timeout: 5000 });
      await expect(footer.twitterLink).toBeVisible();
      await expect(footer.facebookLink).toBeVisible();
      await expect(footer.linkedInLink).toBeVisible();
      await footer.copyrightYear();
    });
  });
}