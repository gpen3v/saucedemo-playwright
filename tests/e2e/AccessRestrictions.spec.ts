import { test, expect } from '@playwright/test';
import { Header, LoginForm, Footer } from '../../pageObjects/global';
import { ProductsListPage } from '../../pageObjects/productsList';

// This test uses authentication state for anonymous user
test.use({ storageState: { cookies: [], origins: [] } });

test.describe('Access restrictions', () => {

  test('Anonymous user', async ({ page }) => {
    const productsList = new ProductsListPage(page);
    const loginForm = new LoginForm(page);

    // Visit products page (should NOT be authenticated)
    await page.goto('/inventory.html');
    await expect(productsList.productsListContainer).not.toBeVisible();
    await expect.soft(loginForm.error).toHaveText(`Epic sadface: You can only access '/inventory.html' when you are logged in.`);
    // Visit a product page (should NOT be authenticated)
    await page.goto('/inventory-item.html?id=4');
    await expect.soft(loginForm.error).toHaveText(`Epic sadface: You can only access '/inventory-item.html' when you are logged in.`);
  });

  test('Wrong credentials', async ({ page }) => {
    const loginForm = new LoginForm(page);
    const header = new Header(page);
    // Visit login page
    await page.goto('/');
    await expect(loginForm.usernameField).toBeVisible();
    // Attempt to login with wrong credentials
    await loginForm.usernameField.fill('wrong_user');
    await loginForm.passwordField.fill('wrong_password');
    await loginForm.loginButton.click();
    await expect.soft(loginForm.error).toHaveText('Epic sadface: Username and password do not match any user in this service');
  });

  test('Locked-out user', async ({ page }) => {
    const loginForm = new LoginForm(page);
    const productsList = new ProductsListPage(page);
    
    // Login with locked-out user
    await page.goto('/');
    await loginForm.usernameField.fill(process.env.LOCKED_OUT_USER);
    await loginForm.passwordField.fill(process.env.PASSWORD);
    await loginForm.loginButton.click();
    await expect.soft(loginForm.error).toHaveText('Epic sadface: Sorry, this user has been locked out.');
    // Attempt to visit products page (should NOT be authenticated)
    await page.goto('/inventory.html');
    await expect(productsList.productsListContainer).not.toBeVisible();
    await expect.soft(loginForm.error).toHaveText(`Epic sadface: You can only access '/inventory.html' when you are logged in.`);
    // Visit a product page (should NOT be authenticated)
    await page.goto('/inventory-item.html?id=4');
    await expect.soft(loginForm.error).toHaveText(`Epic sadface: You can only access '/inventory-item.html' when you are logged in.`);
  });
});
