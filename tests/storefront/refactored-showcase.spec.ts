import { test, expect } from '../fixtures/test-fixtures';

test.describe('Showcase storefront journeys', () => {
  test('customer can open catalog and search for a product', async ({ homePage, catalogPage, productPage }) => {
    await homePage.open();
    await homePage.openCatalog();
    await catalogPage.searchProduct('jacket');

    await expect(catalogPage.searchResultsText).toBeVisible();
    await expect(catalogPage.greyJacketLink).toBeVisible();

    await productPage.openProductBySlug('grey-jacket');
    await productPage.expectProductVisible('Grey jacket');
  });

  test('customer can open a sold-out product page', async ({ productPage }) => {
    await productPage.openProductBySlug('brown-shades');
    await productPage.expectProductVisible('Brown Shades');
    await productPage.expectSoldOut();
  });
});
