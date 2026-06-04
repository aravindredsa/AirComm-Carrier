# C# Capability Standards

## Purpose
Define enforceable C# standards for correctness, maintainability, security, and operability across .NET workloads.

These standards provide capability-level defaults and are intended to be enforced through code review and automated quality gates.

## Scope
Applies to:
- C# application code, libraries, workers, and test projects
- API/service/business logic layers implemented in C#
- shared utilities and cross-cutting infrastructure components

## Code Clarity and Structure Standards

### Required
- `MUST` optimize for readability and explicitness over clever, opaque constructs.
- `MUST` keep classes and methods cohesive with clear responsibility.
- `MUST` keep side effects explicit and discoverable.
- `MUST` maintain separation between domain logic and infrastructure concerns.

### Recommended
- `SHOULD` use consistent naming and folder/namespace organization.
- `SHOULD` avoid excessive method complexity and deep nesting.

## Type Safety and Nullability Standards

### Required
- `MUST` treat nullable reference context intentionally in changed code.
- `MUST` validate boundary inputs and fail early with meaningful diagnostics.
- `MUST` avoid ambiguous null semantics in public APIs.

### Recommended
- `SHOULD` use explicit types where inference harms readability.
- `SHOULD` keep API contracts explicit for optional and required fields.

## Async, Concurrency, and Reliability Standards

### Required
- `MUST` use async/await for I/O-bound operations.
- `MUST NOT` block async flows with `.Result`/`.Wait()` in request/runtime paths.
- `MUST` propagate `CancellationToken` through cancellable operations.
- `MUST` define timeout/retry behavior for remote dependency calls.

### Recommended
- `SHOULD` avoid fire-and-forget tasks unless lifecycle/error strategy is explicit.
- `SHOULD` design idempotent handlers for retry-prone operations.

## Error Handling and Diagnostics Standards

### Required
- `MUST` handle errors explicitly with actionable context.
- `MUST NOT` swallow exceptions silently.
- `MUST` use structured logging with consistent keys and correlation identifiers.
- `MUST` avoid logging secrets, credentials, or regulated sensitive data.

### Recommended
- `SHOULD` map internal exceptions to stable external error contracts at boundaries.
- `SHOULD` distinguish expected domain failures from unexpected system failures.

## Security and Boundary Standards

### Required
- `MUST` validate and sanitize untrusted input according to context.
- `MUST` use parameterized data access and avoid unsafe dynamic query construction.
- `MUST` keep secrets outside code/repo artifacts.
- `MUST` preserve least-privilege design in integration points.

### Recommended
- `SHOULD` align security verification with OWASP ASVS/control expectations.
- `SHOULD` include secure defaults in shared helper libraries.

## Contract Compatibility Standards

### Required
- `MUST` preserve public contract compatibility unless a breaking change is approved.
- `MUST` document behavioral changes that affect consumers.
- `MUST` include migration notes for approved breaking changes.

### Recommended
- `SHOULD` version contracts explicitly where compatibility cannot be preserved.

## Testing Standards

### Required
- `MUST` add/update tests for changed behavior and failure paths.
- `MUST` include unit tests for business logic and edge-case handling.
- `MUST` include integration/contract tests where boundary behavior changes.

### Recommended
- `SHOULD` include regression tests for previously escaped defects.
- `SHOULD` keep tests deterministic and environment-independent where practical.

## Tooling and Quality Gate Standards

### Required
- `MUST` run compiler/analyzer checks in CI.
- `MUST` apply consistent formatting/style configuration via `.editorconfig` or equivalent.
- `MUST` fail CI on required quality gate failures.

### Recommended
- `SHOULD` maintain explicit warning/error policy for analyzers.
- `SHOULD` review technical debt suppressions periodically.

## Reference Baselines

Use these as baseline references when elaborating client overlays:
- Microsoft C# coding conventions
- .NET code analysis and analyzer guidance
- OWASP ASVS and OWASP Cheat Sheet Series

## Review Checklist

- Is code clear, cohesive, and side-effect behavior explicit?
- Are nullable/input boundary semantics safe and intentional?
- Are async/cancellation and dependency timeout behaviors correct?
- Are error handling and structured diagnostics supportable?
- Are security boundary controls (input/query/secrets) enforced?
- Are compatibility expectations documented and preserved?
- Are tests and CI quality gates sufficient for changed behavior?
