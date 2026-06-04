# Test Case Package - VIP Bidder Catalog Discovery Scenario Plan

## Inputs Summary
- User story:
As a customer or sales agent
I want to discover eligible products using searchable and filterable catalog views
So that I can identify purchase-ready products quickly and accurately
- Acceptance criteria source: artifacts/user-stories/UserStories_2026-06-04.md (Story ID: US-UI-01)
- Business rules source: artifacts/user-stories/UserStories_2026-06-04.md (BR-UI-01-01 through BR-UI-01-03)
- UI evidence: ACP UI/UX screen design attachment and implemented UI flow in react-ts-project/src/features/catalog/CatalogExperience.tsx
- Additional evidence: react-ts-project/src/features/catalog/useCatalog.ts and catalog validation logic

## Acceptance Criteria Map
- AC-1: Valid keyword and supported filters return matching product cards and correct count.
- AC-2: Reset action returns baseline listing and allows new search.
- AC-3: Unsupported filter input is blocked with deterministic validation.
- AC-4: API outage presents actionable error and disables purchase path until recovery.

## Business Rules Map
- BR-1: Eligibility must be constrained by role/channel context.
- BR-2: Availability labels and purchasable state must reflect latest inventory projection response.
- BR-3: Reset operations must clear active constraints and return default behavior.

## UI Evidence Inventory
- Exact labels, controls, and visible values:
- Search and filter labels: Search products, Brand, Price up to, Storage, Color, Availability, Apply filters, Reset filters, Clear all
- Results and actions: Eligible devices for VIP Bidder, Sort by, View details, Add to cart, Unavailable
- State labels: Loading eligible products, No products matched the current criteria, Catalog API is unavailable, Retry catalog load, Permission denied
- Detail labels: Back to catalog results, Select color, Select storage, Buy now

## Mismatches And Gaps
- GAP-001: Correlation id text required by story is not currently visible in implemented error panel.
- GAP-002: Story references role and channel gating; implemented UI currently exposes role gating only.
- GAP-003: Design image includes broader shell/navigation elements not present in implemented module.

## Open Questions
- Q-001: Which exact channel values are supported and where are they sourced for UI/API tests?
- Q-002: Is correlation id required to be visible to claimant, or only present in logs/telemetry?
- Q-003: Are cross-filter combination constraints required beyond domain-value checks?

## Detailed Test Cases

### TC-01: Smoke - catalog default load for allowed role
Type: Positive
Layer: UI
Priority: P1
Linked to: AC-1 | BR-1
Preconditions: Role is customer or sales-agent; catalog dependency reachable.

| # | Action | Expected Result |
|---|---|---|
| 1 | Open VIP Bidder catalog page. | Header and filter panel render with search/filter controls enabled. |
| 2 | Wait for initial load completion. | Status transitions from Loading eligible products to Success or Empty without error panel. |

Automation: YES - Suitable as smoke baseline for each execution cycle.

### TC-02: Regression - keyword plus multi-filter happy path
Type: Positive
Layer: UI
Priority: P1
Linked to: AC-1 | BR-1 | BR-2
Preconditions: Allowed role; seeded catalog has matching inventory.

| # | Action | Expected Result |
|---|---|---|
| 1 | Set Search products to Pro, Brand to Apple, Availability to In stock, then click Apply filters. | Filtered cards and products available count reflect constrained, eligible result set. |
| 2 | Click View details on first card and return using Back to catalog results. | Detail transition succeeds and returns to catalog list context. |

Automation: YES - High-value regression scenario with deterministic assertions.

### TC-03: Regression - reset and clear baseline recovery
Type: Edge
Layer: UI
Priority: P1
Linked to: AC-2 | BR-3
Preconditions: Active filters and non-empty search term are present.

| # | Action | Expected Result |
|---|---|---|
| 1 | Click Reset filters. | Search term, filter selections, and sort return to baseline defaults. |
| 2 | Re-apply one filter set, then click Clear all. | All filter controls return to non-selected state. |

Automation: YES - Directly validates stale-constraint prevention.

### TC-04: Negative - invalid search length blocked locally
Type: Negative
Layer: UI
Priority: P1
Linked to: AC-3
Preconditions: Allowed role; page loaded.

| # | Action | Expected Result |
|---|---|---|
| 1 | Enter A in Search products and click Apply filters. | Inline validation appears: Search term is outside allowed length range (2-40 characters). |
| 2 | Observe results region. | No new successful query result is rendered. |

Automation: YES - Stable local validation behavior.

### TC-05: Negative - unsupported filter value rejected deterministically
Type: Negative
Layer: UI
Priority: P1
Linked to: AC-3 | BR-1
Preconditions: Harness allows invalid filter payload injection.

| # | Action | Expected Result |
|---|---|---|
| 1 | Inject invalid brand value (Nokia) into filter state and trigger Apply filters. | Deterministic validation appears: One or more filter values are invalid. |
| 2 | Check product list. | No updated payload is rendered from query execution. |

Automation: YES (with caveat) - Requires test-only state manipulation or API interception.

### TC-06: Failure - catalog dependency outage and retry recovery
Type: Failure
Layer: Integration
Priority: P1
Linked to: AC-4
Preconditions: Dependency mock returns service outage, then healthy response.

| # | Action | Expected Result |
|---|---|---|
| 1 | Trigger catalog load while service is unavailable. | Error panel displays Catalog API is unavailable and Retry catalog load control. |
| 2 | Restore dependency and click Retry catalog load. | View returns to loading then success/empty state; purchase path visible only on successful results. |

Automation: YES - Critical dependency failure scenario.

### TC-07: Security/permission - unsupported role denied access
Type: Negative
Layer: UI
Priority: P1
Linked to: BR-1
Preconditions: Session role is unsupported.

| # | Action | Expected Result |
|---|---|---|
| 1 | Open module with role outside customer/sales-agent. | Permission denied panel appears and product controls are not rendered. |
| 2 | Verify guidance message. | Allowed navigation: customer storefront or agent sales portal. is visible. |

Automation: YES - Strong regression candidate for auth boundary checks.

### TC-08: Inventory edge - low stock and pre-order action behavior
Type: Edge
Layer: UI
Priority: P2
Linked to: BR-2
Preconditions: Dataset contains Low stock and Pre-order products.

| # | Action | Expected Result |
|---|---|---|
| 1 | Filter Availability to Low stock then Pre-order in separate runs. | Stock labels display correctly and Add to cart remains enabled for both states. |

Automation: YES - Validates edge inventory rendering and action state.

### TC-09: Availability negative - out of stock blocks purchase action
Type: Negative
Layer: UI
Priority: P1
Linked to: BR-2
Preconditions: Dataset includes Out of stock item.

| # | Action | Expected Result |
|---|---|---|
| 1 | Locate out-of-stock product in list or detail view. | Primary action text is Unavailable and control is disabled. |

Automation: YES - Deterministic, high-value guardrail scenario.

### TC-10: Empty-results scenario with guided reset
Type: Edge
Layer: UI
Priority: P2
Linked to: AC-1 | BR-3
Preconditions: Query combination returns no matches.

| # | Action | Expected Result |
|---|---|---|
| 1 | Apply a valid no-match combination (for example Search products Pixel with Brand Apple). | Empty state panel appears with No products matched the current criteria. |
| 2 | Click Reset filters from empty panel. | Baseline list is restored. |

Automation: YES - Deterministic scenario from controlled data.

## Coverage Summary
- Feature: VIP Bidder catalog discovery scenario plan
- Total test cases: 10
- Positive: 2
- Negative: 4
- Edge: 3
- Failure: 1

### AC Coverage
- AC-1: TC-01, TC-02, TC-10
- AC-2: TC-03
- AC-3: TC-04, TC-05
- AC-4: TC-06

### BR Coverage
- BR-1: Positive TC-02 | Negative TC-07 | Edge TC-01
- BR-2: Positive TC-02 | Negative TC-09 | Edge TC-08
- BR-3: Positive TC-03 | Negative TC-03 (assert stale constraints absent after reset) | Edge TC-10

### Automation Summary
- YES: 9
- NO: 0
- YES (with caveat): 1

## Scenario Planning Handoff
- Scenario plan path: artifacts/test-scenarios/vip-bidder-catalog-discovery-scenario-plan.md
- Blocking questions to resolve before scripting:
- Confirm channel-context test matrix and required claimant journeys per channel.
- Confirm whether correlation id must be visible in UI expected results.
- Confirm required invalid combination matrix if value-domain validation is not sufficient.