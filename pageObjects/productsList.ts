import { Page, Locator, expect } from '@playwright/test';

export class ProductsListPage {
  readonly page: Page;
  readonly productsListContainer: Locator;
  readonly firstProduct: Locator;
  readonly firstPrductImage: Locator;
  readonly firstProductName: Locator;
  readonly firstProductDesc: Locator;
  readonly firstProductPrice: Locator;
  readonly firstAddToCartButton: Locator;
  readonly firstRemoveButton: Locator;
  readonly secondProduct: Locator;
  readonly secondAddToCartButton: Locator;
  readonly secondRemoveButton: Locator;
  readonly thirdProduct: Locator;
  readonly thirdAddToCartButton: Locator;
  readonly thirdRemoveButton: Locator;
  readonly sortDropdown: Locator;

  constructor(page: Page) {
    this.page = page;
    this.productsListContainer = page.locator('.inventory_list');
    this.firstProduct = page.locator('.inventory_item').first();
    this.firstPrductImage = this.firstProduct.locator('img.inventory_item_img');
    this.firstProductName = this.firstProduct.locator('.inventory_item_name');
    this.firstProductDesc = this.firstProduct.locator('.inventory_item_desc');
    this.firstProductPrice = this.firstProduct.locator('.inventory_item_price');
    this.firstAddToCartButton = this.firstProduct.getByRole('button', { name: 'Add to cart' });
    this.firstRemoveButton = this.firstProduct.getByRole('button', { name: 'Remove' });
    this.secondProduct = page.locator('.inventory_item').nth(1);
    this.secondAddToCartButton = this.secondProduct.getByRole('button', { name: 'Add to cart' });
    this.secondRemoveButton = this.secondProduct.getByRole('button', { name: 'Remove' });
    this.thirdProduct = page.locator('.inventory_item').nth(2);
    this.thirdAddToCartButton = this.thirdProduct.getByRole('button', { name: 'Add to cart' });
    this.thirdRemoveButton = this.firstProduct.getByRole('button', { name: 'Remove' });
    this.sortDropdown = page.getByTestId('product-sort-container');
  }

  async getProductNames(){
    return await this.page.locator('.inventory_item_name').allInnerTexts();
  }

  async getProductPrices(){
    const prices = await this.page.locator('.inventory_item_price').allInnerTexts();
    return prices.map(p => parseFloat(p.replace('$', '')));
  }

  async SortByNameAZ() {
    await this.sortDropdown.selectOption('az');
    const namesAZ = await this.getProductNames();
    const sortedAZ = [...namesAZ].sort((a, b) => a.localeCompare(b));
    expect.soft(namesAZ).toEqual(sortedAZ);
  }

  async SortByNameZA() {
    await this.sortDropdown.selectOption('za');
    const namesZA = await this.getProductNames();
    const sortedZA = [...namesZA].sort((a, b) => b.localeCompare(a));
    expect.soft(namesZA).toEqual(sortedZA);
  }

  async SortByPriceLowHigh() {
    await this.sortDropdown.selectOption('lohi');
    const prices = await this.getProductPrices();
    const sorted = [...prices].sort((a, b) => a - b);
    expect.soft(prices).toEqual(sorted);
  }

  async SortByPriceHighLow() {
    await this.sortDropdown.selectOption('hilo');
    const prices = await this.getProductPrices();
    const sorted = [...prices].sort((a, b) => b - a);
    expect.soft(prices).toEqual(sorted);
  }
}
