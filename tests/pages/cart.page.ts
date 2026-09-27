import { Page, expect, Locator } from '@playwright/test';

export class CartPage {
  readonly cartHeading: Locator;
  readonly quantityInput: Locator;
  readonly updateButton: Locator;
  readonly removeLink: Locator;
  readonly emptyCartMessage: Locator;

  constructor(private readonly page: Page) {
    this.cartHeading = page.getByRole('heading', { name: 'My Cart', level: 1 });
    this.quantityInput = page.locator('#cart').getByRole('textbox').first();
    this.updateButton = page.getByRole('button', { name: 'Update' });
    this.removeLink = page.getByRole('link', { name: 'x', exact: true });
    this.emptyCartMessage = page.getByText('It appears that your cart is currently empty!');
  }

  cartCountLink(count: number): Locator {
    return this.page.getByRole('link', { name: new RegExp(`My Cart \\(${count}\\)`), exact: false });
  }

  async open() {
    await this.page.goto('/cart');
    await expect(this.cartHeading).toBeVisible();
  }

  async updateQuantity(quantity: number) {
    await expect(this.quantityInput).toBeVisible();
    await this.quantityInput.fill(String(quantity));
    await this.updateButton.click();
  }

  async removeProduct() {
    await this.removeLink.click();
  }

  async expectEmptyCartState() {
    await expect(this.emptyCartMessage).toBeVisible();
  }

  async expectCartCount(count: number) {
    await expect(this.cartCountLink(count)).toBeVisible();
  }
}
