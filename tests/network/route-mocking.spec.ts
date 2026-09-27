import { test, expect } from '../fixtures/test-fixtures';

test.describe('Route mocking coverage', () => {
  test('TC08: Failed non-critical image request does not crash the product page', { tag: '@regression' }, async ({ page, productPage }) => {
    await page.route('**/*.{png,jpg,jpeg,webp,avif,svg}', async (route) => {
      await route.abort('internetdisconnected');
    });

    await page.goto('/products/grey-jacket');

    await expect(productPage.productHeading('Grey jacket')).toBeVisible();
    await expect(productPage.addToCartButton).toBeVisible();
  });
});
