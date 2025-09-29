import { test, expect } from '@playwright/test';
import { Header } from '../../pageObjects/global';
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
  test.describe(`${user.name}`, () => {
    // This test uses authentication state
    test.use({ storageState: user.state });

    test('Full Purchase Flow', async ({ page }) => {
      const header = new Header(page);
      const productsList = new ProductsListPage(page);
      const productItem = new ProductItemPage(page);
      const cart = new Cart(page);

      // Visit products page (should be authenticated)
      await page.goto('/inventory.html');
      await expect(header.pageTitle).toHaveText('Products');
      await expect(productsList.productsListContainer).toBeVisible();

      // Visit a product page and validate title, description, price
      const productTitle = await productsList.firstProductName.innerText();
      const productDesc = await productsList.firstProductDesc.innerText();
      const productPrice = await productsList.firstProductPrice.innerText();
      await productsList.firstProductName.click();

      // Verify product details
      await expect.soft(productItem.productImage).toBeVisible();
      await expect.soft(productItem.productName).toHaveText(productTitle);
      await expect.soft(productItem.productDesc).toHaveText(productDesc);
      await expect.soft(productItem.productPrice).toHaveText(productPrice);

      // Add first product to cart
      await productItem.addToCartButton.click();
      await expect.soft(productItem.removeButton).toBeVisible();
      await expect.soft(header.cartCounter).toHaveText('1');

      // Go to cart
      await header.cartButton.click();
      await expect(header.pageTitle).toHaveText('Your Cart');
      await expect(page).toHaveURL('/cart.html');
      await expect.soft(cart.cartItem).toHaveCount(1);
      // Validate cart item details
      await expect.soft(cart.cartItemName).toHaveText(productTitle);
      await expect.soft(cart.cartItemDesc).toHaveText(productDesc);
      await expect.soft(cart.cartItemPrice).toHaveText(productPrice);
      await expect.soft(cart.removeButton).toBeVisible();
      await expect.soft(cart.continueShoppingButton).toBeVisible();

      // Checkout
      await cart.checkoutButton.click();
      await expect(header.pageTitle).toHaveText('Checkout: Your Information');
      await expect(page).toHaveURL('/checkout-step-one.html');
      await expect(cart.checkoutInfo).toBeVisible();
      await cart.firstNameInput.fill('Test First Name');
      await cart.lastNameInput.fill('Test Last Name');
      await cart.postalCodeInput.fill('12345');
      await expect(cart.cancelButton).toBeVisible();
      await cart.continueButton.click();

      //Checkout: Overview
      await expect(header.pageTitle).toHaveText('Checkout: Overview');
      await expect(page).toHaveURL('/checkout-step-two.html');
      await expect.soft(cart.cartItemName).toHaveText(productTitle);
      await expect.soft(cart.cartItemDesc).toHaveText(productDesc);
      await expect.soft(cart.cartItemPrice).toHaveText(productPrice);
      await expect(page.getByTestId('payment-info-value')).not.toBeEmpty();
      await expect(page.getByTestId('shipping-info-value')).not.toBeEmpty();
      //Total Price = item price + tax
      await cart.totalPrice();

      //Finish
      await cart.finishButton.click();
      await expect.soft(header.pageTitle).toHaveText('Checkout: Complete!');
      await expect.soft(page.locator('h2.complete-header')).toHaveText('Thank you for your order!');
      await expect.soft(header.cartCounter).not.toBeVisible();
      await cart.backHomeButton.click();
      await expect(productsList.productsListContainer).toBeVisible();
    });
  });
}
