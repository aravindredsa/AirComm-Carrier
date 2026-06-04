# Java Capability Standards

## Purpose
Define enforceable Java standards for readability, correctness, security, and maintainability.

## Scope
Applies to Java services, libraries, workers, and test code.

## Code Quality and Structure
- `MUST` favor clear, explicit code over implicit or overly clever constructs.
- `MUST` keep class and method responsibilities cohesive.
- `MUST` separate domain logic from framework and transport concerns.
- `SHOULD` organize modules/packages by feature and ownership boundaries.

## Type, Null, and Input Safety
- `MUST` define null-handling behavior explicitly at boundaries.
- `MUST` validate untrusted inputs and fail with actionable messages.
- `MUST` avoid ambiguous API semantics for optional fields.
- `SHOULD` use static analysis to enforce null and bug-prone patterns.

## Concurrency and Reliability
- `MUST` define thread-safety expectations for shared state.
- `MUST` use timeout and retry patterns for remote calls.
- `MUST` avoid unbounded resource usage in critical paths.
- `SHOULD` use idempotency where retry can duplicate side effects.

## Security and Logging
- `MUST` avoid secrets in source, config, and logs.
- `MUST` use parameterized access patterns to prevent injection risks.
- `MUST` use structured logs with correlation context.
- `SHOULD` align secure coding controls with OWASP guidance.

## Testing and Quality Gates
- `MUST` add/update tests for changed behavior and failure paths.
- `MUST` keep tests deterministic and independently executable.
- `MUST` enforce compile, static analysis, and test gates in CI.

## Review Checklist
- Is code intent clear and cohesive?
- Are boundary validation and null semantics explicit?
- Are concurrency, timeout, and retry behaviors safe?
- Are logging and security controls operationally adequate?
