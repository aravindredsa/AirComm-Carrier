# React Capability Standards

## Purpose
Define enforceable React standards across architecture, accessibility, security, testing, and operational quality.

These standards are capability-level defaults. Client overlays may narrow these rules, but must not reduce accessibility, security, or reliability safeguards.

## Scope
Applies to:
- React components, hooks, and composition patterns
- state management and data-fetching behavior
- routing, forms, and client-side interaction flows
- frontend testing and deployment readiness practices

## Component Architecture and State Ownership

### Required
- `MUST` keep component responsibilities narrow and explicit.
- `MUST` keep domain/business decisions out of purely presentational components.
- `MUST` define clear state ownership; avoid ambiguous shared mutable state.
- `MUST` ensure component APIs (props/events) are explicit and stable.

### Recommended
- `SHOULD` separate container/data concerns from presentational concerns where practical.
- `SHOULD` prefer composition over deep inheritance-like patterns.
- `SHOULD` avoid prop drilling beyond reasonable depth by using composition/context intentionally.

## Data Fetching and Side Effect Standards

### Required
- `MUST` make side effects explicit and cleanup-safe.
- `MUST` handle loading, empty, success, and error states for async views.
- `MUST` prevent stale updates and race-condition UI corruption in async flows.
- `MUST` keep network and retry semantics consistent across equivalent flows.

### Recommended
- `SHOULD` centralize reusable fetching/cache patterns.
- `SHOULD` use cancellation/abort patterns where requests can become obsolete.
- `SHOULD` make fallback and retry behavior user-visible and diagnosable.

## Accessibility and UX Standards

### Required
- `MUST` preserve keyboard accessibility for interactive controls.
- `MUST` use semantic HTML/ARIA roles correctly where custom components are used.
- `MUST` provide accessible names/labels for interactive elements.
- `MUST` maintain focus management in modals, drawers, and navigation transitions.

### Recommended
- `SHOULD` validate key journeys with assistive-tech-aware checks.
- `SHOULD` maintain sufficient contrast and readable error messaging.

## Security and Frontend Hardening Standards

### Required
- `MUST` treat all external content as untrusted input.
- `MUST` avoid unsafe HTML rendering unless sanitized and approved.
- `MUST` avoid leaking secrets/tokens in client logs or URL surfaces.
- `MUST` enforce secure handling of auth/session state at client boundaries.

### Recommended
- `SHOULD` align client-side controls with OWASP guidance for XSS/CSRF/session risks.
- `SHOULD` keep third-party script usage minimal and controlled.

## Coding and Maintainability Standards

### Required
- `MUST` use consistent naming and folder/module structure conventions.
- `MUST` keep hooks deterministic and follow rules-of-hooks.
- `MUST` avoid hidden side effects in render paths.
- `MUST` keep error boundaries/fallbacks for high-impact UI regions.

### Recommended
- `SHOULD` use lint/format/type checks in CI and local workflows.
- `SHOULD` keep complex UI logic in tested utility hooks/services.

## Testing Standards

### Required
- `MUST` test user-visible behavior, not internal implementation details.
- `MUST` include tests for critical flows and edge/error states.
- `MUST` keep test data and preconditions explicit and reproducible.

### Recommended
- `SHOULD` include component-level and integration-level tests for changed behavior.
- `SHOULD` include regression tests for previously escaped defects.

## Deployment and Runtime Standards

### Required
- `MUST` externalize environment-specific runtime configuration.
- `MUST` include build-time quality gates (lint/type/tests) before release.
- `MUST` ensure observability hooks exist for critical frontend errors.

### Recommended
- `SHOULD` define bundle/performance budgets and monitor drift.
- `SHOULD` validate browser compatibility for supported targets.

## Reference Baselines

Use these as baseline references when elaborating client overlays:
- React and web accessibility best practices
- OWASP ASVS and OWASP Cheat Sheet Series (frontend-relevant controls)
- organizational UI testing and release standards

## Review Checklist

- Are component responsibilities and state ownership explicit?
- Are async states and side effects deterministic and cleanup-safe?
- Is accessibility preserved across key interactions?
- Are client-side security pitfalls (XSS/token exposure) addressed?
- Are tests focused on user-visible behavior and critical flows?
- Are lint/type/test gates and runtime error observability in place?
