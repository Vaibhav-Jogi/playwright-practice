# Sauce Demo Storefront Automation Showcase

A professional Playwright automation project built to validate real storefront behavior on the Sauce Demo Shopify experience.

This repository demonstrates practical, interview-ready automation across storefront navigation, product discovery, cart workflows, and network validation. It keeps the implementation readable, maintainable, and aligned with real-world Playwright standards.

## What this project demonstrates

- end-to-end workflow validation against a live storefront
- role-based and accessible selector usage
- business-focused assertions instead of brittle implementation details
- resilient browser automation patterns for customer journeys
- network-level checks for critical document loads
- diagnostics for runtime and console-level failures
- a clean foundation suitable for client demos and technical discussions

## Current implementation status

This project has evolved from a starter Playwright repo into a more structured showcase with:

- a TypeScript-based Playwright configuration in [playwright.config.ts](playwright.config.ts)
- environment-driven base URL usage via [.env.example](.env.example)
- page objects for storefront flows in [tests/pages](tests/pages)
- reusable fixtures and test-data helpers in [tests/fixtures](tests/fixtures)
- diagnostics helpers in [tests/diagnostics](tests/diagnostics)
- network and route-mocking examples in [tests/network](tests/network)
- a live storefront test suite that preserves the original scenarios while improving maintainability

## Recommended project structure

```text
.
├── README.md
├── package.json
├── package-lock.json
├── playwright.config.ts
├── .env.example
├── .gitignore
├── .github/
│   └── workflows/
│       └── playwright.yml
├── specs/
│   ├── sauce-demo-test-plan.md
│   └── sauce-demo-showcase-plan.md
├── tests/
│   ├── diagnostics/
│   ├── fixtures/
│   ├── network/
│   ├── pages/
│   ├── storefront/
│   ├── example.spec.js
│   ├── seed.spec.ts
│   └── ...
├── playwright/
│   └── .auth/
├── test-results/
├── playwright-report/
└── node_modules/
```

## Quick start

### Install dependencies

```bash
npm install
```

### Install browser binaries

```bash
npx playwright install
```

### Optional environment configuration

```bash
cp .env.example .env
```

Or export directly:

```bash
export BASE_URL="https://sauce-demo.myshopify.com"
```

Windows PowerShell:

```powershell
$env:BASE_URL = "https://sauce-demo.myshopify.com"
```

## Tag strategy

The suite uses a lightweight manual-style tagging model so it maps clearly to QA test-case documentation:

- `@smoke` — basic happy-path checks
- `@sanity` — core validation and error diagnostics
- `@regression` — broader validation after changes
- `@network` — document/network verification

## Test commands

Run the full suite:

```bash
npx playwright test
```

Run smoke and sanity checks only:

```bash
npx playwright test --grep "@smoke|@sanity"
```

Run regression coverage only:

```bash
npx playwright test --grep "@regression"
```

Run a specific manual-style test case:

```bash
npx playwright test -g "TC02: Catalog page opens and product search returns relevant results"
```

Run the Chromium project only:

```bash
npx playwright test --project=chromium
```

Open the UI mode:

```bash
npx playwright test --ui
```

Open the generated HTML report:

```bash
npx playwright show-report
```

## Implementation patterns used

- environment-driven config using `BASE_URL`
- multi-browser coverage for Chromium, Firefox, WebKit, and mobile projects
- `getByRole`, `getByLabel`, and `getByText` locators over brittle CSS selectors
- test-case-driven structure that mirrors manual test coverage, such as TC01, TC02, and TC03
- tag-based organization with `@smoke`, `@sanity`, `@regression`, and `@network`
- page-object organization for actions such as navigation, catalog browsing, product detail checks, and cart flows
- custom fixtures for shared page objects and request helpers
- web-first assertions with Playwright expectations
- `page.waitForResponse` for critical document network validation
- diagnostics for `pageerror` and console error capture
- CI-ready HTML and JUnit reporting

## Reports and diagnostics

The project uses Playwright reporting configured in [playwright.config.ts](playwright.config.ts). This supports both local debugging and CI evidence collection.

Typical reports include:

- HTML report for local review
- JUnit output for CI pipelines
- traces on first retry
- screenshots and video on failure

## Test-plan reference

The repository includes planning documentation in the [specs](specs) folder:

- [specs/sauce-demo-test-plan.md](specs/sauce-demo-test-plan.md) — detailed functional test plan
- [specs/sauce-demo-showcase-plan.md](specs/sauce-demo-showcase-plan.md) — interview-friendly showcase implementation plan

## Auth and live-site caveats

This project intentionally avoids inventing credentials or fake auth flows. If a live-site account flow is not reliable for the Sauce Demo storefront, the framework remains ready for a real client environment without committing secrets or storage state into source control.

The project also avoids arbitrary waits and brittle selectors, keeping the implementation aligned with scalable Playwright practice.

## Notes

This repo is structured to read like a practical, professional showcase for automation discussions. It balances real end-to-end testing with maintainable patterns, while remaining simple enough to understand quickly in a live demo or interview context.
