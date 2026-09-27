import { Page } from '@playwright/test';

export async function attachDiagnostics(page: Page) {
  const pageErrors: Error[] = [];
  const consoleErrors: string[] = [];

  page.on('pageerror', (error) => pageErrors.push(error));
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(`${msg.type()}: ${msg.text()}`);
    }
  });

  return { pageErrors, consoleErrors };
}
