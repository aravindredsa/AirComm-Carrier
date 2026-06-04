# Angular Capability Standards

## Purpose
Define enforceable Angular standards across architecture, security, accessibility, testing, and operational quality.

These standards are capability-level defaults. Client overlays may narrow these rules, but must not weaken security, accessibility, or reliability controls.

## Scope
Applies to:
- Angular components, directives, pipes, and services
- routing, forms, state management, and data-fetching behavior
- frontend testing, build pipelines, and deployment-readiness controls

## Component and Module Architecture

### Required
- `MUST` keep components focused on a single responsibility.
- `MUST` keep business/domain decisions out of presentational components where practical.
- `MUST` define clear ownership for feature modules and shared modules.
- `MUST` keep public component/service contracts explicit and stable.

### Recommended
- `SHOULD` use feature-based module organization for clear ownership.
- `SHOULD` keep reusable UI primitives separate from domain-specific workflows.
- `SHOULD` minimize tight coupling between modules through explicit interfaces.

## State, Data, and Side-Effect Standards

### Required
- `MUST` make async data and side effects explicit and deterministic.
- `MUST` handle loading, empty, success, and error UI states for async flows.
- `MUST` avoid race-condition-prone update patterns in route/interaction transitions.
- `MUST` keep canonical state single-sourced; avoid duplicated derivable state.

### Recommended
- `SHOULD` centralize data-fetching patterns and retry/error semantics.
- `SHOULD` use unsubscribe/teardown patterns to prevent memory leaks.
- `SHOULD` keep side effects in services/effects rather than templates/components.

## Forms and Validation Standards

### Required
- `MUST` use explicit validation for user inputs at UI boundaries.
- `MUST` show actionable and accessible validation messages.
- `MUST` keep form-state transitions predictable and testable.
- `MUST` avoid relying only on client-side validation for security-sensitive flows.

### Recommended
- `SHOULD` prefer reactive forms for complex business flows.
- `SHOULD` keep validation rules reusable and centralized for consistency.

## Accessibility and UX Standards

### Required
- `MUST` preserve keyboard navigation for interactive controls.
- `MUST` use semantic structure and accessible labels/roles.
- `MUST` manage focus correctly for dialogs, overlays, and route transitions.
- `MUST` keep error/status messages perceivable by assistive technologies.

### Recommended
- `SHOULD` include accessibility checks in CI lint/test workflows.
- `SHOULD` validate critical journeys for responsive and high-contrast behavior.

## Security and Frontend Hardening Standards

### Required
- `MUST` treat external input and rendered content as untrusted.
- `MUST` avoid bypassing Angular sanitization unless explicitly approved and reviewed.
- `MUST` avoid exposing secrets/tokens in client source, logs, or URLs.
- `MUST` enforce secure client-side handling for auth/session flows.

### Recommended
- `SHOULD` align browser-side controls with OWASP guidance for XSS/CSRF/session risks.
- `SHOULD` minimize and review third-party script dependency usage.

## Testing Standards

### Required
- `MUST` include component and service tests for changed behavior.
- `MUST` include integration-level tests for critical user journeys.
- `MUST` include tests for error and edge-case behavior in critical flows.
- `MUST` keep test setup deterministic and independently executable.

### Recommended
- `SHOULD` prioritize user-visible assertions over implementation-detail assertions.
- `SHOULD` include regression tests for previously escaped defects.

## Build, Performance, and DevOps Standards

### Required
- `MUST` enforce lint/type/test gates in CI before release.
- `MUST` externalize environment-specific runtime configuration safely.
- `MUST` define bundle/performance controls for high-traffic routes.
- `MUST` ensure production builds are reproducible and traceable.

### Recommended
- `SHOULD` track bundle-size drift and set thresholds.
- `SHOULD` use phased rollout strategy for high-impact UI releases.

## Reference Baselines

Use these as baseline references when elaborating client overlays:
- Angular style and security best practices
- OWASP ASVS and OWASP Cheat Sheet Series (frontend-relevant controls)
- organizational UI testing and release standards

## Review Checklist

- Are module/component boundaries and ownership explicit?
- Are state transitions and async side effects deterministic?
- Are forms, validation, and accessibility controls robust?
- Are frontend security controls and sanitization practices safe?
- Are tests and CI quality gates sufficient for changed behavior?
- Are performance and release-readiness controls enforceable?
