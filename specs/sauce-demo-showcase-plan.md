# Sauce Demo Playwright Showcase Plan

## Application Overview

A production-style Playwright implementation plan for the Sauce Demo Shopify storefront. The project should demonstrate maintainable test architecture and practical interview-ready automation patterns: environment-driven configuration, page objects, custom fixtures, session storage authentication, APIRequestContext checks, network assertions, route interception, deterministic test data, accessibility checks, responsive projects, trace/video/reporting, and CI-friendly execution. Functional coverage remains focused on the highest-value storefront journeys rather than duplicating every exploratory scenario.

## Test Scenarios

### 1. Framework Foundation and Test Architecture

**Seed:** `tests/seed.spec.ts`

#### 1.1. Establish environment-driven Playwright configuration

**File:** `tests/framework/configuration.spec.ts`

**Steps:**
  1. Configure a base URL from an environment variable with a safe default for the Sauce Demo storefront.
    - expect: Tests use relative paths such as /collections/all instead of repeating the full host.
    - expect: The target URL can be overridden for another environment without changing test code.
  2. Configure Chromium, Firefox, WebKit, and a mobile project with project-specific device settings.
    - expect: Desktop and mobile projects can be selected with Playwright project filters.
    - expect: The default suite remains practical to run locally while CI can execute the agreed browser matrix.
  3. Configure retries, trace-on-first-retry, HTML reporting, screenshots, and video according to local versus CI needs.
    - expect: A failed or retried test produces enough diagnostic evidence to investigate without rerunning immediately.
    - expect: Reports identify the project, test title, duration, and failure attachment.

#### 1.2. Create reusable page objects and custom fixtures

**File:** `tests/framework/fixtures-and-page-objects.spec.ts`

**Steps:**
  1. Create page objects for the home page, catalog, product detail, cart, login, and registration flows with role- or label-based locators.
    - expect: Selectors are centralized and readable.
    - expect: Page objects expose business actions such as searchProduct, addProductToCart, login, and removeCartItem rather than leaking locator details into tests.
  2. Create a custom test fixture that exposes the page objects and a generated disposable customer identity.
    - expect: Tests can request only the fixtures they need.
    - expect: Generated data is isolated per test and does not depend on a shared hard-coded account.
  3. Add an API request fixture or helper based on Playwright request context for service-level checks.
    - expect: API calls share the configured base URL and can be logged or asserted independently of browser UI.

#### 1.3. Use deterministic data and test isolation

**File:** `tests/framework/test-data-and-isolation.spec.ts`

**Steps:**
  1. Generate unique email data using the test title, worker index, and a timestamp or UUID.
    - expect: Parallel tests do not collide on account creation data.
    - expect: No real personal data or credentials are committed to the repository.
  2. Run cart and account scenarios in separate browser contexts and clear or recreate state between tests.
    - expect: A test passes or fails independently of execution order.
    - expect: A fresh test starts unauthenticated with an empty cart unless its fixture explicitly provides state.
  3. Load secrets from environment variables or CI secret storage and validate required values at runtime.
    - expect: Missing configuration fails with an actionable message.
    - expect: Passwords, tokens, and payment data never appear in source control, reports, or console output.

### 2. Customer Journey UI Coverage

**Seed:** `tests/seed.spec.ts`

#### 2.1. Validate storefront navigation and product discovery

**File:** `tests/storefront/navigation-and-catalog.spec.ts`

**Steps:**
  1. Open the home page and navigate to Catalog, About Us, Blog, Login, and Registration using accessible roles.
    - expect: Each route loads with its expected heading and no unhandled page error.
    - expect: The assertions use web-first expectations and do not rely on arbitrary sleeps.
  2. Search for jacket and open an in-stock product from the results.
    - expect: Matching products are displayed and the selected product detail page shows the expected name and price.
    - expect: The URL and page state are asserted using Playwright locators and expectations.
  3. Open a sold-out product.
    - expect: The product is visibly marked unavailable and cannot be added to the cart.

#### 2.2. Validate cart workflow with business-level assertions

**File:** `tests/storefront/cart-workflow.spec.ts`

**Steps:**
  1. Add Grey jacket to the cart through the product page.
    - expect: A cart confirmation or count update is observed.
    - expect: The cart contains one Grey jacket with the expected price.
  2. Reload the cart, change the quantity, and remove the item.
    - expect: Cart state survives navigation or the test records a clear product defect.
    - expect: Quantity, subtotal, and empty-cart state are asserted from visible business values.

### 3. API and Network Testing

**Seed:** `tests/seed.spec.ts`

#### 3.1. Assert critical network responses during catalog and search

**File:** `tests/network/catalog-network.spec.ts`

**Steps:**
  1. Register a response listener before opening Catalog and Search.
    - expect: The test observes the expected document or data requests without missing events due to late registration.
  2. Navigate to Catalog and search for jacket while waiting on the relevant response or request.
    - expect: Critical responses complete with expected HTTP status and content type.
    - expect: The UI result count and product cards are consistent with the observed response.
  3. Fail the test with request URL, status, and method when a critical response is unsuccessful.
    - expect: The failure message is actionable and does not dump sensitive headers or cookies.

#### 3.2. Use APIRequestContext for service-level verification

**File:** `tests/network/api-contracts.spec.ts`

**Steps:**
  1. Create an API request context using the configured base URL and request a public catalog or search endpoint discovered from the browser network log.
    - expect: The endpoint returns an expected status and a response shape that contains product identity and price information.
    - expect: The API test does not require a browser page when UI rendering is irrelevant.
  2. Request a deliberately invalid product or search resource.
    - expect: The service returns a controlled not-found or no-results response rather than an unhandled server error.
  3. Dispose of the request context after the test or provide it through a fixture with proper lifecycle management.
    - expect: Requests do not leak across tests or retain stale authentication state.

#### 3.3. Mock a controlled backend failure with page.route

**File:** `tests/network/route-mocking.spec.ts`

**Steps:**
  1. Intercept a non-critical image, search, or catalog request with page.route and fulfill it with a deterministic fixture response or abort it.
    - expect: The route handler is registered before navigation or the triggering action.
    - expect: The UI displays an intentional empty, unavailable, or degraded state.
  2. Remove the route handler or use a fresh context for the normal-flow test.
    - expect: Mocked behavior does not leak into other tests.
    - expect: The normal flow still uses the real storefront response.
  3. Assert that the UI presents retry or recovery behavior after a controlled network failure.
    - expect: The user receives a clear error state and the page remains interactive.

### 4. Authentication and Session Storage

**Seed:** `tests/seed.spec.ts`

#### 4.1. Create and reuse authenticated storage state

**File:** `tests/auth/setup-auth-state.spec.ts`

**Steps:**
  1. Use a setup project or authenticated fixture to create a disposable customer account or sign in with credentials supplied through environment variables.
    - expect: Authentication is performed once per suitable worker or setup dependency rather than repeated in every test.
    - expect: The setup flow verifies that the authenticated account page is actually reached.
  2. Save the authenticated browser context state to a gitignored storage-state file.
    - expect: Cookies and local storage needed for the session are persisted for dependent tests.
    - expect: The storage-state file is never committed or printed.
  3. Run an account or wishlist test using the stored state without visiting the login form.
    - expect: The test begins authenticated and can assert account-specific behavior immediately.
    - expect: A missing or expired state produces a clear setup failure.

#### 4.2. Verify session boundaries and logout

**File:** `tests/auth/session-boundaries.spec.ts`

**Steps:**
  1. Open an authenticated test with storage state and reload the account page.
    - expect: The session survives reload and protected content remains available.
  2. Log out and attempt to revisit the protected account page.
    - expect: The session is removed or invalidated and the user is redirected to login or shown an unauthenticated state.
  3. Create a new context without storage state.
    - expect: The new context is unauthenticated and cannot inherit cookies or local storage from the previous test.

#### 4.3. Validate login failures without polluting shared state

**File:** `tests/auth/login-validation.spec.ts`

**Steps:**
  1. Submit empty, malformed, and invalid login credentials in a fresh context.
    - expect: Validation and authentication errors are asserted through visible messages.
    - expect: The test does not save failed authentication state or alter the reusable authenticated state.

### 5. Route, Browser Context, and Reliability Patterns

**Seed:** `tests/seed.spec.ts`

#### 5.1. Verify request timing and action synchronization

**File:** `tests/reliability/synchronization.spec.ts`

**Steps:**
  1. Use locator assertions, waitForURL, and page.waitForResponse only around known business events while adding an item and opening the cart.
    - expect: The test waits for observable application state rather than fixed timeouts.
    - expect: A slow but successful response does not cause a false failure.
  2. Run the same cart flow repeatedly in isolated contexts.
    - expect: The outcome is stable and no stale cookies, local storage, or route handlers affect later runs.

#### 5.2. Capture console and page errors as test diagnostics

**File:** `tests/reliability/diagnostics.spec.ts`

**Steps:**
  1. Attach pageerror and console listeners for a critical smoke test.
    - expect: Unexpected browser errors are captured with the current URL and test title.
    - expect: Expected noise can be filtered deliberately without hiding real application errors.
  2. Run the smoke flow across at least one desktop and one mobile project.
    - expect: Diagnostics identify which browser and viewport produced a failure.

#### 5.3. Exercise accessible and resilient locators

**File:** `tests/reliability/locators-and-accessibility.spec.ts`

**Steps:**
  1. Locate navigation, form fields, buttons, and headings using getByRole, getByLabel, and getByText where appropriate.
    - expect: Tests remain readable and avoid brittle CSS or generated class selectors.
  2. Assert visible focus, accessible names, form labels, and keyboard activation on the critical journey.
    - expect: Keyboard users can reach and operate the main controls.
    - expect: Accessibility regressions fail with a meaningful locator or assertion message.

### 6. CI and Showcase Evidence

**Seed:** `tests/seed.spec.ts`

#### 6.1. Define smoke, regression, and network test tags

**File:** `tests/ci/test-tagging.spec.ts`

**Steps:**
  1. Tag the homepage, search, product, cart, and login checks as smoke; tag deeper validation and network tests as regression or network.
    - expect: Developers can run a fast smoke command and a broader regression command using Playwright grep or projects.
    - expect: The tag strategy is documented and consistent across the suite.
  2. Run the suite in CI mode with retries and one worker where configured.
    - expect: The run is deterministic and produces an HTML report plus trace artifacts for retries.
    - expect: Failures include the test title, project, and relevant attachments.

#### 6.2. Document the automation architecture and tradeoffs

**File:** `tests/ci/project-documentation.spec.ts`

**Steps:**
  1. Document how to install dependencies, configure environment variables, run smoke/regression/network tests, and open the report.
    - expect: A new engineer can run the project without reverse-engineering the repository.
  2. Document why UI, API, and network tests exist and which checks are intentionally not duplicated.
    - expect: The project demonstrates a balanced test pyramid rather than using browser UI for every assertion.
