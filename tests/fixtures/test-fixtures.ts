import { test as base, expect, APIRequestContext } from '@playwright/test';
import { HomePage } from '../pages/home.page';
import { CatalogPage } from '../pages/catalog.page';
import { ProductPage } from '../pages/product.page';
import { CartPage } from '../pages/cart.page';
import { LoginPage } from '../pages/login.page';
import { RegistrationPage } from '../pages/registration.page';
import { ApiClient } from './api-client';

type CustomFixtures = {
  homePage: HomePage;
  catalogPage: CatalogPage;
  productPage: ProductPage;
  cartPage: CartPage;
  loginPage: LoginPage;
  registrationPage: RegistrationPage;
  apiClient: ApiClient;
  apiRequest: APIRequestContext;
};

export const test = base.extend<CustomFixtures>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },

  catalogPage: async ({ page }, use) => {
    await use(new CatalogPage(page));
  },

  productPage: async ({ page }, use) => {
    await use(new ProductPage(page));
  },

  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },

  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  registrationPage: async ({ page }, use) => {
    await use(new RegistrationPage(page));
  },

  apiRequest: async ({ request }, use) => {
    await use(request);
  },

  apiClient: async ({ apiRequest }, use) => {
    await use(new ApiClient(apiRequest));
  },
});

export { expect };
