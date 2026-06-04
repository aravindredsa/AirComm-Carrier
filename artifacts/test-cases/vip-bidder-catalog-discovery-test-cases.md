# Test Case Package - VIP Bidder Catalog Discovery

## Inputs Summary
- User story:
As a customer or sales agent
I want to discover eligible products using searchable and filterable catalog views
So that I can identify purchase-ready products quickly and accurately
- Acceptance criteria source: artifacts/user-stories/UserStories_2026-06-04.md (Story ID: US-UI-01)
- Business rules source: artifacts/user-stories/UserStories_2026-06-04.md (BR-UI-01-01 through BR-UI-01-03)
- UI evidence: ACP UI/UX screen design attachment (Home, Product Listing Page, Product Detail Page); implemented UI in react-ts-project/src/features/catalog/CatalogExperience.tsx
- Additional evidence: react-ts-project/src/features/catalog/useCatalog.ts, react-ts-project/src/features/catalog/catalog.utils.ts, react-ts-project/src/features/catalog/catalog.constants.ts

## Acceptance Criteria Map
- AC-1: When a valid keyword and filters are entered, the UI returns matching product cards with correct count and allows product selection.
- AC-2: When a user clears filters, the UI resets to baseline listing state and supports immediate new search input.
- AC-3: When unsupported filter combinations are entered, the UI blocks submission and shows a deterministic validation message.
- AC-4: When catalog API is unavailable, the UI shows an actionable error state and disables add-to-cart actions until recovery.

## Business Rules Map
- BR-1: Catalog search and filtering must only expose products allowed by active channel and role context.
- BR-2: Product availability status displayed in catalog must reflect latest inventory projection response.
- BR-3: Filter reset action must clear all active filters and return default listing behavior.

## UI Evidence Inventory
- Exact labels, controls, and visible values:
- Header and context labels: Agent Commerce Platform (ACP), VIP Bidder catalog, Platform: E-Commerce, Role: Sales Agent or Customer, Version 1.0
- Filter controls: Filters, Clear all, Search products, Brand, Price up to, Storage, Color, Availability, Apply filters, Reset filters
- Sort and results controls: Sort by, Best match, Price: Low to High, Price: High to Low, Top rated
- Results/detail controls: View details, Add to cart, Unavailable, Back to catalog results, Select color, Select storage, Buy now
- Role and state labels: Permission denied, Allowed navigation: customer storefront or agent sales portal.
- Validation and error labels: Search term is outside allowed length range (2-40 characters)., One or more filter values are invalid., Catalog API is unavailable, Retry catalog load
- State panel labels: Loading eligible products, No products matched the current criteria
- Inventory labels: In stock, Low stock, Pre-order, Out of stock

## Mismatches And Gaps
- GAP-001: Story says error state includes telemetry correlation id, but implemented UI error panel does not render a visible correlation id token.
- GAP-002: Story precondition says role and channel context are enforced; implemented UI enforces role only (customer, sales-agent) and has no explicit channel selector/control.
- GAP-003: UI evidence image shows PLP wording and broader navigation shells; implemented UI uses VIP Bidder catalog shell and does not include those exact top navigation controls.
- GAP-004: Story says unsupported filter combinations should be blocked; implemented validation enforces unsupported values but not cross-field combination constraints.

## Open Questions
- Q-001: What exact UI label format is required for correlation id in error state (for example: Correlation ID: <value>)?
- Q-002: Which channel contexts must be validated in UI scope (storefront, agent portal, additional channels)?
- Q-003: Are there expected invalid filter combinations beyond domain-value validation (for example brand-storage incompatibility) that must return deterministic UI errors?

## Detailed Test Cases

### TC-01: Search with valid keyword and supported filters returns eligible results
Type: Positive
Layer: UI
Priority: P1
Linked to: AC-1 | BR-1 | BR-2
Preconditions: Role is customer; catalog service returns available products; baseline page is loaded with status Success.

| # | Action | Expected Result |
|---|---|---|
| 1 | Enter Pro in Search products. | Search products field shows Pro. |
| 2 | In Brand, check Apple; in Storage, select 256 GB; in Availability, check In stock. | Selected filter controls show active state. |
| 3 | Select Sort by = Best match. | Sort by shows Best match. |
| 4 | Click Apply filters. | Results area refreshes and shows a non-zero count as [n] products available. |
| 5 | Inspect each visible product card. | Each card shows brand Apple, availability In stock or Low stock per selected filters, and enabled View details button. |
| 6 | Click View details for first product. | Product detail page opens and Back to catalog results is visible with previously applied filter context preserved after returning. |

Automation: YES - Stable role/label-based selectors are available and behavior is deterministic.

### TC-02: Reset filters restores baseline listing behavior
Type: Positive
Layer: UI
Priority: P1
Linked to: AC-2 | BR-3
Preconditions: Role is customer; at least one filter and search term are active from prior query.

| # | Action | Expected Result |
|---|---|---|
| 1 | Verify Search products contains Pro and at least one active filter exists. | Non-baseline filtered state is visible. |
| 2 | Click Reset filters. | Search products is cleared to empty string. |
| 3 | Verify Sort by value. | Sort by is reset to Best match. |
| 4 | Verify results area after reload completes. | Baseline listing appears with products available count and no stale filter constraints. |

Automation: YES - Clear deterministic reset actions and observable baseline state.

### TC-03: Invalid search term length blocks submission with deterministic message
Type: Negative
Layer: UI
Priority: P1
Linked to: AC-3
Preconditions: Role is customer; baseline page loaded.

| # | Action | Expected Result |
|---|---|---|
| 1 | Enter A in Search products. | Search products shows A. |
| 2 | Click Apply filters. | Inline alert appears: Search term is outside allowed length range (2-40 characters). |
| 3 | Observe results list and state. | Existing results are not replaced by a new query response. |

Automation: YES - Exact error text and no-request behavior can be asserted reliably.

### TC-04: Invalid filter value returns deterministic validation message
Type: Negative
Layer: UI
Priority: P1
Linked to: AC-3 | BR-1
Preconditions: Role is customer; test harness allows injecting invalid filter value outside UI control set.

| # | Action | Expected Result |
|---|---|---|
| 1 | Programmatically set filtersDraft.brands to include Nokia and click Apply filters. | Submission is blocked before query execution. |
| 2 | Observe validation area. | Inline alert appears: One or more filter values are invalid. |
| 3 | Inspect results list state. | Product payload is unchanged and no new catalog fetch result is rendered. |

Automation: YES (with caveat) - Requires controlled test harness to inject unsupported values not selectable in normal UI.

### TC-05: Catalog API outage shows actionable error state and recovery action
Type: Failure
Layer: Integration
Priority: P1
Linked to: AC-4
Preconditions: Role is customer; catalog service dependency is stubbed to fail with Catalog API is unavailable. Please retry to continue.

| # | Action | Expected Result |
|---|---|---|
| 1 | Load page while catalog service endpoint is unavailable. | Error panel appears with heading Catalog API is unavailable. |
| 2 | Inspect error description and actions. | Retry catalog load button is visible; purchase actions are not displayed because product list is not rendered. |
| 3 | Restore service and click Retry catalog load. | Loading eligible products state appears, then results return to Success state. |

Automation: YES - Failure and retry behavior are deterministic with service stubbing.

### TC-06: Unsupported role is blocked with permission denied state
Type: Negative
Layer: UI
Priority: P1
Linked to: BR-1
Preconditions: Session role is store-manager (or any role other than customer/sales-agent).

| # | Action | Expected Result |
|---|---|---|
| 1 | Open catalog page with unsupported role context. | Permission denied panel is displayed. |
| 2 | Validate message body. | Text includes Allowed navigation: customer storefront or agent sales portal. |
| 3 | Inspect interactive controls. | Search products, filter controls, and product actions are not available. |

Automation: YES - Permission denied page is role-gated and stable.

### TC-07: Availability status controls purchasable actions correctly
Type: Negative
Layer: UI
Priority: P1
Linked to: BR-2 | AC-1
Preconditions: Role is customer; dataset includes at least one Out of stock product.

| # | Action | Expected Result |
|---|---|---|
| 1 | Load catalog results and locate card with stock pill Out of stock. | Product card is visible with Out of stock label. |
| 2 | Inspect product action area for that card. | Primary action button text is Unavailable and button is disabled. |
| 3 | Open product detail view for same product. | Detail page purchase card also shows Unavailable disabled. |

Automation: YES - Deterministic mapping from availability to button state.

### TC-08: Edge availability values remain selectable and purchasable where allowed
Type: Edge
Layer: UI
Priority: P2
Linked to: BR-2
Preconditions: Role is sales-agent; dataset includes Low stock and Pre-order products.

| # | Action | Expected Result |
|---|---|---|
| 1 | Apply Availability filter Low stock. | Results show products with Low stock stock pill. |
| 2 | Verify action availability on Low stock cards. | Add to cart remains enabled. |
| 3 | Apply Availability filter Pre-order. | Results show products with Pre-order stock pill. |
| 4 | Verify action availability on Pre-order cards. | Add to cart remains enabled. |

Automation: YES - Edge inventory states and action mapping are explicitly rendered.

### TC-09: Clear all action removes active filter checkboxes and chips
Type: Edge
Layer: UI
Priority: P2
Linked to: BR-3 | AC-2
Preconditions: Role is customer; active selections exist in Brand, Storage, Color, and Availability.

| # | Action | Expected Result |
|---|---|---|
| 1 | With active filters set, click Clear all. | All Brand and Availability checkboxes are unchecked. |
| 2 | Inspect Storage and Color chips/swatch filters. | No chip or swatch remains in active style. |
| 3 | Inspect Search products and Sort by. | Search products is empty and Sort by is Best match. |

Automation: YES - UI control state reset is explicit and observable.

### TC-10: Empty-state guidance is shown for valid no-match criteria
Type: Edge
Layer: UI
Priority: P2
Linked to: AC-1
Preconditions: Role is customer; service returns zero records for selected valid criteria.

| # | Action | Expected Result |
|---|---|---|
| 1 | Enter Pixel in Search products, then set Brand to Apple and click Apply filters. | Query executes with valid inputs. |
| 2 | Observe results panel after loading completes. | Empty state panel displays No products matched the current criteria. |
| 3 | Click Reset filters in empty panel. | Baseline listing reloads with products available count restored. |

Automation: YES - Empty path is deterministic from controlled data.

### TC-11: Sort options reorder same result set deterministically
Type: Edge
Layer: UI
Priority: P2
Linked to: BR-1
Preconditions: Role is customer; at least three products are visible in baseline results.

| # | Action | Expected Result |
|---|---|---|
| 1 | Note first three product names under Sort by = Best match. | Baseline order is recorded. |
| 2 | Change Sort by to Price: Low to High. | First product has lowest visible full retail price among displayed cards. |
| 3 | Change Sort by to Price: High to Low. | First product has highest visible full retail price among displayed cards. |
| 4 | Change Sort by to Top rated. | First product has highest visible stars value among displayed cards. |

Automation: YES - Sort label values and outcomes are explicit and repeatable with seeded data.

## Coverage Summary
- Feature: VIP Bidder catalog discovery
- Total test cases: 11
- Positive: 2
- Negative: 3
- Edge: 5
- Failure: 1

### AC Coverage
- AC-1: TC-01, TC-07, TC-10
- AC-2: TC-02, TC-09
- AC-3: TC-03, TC-04
- AC-4: TC-05

### BR Coverage
- BR-1: Positive TC-01 | Negative TC-06 | Edge TC-11
- BR-2: Positive TC-01 | Negative TC-07 | Edge TC-08
- BR-3: Positive TC-02 | Negative TC-02 (stale constraints absent after reset) | Edge TC-09

### Automation Summary
- YES: 10
- NO: 0
- YES (with caveat): 1

## Scenario Planning Handoff
- Scenario plan path: artifacts/test-scenarios/vip-bidder-catalog-discovery-scenario-plan.md
- Blocking questions to resolve before scripting:
- Confirm required channel context values and whether channel is UI-visible or session-inferred.
- Confirm mandatory correlation id rendering format in error state.
- Confirm whether combination-rule validation is required in addition to unsupported value validation.