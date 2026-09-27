import { test, expect } from '../fixtures/test-fixtures';
import { attachDiagnostics } from './diagnostics';

test.describe('Diagnostics coverage', () => {
  test('TC09: Browser diagnostics show no page or console errors during a smoke flow', { tag: '@sanity' }, async ({ page, homePage }) => {
    const diagnostics = await attachDiagnostics(page);

    await page.goto('/');
    await expect(homePage.homeHeading).toBeVisible();
    await expect(homePage.catalogLink).toBeVisible();

    expect(diagnostics.pageErrors, 'No unexpected page errors should be emitted during the smoke flow').toEqual([]);
    expect(diagnostics.consoleErrors, 'No unexpected console errors should be emitted during the smoke flow').toEqual([]);
  });
});
