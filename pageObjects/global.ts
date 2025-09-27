import { Page, Locator, expect } from '@playwright/test';

export class Header {
  readonly page: Page;
  readonly pageTitle: Locator;
  readonly mainMenu: Locator;
  readonly menuButton: Locator;
  readonly closeMenuButton: Locator;
  readonly productsLink: Locator;
  readonly aboutLink: Locator;
  readonly logoutLink: Locator;
  readonly resetAppStateLink: Locator;
  readonly cartButton: Locator;
  readonly cartCounter: Locator;
  readonly error: Locator

  constructor(page: Page) {
    this.page = page;
    this.pageTitle = page.locator('.header_secondary_container .title');
    this.menuButton = page.locator('#react-burger-menu-btn');
    this.closeMenuButton = page.locator('#react-burger-cross-btn');
    this.mainMenu = page.locator('.bm-menu-wrap');
    this.cartButton = page.locator('.shopping_cart_link');
    this.cartCounter = page.locator('.shopping_cart_badge');
    this.productsLink = page.getByTestId('inventory-sidebar-link');
    this.aboutLink = page.getByTestId('about-sidebar-link');
    this.logoutLink = page.getByTestId('logout-sidebar-link');
    this.resetAppStateLink = page.getByTestId('reset-sidebar-link');
    this.error = page.getByTestId('error');
  }

  async visitMenuLink(link: Locator, url: string) {
    await this.menuButton.click();
    await link.click();
    await expect.soft(this.page).toHaveURL(url, { timeout: 5000 });
  }
}

export class LoginForm {
  readonly page: Page;
  readonly usernameField: Locator;
  readonly passwordField: Locator;
  readonly loginButton: Locator;
  readonly error: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameField = page.locator('[data-test="username"]');
    this.passwordField = page.locator('[data-test="password"]');
    this.loginButton = page.locator('[data-test="login-button"]');
    this.error = page.getByTestId('error');
  }

  /**
   * Login with the specified credentials
   * @param username - The username from .env file
   * @param password - The password from .env file
   */
  async login(username: string) {
    await this.usernameField.fill(username);
    await this.passwordField.fill(process.env.PASSWORD);
    await this.loginButton.click();
  }
}

export class Footer {
  readonly page: Page;
  readonly twitterLink: Locator;
  readonly facebookLink: Locator;
  readonly linkedInLink: Locator;
  readonly copyright: Locator;

  constructor(page: Page) {
    this.page = page;
    this.twitterLink = page.locator('footer a[href="https://twitter.com/saucelabs"]');
    this.facebookLink = page.locator('footer a[href="https://www.facebook.com/saucelabs"]');
    this.linkedInLink = page.locator('footer a[href="https://www.linkedin.com/company/sauce-labs/"]');
    this.copyright = page.locator('.footer_copy');
  }

  async copyrightYear() {
    const currentYear = new Date().getFullYear();
    const footerText = await this.copyright.innerText();
    expect(footerText).toContain(`© ${currentYear}`);
  }
}