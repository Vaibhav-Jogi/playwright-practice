import { Page, expect, Locator } from '@playwright/test';

export class ProductPage {
  readonly addToCartButton: Locator;
  readonly soldOutButton: Locator;

  constructor(private readonly page: Page) {
    this.addToCartButton = page.getByRole('button', { name: 'Add to Cart' });
    this.soldOutButton = page.getByRole('button', { name: 'Sold Out' });
  }

  productHeading(name: string): Locator {
    return this.page.getByRole('heading', { name, level: 1 });
  }

  async openProductBySlug(slug: string) {
    await this.page.goto(`/products/${slug}`);
  }

  async addToCart() {
    await this.addToCartButton.click();
  }

  async expectProductVisible(name: string) {
    await expect(this.productHeading(name)).toBeVisible();
  }

  async expectSoldOut() {
    await expect(this.soldOutButton).toBeDisabled();
  }
}