import { test as setup, expect } from '@playwright/test';
import { LoginForm } from '../../pageObjects/global';

const standard_user = 'playwright/.auth/standard_user.json';
const locked_out_user = 'playwright/.auth/locked_out_user.json';
const problem_user = 'playwright/.auth/problem_user.json';
const performance_glitch_user = 'playwright/.auth/performance_glitch_user.json';
const error_user = 'playwright/.auth/error_user.json';
const visual_user = 'playwright/.auth/visual_user.json';

setup('authenticate as Standard user', async ({ page }) => {
    const loginForm = new LoginForm(page);
    await page.goto('/');
    await loginForm.usernameField.fill(process.env.STANDARD_USER);
    await loginForm.passwordField.fill(process.env.PASSWORD);
    await loginForm.loginButton.click();
    await page.waitForURL('/inventory.html');
    await expect (page.locator('[data-test="inventory-container"]')).toBeVisible();
    // End of authentication steps.
    await page.context().storageState({ path: standard_user });
});

setup('authenticate as Locked-out User', async ({ page }) => {
    const loginForm = new LoginForm(page);
    await page.goto('/');
    await loginForm.usernameField.fill(process.env.LOCKED_OUT_USER);
    await loginForm.passwordField.fill(process.env.PASSWORD);
    await loginForm.loginButton.click();
    // End of authentication steps.
    await page.context().storageState({ path: locked_out_user });
});

setup('authenticate as Problem user', async ({ page }) => {
    const loginForm = new LoginForm(page);
    await page.goto('/');
    await loginForm.usernameField.fill(process.env.PROBLEM_USER);
    await loginForm.passwordField.fill(process.env.PASSWORD);
    await loginForm.loginButton.click();
    await page.waitForURL('/inventory.html');
    await expect (page.locator('[data-test="inventory-container"]')).toBeVisible();
    // End of authentication steps.
    await page.context().storageState({ path: problem_user });
});

setup('authenticate as Performance glitch user', async ({ page }) => {
    const loginForm = new LoginForm(page);
    await page.goto('/');
    await loginForm.usernameField.fill(process.env.PERFORMANCE_GLITCH_USER);
    await loginForm.passwordField.fill(process.env.PASSWORD);
    await loginForm.loginButton.click();
    await page.waitForURL('/inventory.html');
    await expect (page.locator('[data-test="inventory-container"]')).toBeVisible();
    // End of authentication steps.
    await page.context().storageState({ path: performance_glitch_user });
});

setup('authenticate as Error user', async ({ page }) => {
    const loginForm = new LoginForm(page);
    await page.goto('/');
    await loginForm.usernameField.fill(process.env.ERROR_USER);
    await loginForm.passwordField.fill(process.env.PASSWORD);
    await loginForm.loginButton.click();
    await page.waitForURL('/inventory.html');
    await expect (page.locator('[data-test="inventory-container"]')).toBeVisible();
    // End of authentication steps.
    await page.context().storageState({ path: error_user });
});

setup('authenticate as Visual user', async ({ page }) => {
    const loginForm = new LoginForm(page);
    await page.goto('/');
    await loginForm.usernameField.fill(process.env.VISUAL_USER);
    await loginForm.passwordField.fill(process.env.PASSWORD);
    await loginForm.loginButton.click();
    await page.waitForURL('/inventory.html');
    await expect (page.locator('[data-test="inventory-container"]')).toBeVisible();
    // End of authentication steps.
    await page.context().storageState({ path: visual_user });
});