# Playwright Capability Standards

## Purpose
Define enforceable Playwright standards for reliable, diagnosable, and maintainable browser automation.

These standards target production-grade UI validation in CI and local development workflows.

## Scope
Applies to:
- Playwright end-to-end and workflow automation suites
- smoke, regression, and scenario-focused browser validations
- CI execution, diagnostics, and test artifact collection

## Test Design and Isolation Standards

### Required
- `MUST` validate user-visible outcomes rather than internal implementation details.
- `MUST` keep tests isolated and independently executable.
- `MUST` make test preconditions and data setup explicit.
- `MUST` avoid cross-test hidden dependencies on shared mutable state.

### Recommended
- `SHOULD` keep each test focused on one business intent.
- `SHOULD` balance reuse and readability; avoid overly abstract test frameworks.

## Locator and Synchronization Standards

### Required
- `MUST` prefer resilient, user-facing locators (`role`, label, test id contracts where needed).
- `MUST` avoid brittle selectors tied to unstable DOM structure/class names.
- `MUST` use web-first assertions and built-in waiting semantics.
- `MUST NOT` rely on arbitrary fixed sleeps for synchronization.

### Recommended
- `SHOULD` use locator chaining/filtering for clarity and precision.
- `SHOULD` keep selector strategy conventions documented and consistent.

## Environment and Data Standards

### Required
- `MUST` run tests against controlled, predictable environments.
- `MUST` keep data setup and teardown deterministic.
- `MUST` isolate tests from third-party dependencies using mocks/routes where practical.

### Recommended
- `SHOULD` define environment tiers for smoke vs regression execution.
- `SHOULD` maintain stable seed datasets for critical scenarios.

## Reliability, Flakiness, and CI Standards

### Required
- `MUST` define retry policy and failure classification (product defect vs test flake vs environment issue).
- `MUST` collect sufficient artifacts for failed runs (trace, screenshot, logs, request context).
- `MUST` keep CI execution reproducible and version-pinned.
- `MUST` run key suites in CI on pull requests and merge paths.

### Recommended
- `SHOULD` shard/parallelize suites with explicit resource constraints.
- `SHOULD` track flake rates and enforce remediation thresholds.

## Security and Safety Standards

### Required
- `MUST` avoid production secrets and sensitive real data in test assets.
- `MUST` mask or redact sensitive values in logs and artifacts.
- `MUST` constrain destructive actions to approved non-production environments.

### Recommended
- `SHOULD` include security-critical user journeys in automated checks.
- `SHOULD` validate auth/session boundary behavior in regression suites.

## Coverage Model Standards

### Required
- `MUST` separate and label suites by intent: smoke, regression, scenario/feature.
- `MUST` cover critical business journeys and high-risk failure points.
- `MUST` include negative-path and error-state validations for critical flows.

### Recommended
- `SHOULD` maintain a traceability map from requirements to automated coverage.
- `SHOULD` prioritize stable, high-value cases before long-tail scenarios.

## Tooling and Maintenance Standards

### Required
- `MUST` keep Playwright dependency and browser runtime versions actively maintained.
- `MUST` include lint/type checks for test code in CI (where language stack supports it).
- `MUST` keep test utilities/shared fixtures versioned and documented.

### Recommended
- `SHOULD` use trace viewer and inspector workflows as first-line debugging tools.
- `SHOULD` document local-debug and CI-debug playbooks.

## Reference Baselines

Use these as baseline references when elaborating client overlays:
- Playwright best practices (locators, assertions, CI/debug workflows)
- OWASP guidance for test environment security and sensitive data handling

## Review Checklist

- Are tests isolated, deterministic, and user-outcome focused?
- Are locator strategies resilient and synchronization web-first?
- Are preconditions/data and environment assumptions explicit?
- Are failure artifacts sufficient for rapid triage?
- Are CI gates and flake controls enforced?
- Are sensitive data and secrets handled safely in test execution?
