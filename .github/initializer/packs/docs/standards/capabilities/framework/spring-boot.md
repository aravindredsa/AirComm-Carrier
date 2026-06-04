# Spring Boot Capability Standards

## Purpose
Define enforceable standards for Spring Boot services across architecture, security, reliability, and operations.

## Scope
Applies to Spring Boot APIs, services, background tasks, and integration components.

## Architecture and Code Structure
- `MUST` keep controllers thin and delegate business logic to services.
- `MUST` enforce clear layering (web -> application -> domain -> infrastructure).
- `MUST` define explicit DTO boundaries; do not expose persistence entities directly.
- `SHOULD` keep cross-cutting concerns centralized (security, error handling, logging).

## Security Standards
- `MUST` require authentication and authorization for non-public endpoints.
- `MUST` validate boundary inputs and sanitize untrusted data.
- `MUST` keep secrets outside source code and plain configuration files.
- `SHOULD` align secure coding controls with OWASP guidance.

## Reliability and Performance
- `MUST` define timeout/retry behavior for outbound dependencies.
- `MUST` handle transactional boundaries explicitly for multi-step writes.
- `MUST` avoid blocking patterns that degrade service throughput.
- `SHOULD` define SLO-aligned performance targets for critical endpoints.

## Observability and Operations
- `MUST` emit structured logs with correlation identifiers.
- `MUST` collect metrics for latency, throughput, and error rate.
- `MUST` expose readiness/liveness health checks.
- `SHOULD` define alerting and incident runbooks for high-severity failures.

## Testing and DevOps
- `MUST` include unit and integration tests for changed behavior.
- `MUST` include failure-path tests for critical dependencies.
- `MUST` enforce CI quality gates before release.
- `SHOULD` support safe rollback or forward-fix release strategy.

## Review Checklist
- Are layer boundaries and contracts explicit?
- Are auth, validation, and secret controls enforced?
- Are resilience, observability, and health checks production-ready?
- Are tests and CI gates sufficient for changed scope?
