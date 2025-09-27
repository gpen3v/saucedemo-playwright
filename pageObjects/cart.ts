import { Page, Locator, expect } from '@playwright/test';

export class Cart {
  readonly page: Page;
  readonly cartItem: Locator;
  readonly cartItemName: Locator;
  readonly cartItemDesc: Locator;
  readonly cartItemPrice: Locator;
  readonly removeButton: Locator;
  readonly continueShoppingButton: Locator;
  readonly checkoutButton: Locator;
  readonly finishButton: Locator;
  readonly backHomeButton: Locator;
  readonly checkoutInfo: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator
  readonly postalCodeInput: Locator;
  readonly cancelButton: Locator;
  readonly continueButton: Locator;
  readonly paymentInfo: Locator;
  readonly shippingInfo: Locator;
  readonly tax: Locator;
  readonly total: Locator;
  readonly error: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cartItem = page.locator('.cart_item');
    this.cartItemName = this.cartItem.locator('.inventory_item_name');
    this.cartItemDesc = this.cartItem.locator('.inventory_item_desc');
    this.cartItemPrice = this.cartItem.locator('.inventory_item_price');
    this.removeButton = page.getByRole('button', { name: 'Remove' });
    this.continueShoppingButton = page.getByRole('button', { name: 'Continue Shopping' });
    this.checkoutButton = page.getByRole('button', { name: 'Checkout' });
    this.finishButton = page.getByRole('button', { name: 'Finish' });
    this.backHomeButton = page.getByRole('button', { name: 'Back Home' });
    this.checkoutInfo = page.locator('#checkout_info_container');
    this.firstNameInput = page.getByTestId('firstName');
    this.lastNameInput = page.getByTestId('lastName');
    this.postalCodeInput = page.getByTestId('postalCode');
    this.cancelButton = page.getByRole('button', { name: 'Cancel' });
    this.continueButton = page.getByRole('button', { name: 'Continue' });
    this.paymentInfo = page.getByTestId('payment-info-value');
    this.shippingInfo = page.getByTestId('shipping-info-value');
    this.tax = page.getByTestId('tax-label');
    this.total = page.getByTestId('total-label');
    this.error = page.getByTestId('error');
  }

  //Validate Total Price = item price + tax
  async totalPrice() {
    const itemPrice = parseFloat((await this.cartItemPrice.innerText()).replace('$', ''));
    const taxText = await this.tax.innerText();
    const tax = parseFloat(taxText.replace('Tax: $', ''));
    const totalText = await this.total.innerText();
    const total = parseFloat(totalText.replace('Total: $', ''));
    expect.soft(total).toBe(itemPrice + tax);
    return itemPrice + tax;
  }
}