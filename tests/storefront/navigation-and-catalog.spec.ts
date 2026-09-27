import { test, expect } from '../fixtures/test-fixtures';

test.describe('Storefront navigation and catalog coverage', () => {
  test('TC01: Homepage loads and core storefront navigation is visible', { tag: '@smoke' }, async ({ page, homePage }) => {
    const pageErrors: Error[] = [];
    page.on('pageerror', (error) => pageErrors.push(error));

    await homePage.open();
    await expect(homePage.homeHeading).toBeVisible();
    await expect(homePage.catalogLink).toBeVisible();
    await expect(homePage.loginLink).toBeVisible();
    await expect(homePage.signupLink).toBeVisible();
    await expect(homePage.checkoutLink).toBeVisible();
    expect(pageErrors, 'Homepage should load without page errors').toEqual([]);
  });

  test('TC02: Catalog page opens and product search returns relevant results', { tag: '@sanity' }, async ({ homePage, catalogPage }) => {
    await homePage.open();
    await homePage.openCatalog();
    await catalogPage.searchProduct('jacket');

    await expect(catalogPage.searchResultsText).toBeVisible();
    await expect(catalogPage.greyJacketLink).toBeVisible();
    await expect(catalogPage.noirJacketLink).toBeVisible();
  });

  test('TC03: In-stock and sold-out products are displayed correctly', { tag: '@regression' }, async ({ productPage }) => {
    await productPage.openProductBySlug('grey-jacket');
    await productPage.expectProductVisible('Grey jacket');

    await productPage.openProductBySlug('brown-shades');
    await productPage.expectProductVisible('Brown Shades');
    await productPage.expectSoldOut();
  });
});
