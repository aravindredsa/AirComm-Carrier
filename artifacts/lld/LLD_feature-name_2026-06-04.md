# Low Level Design - Agent Commerce Platform

## 1. Document Header
- Title: Low Level Design for Agent Commerce Platform (ACP)
- Version: 1.0
- Date: 2026-06-04
- Source FRD reference: provided ([artifacts/functional-requirements/FunctionalRequirements_2026-06-04.md](artifacts/functional-requirements/FunctionalRequirements_2026-06-04.md))
- Feature Document reference: not provided
- Resolved stack and rationale:
- Frontend: React with Next.js, based on FRD stack declaration and UX module scope
- Backend: Spring Boot 3 with WebFlux, based on FRD platform stack and module decomposition
- Messaging: Kafka, based on FRD event interface requirements
- Data stores: PostgreSQL, Redis, OpenSearch, based on FRD service ownership and stack
- Platform: AWS EKS, based on FRD infrastructure and scale targets

## 2. Scope
- In scope:
- Module-level and component-level implementation design for FRD sections 6, 7, 9, 10, 13, 15, and 16
- API and event interaction design for service integration
- Logical data model and constraints aligned to FRD behavior
- Non-functional implementation controls and test guidance
- Out of scope:
- New business requirements not present in FRD
- Visual UI design and page-level styling decisions
- Infrastructure provisioning scripts and environment build pipelines

## 3. Assumptions, Dependencies, and Risks
- Assumptions:
- This LLD uses FRD as the only functional source because no Feature Document was provided.
- Inferred from FRD: service boundary follows domain modules defined in FRD section 6.
- Inferred from FRD: idempotent command handling is required for checkout and inventory reservation to prevent duplicate processing.
- External dependencies:
- Identity provider for OAuth2, JWT, and multifactor validation
- Payment provider for card, ACH, and financing operations
- Shipping and tracking provider for fulfillment updates
- SMS, email, and push providers for notifications
- Risks from missing source details:
- Endpoint field-level schemas are not fully defined in FRD.
- Retry thresholds and timeout policies are not explicitly defined per dependency.
- Detailed UI state behavior is limited by absence of modernization snapshots.
- Risks from FRD and Feature Document conflicts:
- No conflict analysis applicable because Feature Document is not provided.
- Cross-stack risks:
- React and Next.js are both listed, so rendering strategy choice may impact caching and response behavior.
- Event-driven consistency between search, pricing, and inventory read models may lag without explicit sync policy.

## 4. FRD to LLD Traceability Matrix

| Source | Source ID or section | Requirement summary | LLD module or component | Interface or data artifact | Status |
|---|---|---|---|---|---|
| FRD | 3 | Role-based permissions | Access Control Component | Role policy and authorization middleware | Designed |
| FRD | 4.1 to 4.2 | Preconditions and trigger scenarios | Workflow Trigger Evaluator | Trigger rule configuration | Designed |
| FRD | 6.1 and 16 | Authentication, MFA, token behavior | Auth Service | Auth API and session model | Designed |
| FRD | 6.2 and 16 | Catalog, search, filtering | Catalog Service and Search Adapter | Catalog search API and index document | Designed |
| FRD | 6.3 and 16 | Product detail and actions | Product Detail Service | Product detail read contract | Designed |
| FRD | 6.4 and 16 | Cart behavior and persistence | Cart Service | Cart command API and cart aggregate | Designed |
| FRD | 6.5 and 16 | Checkout flow and payment support | Checkout Service | Checkout command contract | Designed |
| FRD | 6.6 and 16 | Agent-assisted sales and dashboard | Agent Sales Service | Agent operations API and quote model | Designed |
| FRD | 6.7 and 16 | Inventory synchronization and reservation | Inventory Service | Reservation API and inventory ledger | Designed |
| FRD | 6.8, 11, and 16 | Order lifecycle and status transitions | Order Service | Order state machine and status history | Designed |
| FRD | 6.9 and 16 | Promotion rule engine | Promotion Service | Promotion evaluation contract | Designed |
| FRD | 6.10 and 16 | Trade-in assessment and quote | Trade-In Service | Trade-in quote API and quote model | Designed |
| FRD | 6.11 and 16 | Commission calculations and statements | Commission Service | Commission ledger and statement contract | Designed |
| FRD | 6.12 and 16 | Customer account operations | Account Service | Account profile and order view APIs | Designed |
| FRD | 6.13 and 16 | Reporting and analytics | Reporting Service | KPI read models and report APIs | Designed |
| FRD | 7 | Field-level validation requirements | Validation Policy Library | Validation rule registry | Designed |
| FRD | 9.2 | Service-level data ownership | Data Ownership Map | Domain schema boundary model | Designed |
| FRD | 10.2 | Kafka event interfaces | Event Integration Layer | Event schema contracts | Designed |
| FRD | 13 | Notification outcomes and channels | Notification Service | Notification dispatch and log model | Designed |
| FRD | 15 | Availability, security, scalability, observability | Cross-cutting Runtime Controls | SLOs, security controls, telemetry model | Designed |

## 5. Architecture Decomposition
- Module breakdown:
- Edge: API gateway, request authentication, authorization middleware, rate limiting
- Domain services: Auth, Catalog, Product Detail, Cart, Checkout, Agent Sales, Inventory, Order, Promotion, Trade-In, Commission, Account, Reporting, Notification
- Data and event layer: PostgreSQL, Redis, OpenSearch, Kafka
- Responsibilities:
- Each domain service owns its data and validation logic.
- Synchronous request-response used for user-driven operations.
- Asynchronous event flow used for downstream state propagation.
- Boundaries and interactions:
- Checkout orchestrates Cart, Promotion, Identity, Payment, Order, and Inventory.
- Order publishes lifecycle events consumed by Notification, Reporting, Inventory, and Commission.
- Catalog read models are updated from product and inventory events.

## 6. Detailed Design by Module

### 6.1 Auth Service
- Purpose: registration, login, multifactor verification, token issuance, and session lifecycle control.
- Inputs and outputs: credentials and multifactor code in, token set and role claims out.
- Processing logic: validate credentials, enforce multifactor policy, issue token, audit authentication event.
- Business rules mapping: FRD 6.1, 7, 15, and 16.
- Validation logic: required fields, token validity, multifactor conditional requirement.
- Error and exception handling: invalid credential, token expired, identity provider unavailable.
- Edge cases: concurrent login attempts and multifactor timeout windows.
- Idempotency and retry behavior: login request protected against duplicate submission. Inferred from FRD.

### 6.2 Catalog and Product Services
- Purpose: product discovery and product detail retrieval under response-time targets.
- Inputs and outputs: search filters and product identifier in, product summaries and detail payload out.
- Processing logic: execute search query, enrich with pricing and inventory, return paged results.
- Business rules mapping: FRD 6.2, 6.3, 7, and 16.
- Validation logic: accepted filter set and category domain checks.
- Error and exception handling: invalid filters, search source unavailable.
- Edge cases: empty result set and stale inventory snapshots.
- Idempotency and retry behavior: read operations are idempotent.

### 6.3 Cart Service
- Purpose: manage carts for anonymous, authenticated, and agent-assisted sessions.
- Inputs and outputs: cart item mutation commands in, normalized cart aggregate out.
- Processing logic: validate item and quantity, apply promotions and tax hooks, persist cart snapshot.
- Business rules mapping: FRD 6.4, 7, and 16.
- Validation logic: quantity greater than zero and inventory-aware checks.
- Error and exception handling: stale cart conflict and invalid item state.
- Edge cases: concurrent cart updates from multiple channels.
- Idempotency and retry behavior: cart mutations use idempotency token by cart plus operation id. Inferred from FRD.

### 6.4 Checkout Service
- Purpose: coordinate five-step checkout to confirmed order.
- Inputs and outputs: checkout payload in, order confirmation out.
- Processing logic: validate steps, call identity verification, authorize payment, create order, reserve inventory, emit events.
- Business rules mapping: FRD 6.5, 7, 10.2, and 16.
- Validation logic: required step fields, payment method validity, identity pass state.
- Error and exception handling: payment decline, inventory conflict, identity verification failure.
- Edge cases: timeout after payment authorization before order persistence.
- Idempotency and retry behavior: checkout confirmation requires idempotency key to prevent duplicate order creation. Inferred from FRD.

### 6.5 Agent Sales Service
- Purpose: customer lookup, eligibility check, quote generation, and assisted cart operations.
- Inputs and outputs: lookup and quote requests in, customer summary and quote out.
- Processing logic: validate agent authorization, fetch customer data, calculate quote, create shareable cart context.
- Business rules mapping: FRD 6.6 and 16.
- Validation logic: agent role enforcement and customer identity requirement.
- Error and exception handling: customer not found and upstream timeout handling.
- Edge cases: quote updates by multiple sessions.
- Idempotency and retry behavior: quote generation idempotent by quote reference. Inferred from FRD.

### 6.6 Inventory Service
- Purpose: stock synchronization, reservation, release, reallocation, and transfer handling.
- Inputs and outputs: inventory commands in, reservation or availability outcome out.
- Processing logic: apply stock movement and reservation checks, update ledger, emit inventory events.
- Business rules mapping: FRD 6.7, 10.2, and 16.
- Validation logic: non-negative stock and reservation quantity limits.
- Error and exception handling: double reservation conflict and stale movement sequence.
- Edge cases: late release events after cancellation.
- Idempotency and retry behavior: reservation operations idempotent by reservation reference.

### 6.7 Order Service
- Purpose: maintain order lifecycle and post-purchase transitions.
- Inputs and outputs: order and transition commands in, order state and history out.
- Processing logic: validate transition matrix, write state change, publish order events.
- Business rules mapping: FRD 6.8, 11, 14, and 16.
- Validation logic: legal state transition checks.
- Error and exception handling: invalid transition and unknown order handling.
- Edge cases: partial return flow handling.
- Idempotency and retry behavior: transition commands deduplicated by transition transaction id. Inferred from FRD.

### 6.8 Promotion Service
- Purpose: deterministic promotion decisioning within latency target.
- Inputs and outputs: cart and qualifier context in, applied discounts and rejection reasons out.
- Processing logic: load active rule set, execute rule pipeline, return applied offers.
- Business rules mapping: FRD 6.9, 7, 10.2, and 16.
- Validation logic: promotion validity window and qualifier checks.
- Error and exception handling: rule engine timeout and invalid rule payload handling.
- Edge cases: overlapping exclusive offers.
- Idempotency and retry behavior: promotion decision keyed by cart version and rule set version. Inferred from FRD.

### 6.9 Trade-In Service
- Purpose: IMEI validation, condition assessment, and quote generation.
- Inputs and outputs: IMEI and condition input in, eligibility and quote output out.
- Processing logic: validate IMEI, apply condition matrix, produce quote amount.
- Business rules mapping: FRD 6.10 and 16.
- Validation logic: valid IMEI format and mandatory condition fields.
- Error and exception handling: invalid device or unsupported trade-in state.
- Edge cases: duplicate active trade-in quote for the same device.
- Idempotency and retry behavior: quote request idempotent within quote validity window. Inferred from FRD.

### 6.10 Commission Service
- Purpose: calculate commission entries, statements, and rankings.
- Inputs and outputs: sales and activation events in, commission ledger and statement outputs out.
- Processing logic: consume events, apply rules, persist ledger entries, emit summary updates.
- Business rules mapping: FRD 6.11, 10.2, 14, and 16.
- Validation logic: event completeness and duplicate detection.
- Error and exception handling: malformed event routing to dead-letter channel.
- Edge cases: retroactive adjustments due to return or cancellation.
- Idempotency and retry behavior: event processing deduplicated by event id.

### 6.11 Account, Reporting, and Notification Services
- Purpose: post-purchase account operations, reporting dashboards, and event-based notifications.
- Inputs and outputs: account and report requests, plus domain events in; account views, KPIs, and notifications out.
- Processing logic: project read models, aggregate metrics, route notifications by event type and channel.
- Business rules mapping: FRD 6.12, 6.13, 13, 14, 15, and 16.
- Validation logic: account access controls, report parameter validation, template variable checks.
- Error and exception handling: notification provider outage with queued retries.
- Edge cases: partial delivery across notification channels.
- Idempotency and retry behavior: notification deduplication by event id and template id. Inferred from FRD.

## 7. Interface Design

### 7.1 API Operations

| Endpoint or operation | Method | Request and response contract | Validation rules | Error codes and messages | Security and auth controls |
|---|---|---|---|---|---|
| /api/auth/login | POST | Request: identifier, password, multifactorCode. Response: accessToken, refreshToken, roles | Required credentials and conditional multifactor | 400 invalid request, 401 invalid credentials, 429 throttled | OAuth2 policy and JWT issuance |
| /api/catalog/search | GET | Request: keyword, category, filters, page. Response: product list and facets | Filter domain checks and pagination bounds | 400 invalid filter, 503 unavailable | Channel policy plus optional authenticated context |
| /api/products/{productId} | GET | Response: product details, pricing, inventory, promotions | Product identifier format check | 404 not found, 503 source unavailable | Role-aware visibility |
| /api/cart/{cartId}/items | POST | Request: productId, quantity. Response: updated cart | Quantity and inventory checks | 400 validation error, 409 version conflict | Actor ownership validation |
| /api/checkout/confirm | POST | Request: customer, shipping, identity, payment payload. Response: order confirmation | Required step fields and supported payment method | 400 invalid request, 402 payment failure, 409 inventory conflict | Authenticated session required |
| /api/orders/{orderId}/status | PATCH | Request: targetStatus and reason. Response: updated order state | Transition matrix checks | 400 invalid transition, 404 not found | Role-restricted operation |
| /api/promotions/evaluate | POST | Request: cart and qualifier context. Response: applied promotions and discounts | Rule window and qualifier checks | 400 invalid qualifiers, 504 timeout | Authenticated or trusted internal call |
| /api/tradein/quote | POST | Request: imei and condition profile. Response: eligibility and quote | IMEI and condition checks | 400 invalid input, 422 ineligible | Authenticated context |

### 7.2 Event Contracts

| Event | Producer | Consumer examples | Core payload fields |
|---|---|---|---|
| OrderCreated | Checkout or Order Service | Notification, Reporting, Commission | eventId, orderId, actorType, totalAmount, createdAt |
| OrderPaid | Checkout Service | Notification, Reporting | eventId, orderId, paymentMethod, paidAt |
| OrderCancelled | Order Service | Inventory, Notification, Commission | eventId, orderId, reason, cancelledAt |
| InventoryReserved | Inventory Service | Order, Reporting | eventId, reservationId, orderId, sku, quantity |
| InventoryReleased | Inventory Service | Reporting, Catalog projection | eventId, reservationId, sku, quantity |
| PromotionApplied | Promotion Service | Checkout, Reporting | eventId, cartId, promotionIds, discountTotal |
| CommissionCalculated | Commission Service | Agent Dashboard, Reporting | eventId, agentId, amount, period |
| CustomerRegistered | Auth Service | Notification, Reporting | eventId, customerId, registeredAt |
| NotificationSent | Notification Service | Reporting and audit | eventId, channel, target, deliveryStatus |

## 8. Data Design

### 8.1 Entities and Constraints

| Entity | Purpose | Key fields | Constraints and relationships |
|---|---|---|---|
| UserAccount | Identity and role mapping | userId, role, status, mfaEnabled | Active status required for sign in; role mandatory |
| Product | Product metadata and pricing | productId, category, brand, basePrice | Category must match supported domain |
| ProductInventorySnapshot | Availability projection | productId, availableQty, reservedQty, timestamp | availableQty must be non-negative |
| Cart | Mutable shopping aggregate | cartId, actorId, actorType, state, expiresAt | Retention aligned to 30-day requirement |
| CartItem | Cart line items | cartItemId, cartId, productId, quantity, unitPrice | quantity must be greater than zero |
| CheckoutSession | Checkout step state | checkoutId, cartId, stepState, identityStatus | All required steps complete before confirm |
| Order | Lifecycle aggregate | orderId, orderStatus, totals, submittedAt | Transition must follow lifecycle matrix |
| OrderLine | Purchased item lines | orderLineId, orderId, productId, quantity, price | quantity must be greater than zero |
| PromotionDecision | Promotion evaluation output | decisionId, cartId, appliedRules, rejectedRules | Deterministic by rule set version |
| TradeInQuote | Device trade-in quote | quoteId, imei, condition, amount, status | IMEI unique per active quote window |
| CommissionLedger | Commission accounting entry | ledgerId, agentId, orderId, amount, status | One earning entry per eligible event |
| NotificationRecord | Dispatch audit trail | notificationId, eventId, channel, status, sentAt | Dedupe by eventId and template combination |

### 8.2 Key and Index Recommendations
- Order index: orderStatus plus submittedAt
- Cart index: actorId plus state
- Product search index: keyword, category, brand, price ranges
- Inventory index: productId plus timestamp
- Commission index: agentId plus accounting period

### 8.3 Data Retention and Lifecycle Notes
- Cart retention: 30 days, grounded in FRD section 6.4.
- Inferred from FRD: order and lifecycle history retained for auditability and reporting.
- Inferred from FRD: notification records retained for delivery traceability.

## 9. Non-Functional Design
- Performance:
- API p95 target under 500 milliseconds for core operations
- Catalog search under 500 milliseconds
- Promotion evaluation under 200 milliseconds
- Trade-in quote under 3 seconds
- Dashboard load under 5 seconds
- Security:
- OAuth2 and JWT-based authorization
- Multifactor support for configured login flows
- TLS 1.3, encryption in transit, encryption at rest
- Audit trails for create, update, and lifecycle transitions
- Scalability:
- Capacity target support for 100000 daily users and 10000 concurrent users
- Throughput support for 1000 orders per minute
- Agent portal support for 5000 concurrent agents
- Availability:
- 99.95 percent availability objective
- Health checks, retries, and bounded fallback controls
- Observability and auditability:
- Metrics through Prometheus and dashboards through Grafana
- Distributed tracing with correlation id propagation
- Structured centralized logs for incident triage

## 10. Testing Guidance
- Unit test focus:
- authentication validation and multifactor branches
- cart mutation validation and quantity guards
- promotion rule ordering and exclusion handling
- order transition matrix validation
- trade-in quote computation and IMEI validation
- Integration test scenarios:
- successful checkout to order lifecycle and notification flow
- payment failure and rollback behavior
- inventory conflict during checkout confirm
- agent-assisted quote to cart to order flow
- event propagation across order, inventory, commission, and reporting consumers
- Negative and edge-case tests:
- duplicate checkout submit with same idempotency key
- stale cart version update conflict
- invalid promotion qualifier combination
- notification provider outage with queued retry path
- Coverage notes mapped to source requirements:
- FRD 6.1 through 6.13 mapped to service-level and integration suites
- FRD 10.2 mapped to event contract and consumer handling tests
- FRD 15 and 16 mapped to non-functional and acceptance validation suites

## 11. Open Questions
1. What is the final rendering strategy where both React and Next.js are in the source stack?
2. What is the canonical API and event schema versioning strategy?
3. What are exact retry, timeout, and dead-letter thresholds per external dependency?
4. What are retention policies for order audit history and notification logs beyond baseline guidance?
5. What is the approved behavior for partial shipment and partial returns settlement?
6. Can validated modernization UI snapshots be provided to finalize state-by-state UI interaction design?

## 12. Implementation Readiness Checklist
- Modules complete: Yes
- Contracts complete: Partial, field-level payload schemas require confirmation
- Error paths complete: Yes at design level
- Data design complete: Yes at logical level
- Blockers listed: Yes, see Open Questions

## 13. Output Metadata
- LLD file path saved: [artifacts/lld/LLD_feature-name_2026-06-04.md](artifacts/lld/LLD_feature-name_2026-06-04.md)
- Source coverage summary: FRD only
