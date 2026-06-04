# Phase 1 Locator Inventory - VIP Bidder Catalog Discovery

## Evidence Sources
- react-ts-project/src/features/catalog/CatalogExperience.tsx
- react-ts-project/src/features/catalog/catalog.constants.ts
- artifacts/test-cases/vip-bidder-catalog-discovery-test-cases.md

## Locator Strategy Rules Applied
- Prefer id, then role/name, then aria-label patterns from DOM evidence.
- Do not invent missing stable selectors.
- Use PLACEHOLDER where deterministic locator cannot be guaranteed from source evidence.

## Catalog Results Page Locators

| Element | Preferred Locator | Selector/Pattern | Evidence | Verification |
|---|---|---|---|---|
| Catalog title | By.id | `catalog-title` | `h1 id="catalog-title"` | VERIFIED |
| Filters heading | By.id | `filters-title` | `h2 id="filters-title"` | VERIFIED |
| Search products input | By.id | `search-products` | `input id="search-products"` | VERIFIED |
| Sort select | By.id | `sort-products` | `select id="sort-products"` | VERIFIED |
| Clear all button | By.role+name | `button[name='Clear all']` | button text | VERIFIED |
| Apply filters button | By.role+name | `button[name='Apply filters']` | button text | VERIFIED |
| Reset filters button | By.role+name | `button[name='Reset filters']` | button text (two contexts) | VERIFIED |
| Brand checkbox (Apple) | By.label | `checkbox[label='Apple']` | wrapped label with text | VERIFIED |
| Brand checkbox (Samsung) | By.label | `checkbox[label='Samsung']` | wrapped label with text | VERIFIED |
| Brand checkbox (Google) | By.label | `checkbox[label='Google']` | wrapped label with text | VERIFIED |
| Availability checkbox (In stock) | By.label | `checkbox[label='In stock']` | mapped label text | VERIFIED |
| Availability checkbox (Low stock) | By.label | `checkbox[label='Low stock']` | mapped label text | VERIFIED |
| Availability checkbox (Pre-order) | By.label | `checkbox[label='Pre-order']` | mapped label text | VERIFIED |
| Availability checkbox (Out of stock) | By.label | `checkbox[label='Out of stock']` | mapped label text | VERIFIED |
| Color filter toggle | By.aria-label | `button[aria-label='Toggle <Color> color filter']` | explicit aria-label pattern | VERIFIED |
| Product listing heading | By.id | `results-title` | `h2 id='results-title'` | VERIFIED |
| Loading panel heading | By.text | `Loading eligible products` | status panel text | VERIFIED |
| Error panel heading | By.text | `Catalog API is unavailable` | status panel text | VERIFIED |
| Retry button | By.role+name | `button[name='Retry catalog load']` | button text | VERIFIED |
| Empty panel heading | By.text | `No products matched the current criteria` | status panel text | VERIFIED |
| Products available summary | By.text pattern | `<n> products available` | template string in JSX | VERIFIED |
| Product card container | By.css | `.product-card` | className in JSX | VERIFIED |
| Product "View details" action | By.aria-label pattern | `button[aria-label='View <ProductName>']` | explicit aria-label pattern | VERIFIED |
| Product "Add to cart" action | By.aria-label pattern | `button[aria-label='Add <ProductName> to cart']` | explicit aria-label pattern | VERIFIED |
| Disabled action text | By.text | `Unavailable` | conditional button text | VERIFIED |

## Product Detail Page Locators

| Element | Preferred Locator | Selector/Pattern | Evidence | Verification |
|---|---|---|---|---|
| Detail heading | By.id | `detail-title` | `h2 id='detail-title'` | VERIFIED |
| Back to results button | By.role+name | `button[name='Back to catalog results']` | button text | VERIFIED |
| Color section heading | By.id | `detail-colors-title` | `h3 id='detail-colors-title'` | VERIFIED |
| Storage section heading | By.id | `detail-storage-title` | `h3 id='detail-storage-title'` | VERIFIED |
| Gallery thumbnail row | By.aria-label | `Product gallery thumbnails` | `aria-label` on container | VERIFIED |
| Gallery color thumbnail | By.aria-label pattern | `button[aria-label='Select <Color>']` | explicit aria-label pattern | VERIFIED |
| Detail color option button | By.role+name | `button[name='<Color>']` | visible button text | VERIFIED |
| Detail storage option button | By.role+name | `button[name='<Storage>']` | visible button text | VERIFIED |
| Detail primary action | By.role+name | `button[name='Add to cart'|'Unavailable']` | conditional button text | VERIFIED |
| Detail secondary action | By.role+name | `button[name='Buy now']` | button text | VERIFIED |

## Permission Page Locators

| Element | Preferred Locator | Selector/Pattern | Evidence | Verification |
|---|---|---|---|---|
| Permission heading | By.id | `permission-title` | `h1 id='permission-title'` | VERIFIED |
| Permission banner text | By.text | `Permission denied` | status panel text | VERIFIED |
| Allowed navigation text | By.text | `Allowed navigation: customer storefront or agent sales portal.` | status panel text | VERIFIED |

## PLACEHOLDER / UNVERIFIED Entries

| Element | Placeholder | Reason |
|---|---|---|
| Price slider direct selector | `PLACEHOLDER_PRICE_RANGE_LOCATOR` | No id/name/test-id; only class `range-input` found. |
| Results grid indexable row selector | `PLACEHOLDER_RESULTS_ROW_LOCATOR` | No explicit test-id or deterministic data attribute for row indexing. |
| Correlation id label | `PLACEHOLDER_CORRELATION_ID_LOCATOR` | Story expects correlation id but DOM evidence has no correlation id element. |