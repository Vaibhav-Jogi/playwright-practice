import { test, expect } from '../fixtures/test-fixtures';

test.describe('Cart workflow coverage', () => {
  test('TC04: User can add a product to the cart from the product page', { tag: '@smoke' }, async ({ productPage, cartPage }) => {
    await productPage.openProductBySlug('grey-jacket');
    await productPage.addToCart();

    await expect(cartPage.cartCountLink(1)).toBeVisible();
  });

  test('TC05: Empty cart state is displayed when cart has no items', { tag: '@regression' }, async ({ page, cartPage }) => {
    await page.goto('/cart');
    await expect(cartPage.cartHeading).toBeVisible();
    await expect(cartPage.emptyCartMessage).toBeVisible();
    await expect(cartPage.cartCountLink(0)).toBeVisible();
  });
});
