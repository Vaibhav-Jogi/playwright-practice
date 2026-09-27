import { test, expect } from '../fixtures/test-fixtures';

async function expectSuccessfulDocumentResponse(
  responsePromise: Promise<import('@playwright/test').Response>,
  expectedPath: string,
) {
  const response = await responsePromise;
  const request = response.request();

  expect(response.url(), `Unexpected response URL for ${expectedPath}`).toContain(expectedPath);
  expect(response.status(), `${request.method()} ${response.url()} returned an unexpected status`).toBe(200);
  expect(response.headers()['content-type'], `Unexpected content type for ${response.url()}`).toContain('text/html');
}

test.describe('Network validation coverage', () => {
  test('TC06: Catalog page load responds with a successful document request', { tag: '@network' }, async ({ page, catalogPage }) => {
    const catalogResponse = page.waitForResponse((response) => {
      return response.request().resourceType() === 'document' && response.url().endsWith('/collections/all');
    });

    await page.goto('/collections/all');
    await expectSuccessfulDocumentResponse(catalogResponse, '/collections/all');
    await expect(catalogPage.productsHeading).toBeVisible();
  });

  test('TC07: Search page responds successfully and shows product results', { tag: '@regression' }, async ({ page, catalogPage }) => {
    const searchResponse = page.waitForResponse((response) => {
      return response.request().resourceType() === 'document' && response.url().includes('/search?');
    });

    await page.goto('/search?type=product&q=jacket');
    await expectSuccessfulDocumentResponse(searchResponse, '/search?');
    await expect(catalogPage.searchResultsText).toBeVisible();
    await expect(catalogPage.greyJacketLink).toBeVisible();
    await expect(catalogPage.noirJacketLink).toBeVisible();
  });
});
