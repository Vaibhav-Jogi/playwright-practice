import { Page, expect, Locator } from '@playwright/test';

export class CatalogPage {
  readonly productsHeading: Locator;
  readonly searchInput: Locator;
  readonly searchResultsText: Locator;
  readonly greyJacketLink: Locator;
  readonly noirJacketLink: Locator;

  constructor(private readonly page: Page) {
    this.productsHeading = page.getByRole('heading', { name: 'Products', level: 1 });
    this.searchInput = page.getByRole('textbox', { name: 'Search' });
    this.searchResultsText = page.getByText(/Showing results for/i);
    this.greyJacketLink = page.getByRole('link', { name: /Grey jacket/i });
    this.noirJacketLink = page.getByRole('link', { name: /Noir jacket/i });
  }

  async open() {
    await this.page.goto('/collections/all');
    await expect(this.productsHeading).toBeVisible();
  }

  async searchProduct(term: string) {
    await this.searchInput.fill(term);
    await this.searchInput.press('Enter');
    await expect(this.page).toHaveURL(new RegExp(`/search.*q=${encodeURIComponent(term)}`));
  }

  productLink(productName: string): Locator {
    return this.page.getByRole('link', { name: new RegExp(productName, 'i') }).first();
  }

  async openProduct(productName: string) {
    await this.productLink(productName).click();
  }
}