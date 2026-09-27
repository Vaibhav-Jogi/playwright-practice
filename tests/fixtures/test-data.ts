export function createUniqueEmail(prefix = 'qa-user'): string {
  const stamp = Date.now().toString(36);
  const randomSuffix = Math.random().toString(36).slice(2, 8);
  return `${prefix}+${stamp}-${randomSuffix}@example.com`;
}

export function createCustomerProfile(overrides: Partial<Record<string, string>> = {}) {
  const firstName = overrides.firstName ?? 'Playwright';
  const lastName = overrides.lastName ?? 'Tester';
  const email = overrides.email ?? createUniqueEmail('playwright-showcase');
  const password = overrides.password ?? 'Passw0rd!123';

  return {
    firstName,
    lastName,
    email,
    password,
  };
}

export const STORE_PRODUCTS = {
  greyJacket: 'grey-jacket',
  brownShades: 'brown-shades',
  noirJacket: 'noir-jacket',
};
