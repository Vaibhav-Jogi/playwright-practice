import { Page, expect, Locator } from '@playwright/test';

export class HomePage {
  readonly homeHeading: Locator;
  readonly catalogLink: Locator;
  readonly loginLink: Locator;
  readonly signupLink: Locator;
  readonly checkoutLink: Locator;
  readonly searchInput: Locator;

  constructor(private readonly page: Page) {
    this.homeHeading = page.getByRole('heading', { name: 'Sauce Demo', level: 1 });
    this.catalogLink = page.getByRole('link', { name: 'Catalog' });
    this.loginLink = page.getByRole('link', { name: 'Log In' });
    this.signupLink = page.getByRole('link', { name: 'Sign up' });
    this.checkoutLink = page.getByRole('link', { name: 'Check Out' });
    this.searchInput = page.getByRole('textbox', { name: 'Search' });
  }

  async open() {
    await this.page.goto('/');
    await expect(this.page).toHaveTitle('Sauce Demo');
    await expect(this.homeHeading).toBeVisible();
  }

  async openCatalog() {
    await this.catalogLink.click();
    await expect(this.page).toHaveURL(/\/collections\/all$/);
  }

  async openLogin() {
    await this.loginLink.click();
    await expect(this.page).toHaveURL(/\/account\/login$/);
  }

  async openRegister() {
    await this.signupLink.click();
    await expect(this.page).toHaveURL(/\/account\/register$/);
  }

  async searchProduct(term: string) {
    await this.searchInput.fill(term);
    await this.searchInput.press('Enter');
  }
}
