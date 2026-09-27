import { Page, expect, Locator } from '@playwright/test';

export class RegistrationPage {
  readonly registerHeading: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly createButton: Locator;

  constructor(private readonly page: Page) {
    this.registerHeading = page.getByRole('heading', { name: 'Create Account', level: 1 });
    this.firstNameInput = page.getByLabel('First Name');
    this.lastNameInput = page.getByLabel('Last Name');
    this.emailInput = page.getByLabel('Email');
    this.passwordInput = page.getByLabel('Password');
    this.createButton = page.getByRole('button', { name: 'Create' });
  }

  async open() {
    await this.page.goto('/account/register');
    await expect(this.registerHeading).toBeVisible();
  }

  async register(firstName: string, lastName: string, email: string, password: string) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.createButton.click();
  }
}
