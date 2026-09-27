# Sauce Demo Storefront Test Plan

## Application Overview

A functional and UX test plan for https://sauce-demo.myshopify.com/, covering storefront navigation, catalog and product discovery, search, cart and checkout entry points, customer account workflows, wishlist/referral interactions, content pages, validation, accessibility, and responsive behavior. Each scenario assumes a fresh browser context and starts with an empty cart unless stated otherwise. Use disposable test data for account and checkout scenarios; do not use real payment or personal information.

## Test Scenarios

### 1. Storefront Navigation and Content

**Seed:** `tests/seed.spec.ts`

#### 1.1. Verify homepage loads with core navigation and featured products

**File:** `tests/storefront/homepage-navigation.spec.ts`

**Steps:**
  1. Open https://sauce-demo.myshopify.com/ in a fresh browser context.
    - expect: The page loads without an unhandled error.
    - expect: The Sauce Demo branding and store description are visible.
    - expect: Header search, Log In, Sign up, My Cart, and Check Out controls are present.
    - expect: Home, Catalog, Blog, About Us, Wish list, and Refer a friend navigation items are available.
    - expect: Featured product cards display product names, images, and prices.
  2. Activate Home, Catalog, Blog, and About Us one at a time.
    - expect: Each control navigates to the correct page and the destination has a meaningful heading.
    - expect: The browser back and forward controls preserve usable navigation state.

#### 1.2. Verify About Us and Blog content pages

**File:** `tests/storefront/content-pages.spec.ts`

**Steps:**
  1. Open the About Us page from the primary navigation.
    - expect: The About Us page loads with the expected heading and readable content.
    - expect: Images, links, and footer content do not overlap or render as broken placeholders.
  2. Open the Blog page and select an available post if present.
    - expect: The blog index loads successfully.
    - expect: Available post titles are selectable and open the correct article.
    - expect: The article layout remains readable on a narrow viewport.

#### 1.3. Verify responsive layout and keyboard access

**File:** `tests/storefront/responsive-accessibility.spec.ts`

**Steps:**
  1. Open the homepage at desktop and mobile viewport sizes.
    - expect: Header, navigation, product cards, and footer remain visible and usable without horizontal scrolling.
    - expect: Text, prices, controls, and images do not overlap or become clipped.
  2. Use keyboard Tab navigation from the top of the page.
    - expect: Focusable controls receive a visible focus indicator in logical order.
    - expect: Search, navigation links, product links, and account/cart controls can be reached and activated with the keyboard.
    - expect: Images that convey product meaning have accessible names.

### 2. Catalog, Search, and Product Discovery

**Seed:** `tests/seed.spec.ts`

#### 2.1. Browse the complete catalog and distinguish sold-out products

**File:** `tests/catalog/catalog-browse.spec.ts`

**Steps:**
  1. Open Catalog from a fresh browser context.
    - expect: The Products page loads successfully.
    - expect: All available catalog cards render with product names and prices.
    - expect: Sold-out products are clearly marked as sold out.
  2. Open an in-stock product and then a sold-out product.
    - expect: Each product link opens the matching product detail page.
    - expect: The in-stock page exposes an enabled Add to Cart action.
    - expect: The sold-out page prevents purchase or clearly communicates unavailable inventory.

#### 2.2. Search for matching, non-matching, and boundary queries

**File:** `tests/catalog/search.spec.ts`

**Steps:**
  1. Search for jacket using the header search field.
    - expect: Search results show the matching result count or equivalent status.
    - expect: Relevant jacket products are listed with correct names, prices, and links.
  2. Search for a term that matches no product, such as zzz-no-match.
    - expect: The page clearly reports that no results were found.
    - expect: No unrelated product is presented as a match.
  3. Submit an empty query, a query with leading/trailing spaces, and a query using mixed case.
    - expect: The application handles each query without a server error.
    - expect: Whitespace and case behavior is consistent and understandable.

#### 2.3. Verify in-stock product details and add-to-cart control

**File:** `tests/catalog/product-detail.spec.ts`

**Steps:**
  1. Open the Grey jacket product page.
    - expect: The product title, image, price of £55.00, variant selector, and description are visible.
    - expect: The variant selector has a valid selected option.
    - expect: Add to Cart is enabled for the in-stock product.
  2. Select the available product option and activate Add to Cart once.
    - expect: A success state or cart-count update is shown.
    - expect: The selected product is added exactly once with the correct name and price.
    - expect: The user can reach the cart from the product page.

### 3. Cart and Checkout

**Seed:** `tests/seed.spec.ts`

#### 3.1. Maintain cart state after adding an in-stock product

**File:** `tests/cart/cart-add-and-persist.spec.ts`

**Steps:**
  1. Open Grey jacket from the catalog and activate Add to Cart.
    - expect: The cart count changes from zero or a clear confirmation is displayed.
    - expect: The cart contains one Grey jacket line item at £55.00.
  2. Open the cart using the cart link and reload the page.
    - expect: The line item, quantity, subtotal, and total remain correct after navigation and reload.
    - expect: The empty-cart message is not shown when an item has been added.

#### 3.2. Update quantity, remove items, and recover an empty cart

**File:** `tests/cart/cart-management.spec.ts`

**Steps:**
  1. Add an in-stock product and open the cart.
    - expect: The cart shows the item and an editable quantity control or equivalent update mechanism.
  2. Set the quantity to 2, attempt zero, a negative value, a non-numeric value, and a very large value one at a time.
    - expect: Valid quantities update the line total and cart total correctly.
    - expect: Invalid values are rejected or normalized with a clear validation response.
    - expect: The page does not produce a negative, NaN, or otherwise invalid total.
  3. Remove the item from the cart.
    - expect: The item is removed, totals reset, and the empty-cart state is displayed.
    - expect: Continue Shopping returns to the catalog.

#### 3.3. Enter checkout from a non-empty cart

**File:** `tests/cart/checkout-entry.spec.ts`

**Steps:**
  1. Add an in-stock product and select Check Out.
    - expect: Checkout is available only when the cart contains a purchasable item.
    - expect: The checkout page loads over HTTPS and preserves the item and total.
  2. Submit checkout with all required fields empty.
    - expect: Required-field validation appears beside or near each missing field.
    - expect: The order is not submitted.
  3. Enter valid disposable contact and shipping data, then use invalid and valid payment test inputs where the environment supports them.
    - expect: Invalid data is rejected with actionable messages.
    - expect: Valid test data advances to the confirmation step or the environment clearly reports that payment is disabled.
    - expect: No real payment is charged and no sensitive payment value is exposed in page text or logs.

### 4. Customer Accounts

**Seed:** `tests/seed.spec.ts`

#### 4.1. Validate account registration

**File:** `tests/account/registration.spec.ts`

**Steps:**
  1. Open Sign up from a fresh browser context.
    - expect: Create Account displays First Name, Last Name, Email Address, Password, and Create controls.
  2. Submit the empty form, malformed email addresses, a weak password, and mismatched or duplicate account data where applicable.
    - expect: Required and format validation is shown.
    - expect: The form does not create an account with invalid data.
  3. Submit valid disposable registration data.
    - expect: The account is created or a clear environment-specific response is shown.
    - expect: The resulting state is authenticated or provides a clear next step without exposing the password.

#### 4.2. Validate login, logout, and password recovery

**File:** `tests/account/login.spec.ts`

**Steps:**
  1. Open Log In and submit empty, malformed, and incorrect credentials.
    - expect: Email and password validation is displayed.
    - expect: Incorrect credentials do not authenticate the user and produce a clear error.
  2. Log in with a valid disposable account created for this test.
    - expect: The account page or authenticated state loads.
    - expect: Account navigation changes appropriately and the session survives a page reload.
  3. Log out, reopen Log In, and activate Forgot your password?.
    - expect: The session ends and protected account state is no longer visible.
    - expect: The recovery flow opens or clearly reports its availability.
    - expect: Recovery validation prevents an invalid or empty email submission.

### 5. Wishlist and Referral Interactions

**Seed:** `tests/seed.spec.ts`

#### 5.1. Verify wishlist behavior for anonymous and authenticated users

**File:** `tests/account/wishlist.spec.ts`

**Steps:**
  1. From a fresh anonymous context, activate Wish list.
    - expect: The wishlist interaction opens a visible panel, dialog, or destination instead of silently failing.
    - expect: The interface communicates whether sign-in is required.
  2. Attempt to add an in-stock product to the wishlist and repeat the action.
    - expect: The product is added once and duplicate actions do not create duplicate entries.
    - expect: The saved state is visible after navigation or reload when persistence is supported.
  3. Sign in and repeat the wishlist flow.
    - expect: The authenticated wishlist is associated with the correct account and can be removed.

#### 5.2. Validate refer-a-friend form

**File:** `tests/account/referral.spec.ts`

**Steps:**
  1. Activate Refer a friend from a fresh context.
    - expect: A visible referral form or dialog opens with labeled fields and a submit action.
  2. Submit empty, malformed, and valid disposable referral data.
    - expect: Required and email-format validation works.
    - expect: Valid submission shows a success or confirmation state.
    - expect: Repeated submission does not create an uncontrolled duplicate or expose entered data publicly.

### 6. Error Handling and Release Regression

**Seed:** `tests/seed.spec.ts`

#### 6.1. Verify graceful handling of unavailable routes and failed actions

**File:** `tests/regression/error-handling.spec.ts`

**Steps:**
  1. Open a nonexistent storefront route and follow any invalid product or search URL.
    - expect: The application shows a usable not-found or no-results state.
    - expect: The header and recovery navigation remain available.
  2. Throttle or interrupt a search, cart update, or account submission where the test environment permits.
    - expect: The user receives a clear failure or retry state.
    - expect: Controls do not remain permanently disabled and no duplicate request is submitted on retry.

#### 6.2. Run critical smoke regression from a fresh browser context

**File:** `tests/regression/smoke.spec.ts`

**Steps:**
  1. Load the homepage, catalog, one in-stock product, cart, login, registration, search, About Us, and Blog pages in sequence.
    - expect: All critical routes return successfully and render their primary heading/content.
    - expect: No uncaught page error blocks the primary customer journey.
    - expect: The cart starts empty for the fresh context and account state is unauthenticated.
