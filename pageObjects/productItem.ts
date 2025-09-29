import { Page, Locator } from '@playwright/test';

export class ProductItemPage {
  readonly page: Page;
  readonly productImage: Locator;
  readonly productName: Locator;
  readonly productDesc: Locator;
  readonly productPrice: Locator;
  readonly addToCartButton: Locator;
  readonly removeButton: Locator;
  readonly backToProductsButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productImage = page.locator('img.inventory_details_img');
    this.productName = page.locator('.inventory_details_name');
    this.productDesc = page.locator('.inventory_details_desc');
    this.productPrice = page.locator('.inventory_details_price');
    this.addToCartButton = page.getByRole('button', { name: 'Add to cart' });
    this.removeButton = page.getByRole('button', { name: 'Remove' });
    this.backToProductsButton = page.getByRole('button', { name: 'Back to products' });
  }
}
