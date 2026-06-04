# TypeScript Capability Standards

## Purpose
Define enforceable TypeScript standards for type safety, maintainability, and runtime reliability.

## Scope
Applies to frontend and backend TypeScript code, shared libraries, and test modules.

## Type System Standards
- `MUST` use explicit, meaningful types at public boundaries.
- `MUST` avoid unsafe escape hatches (`any`, unchecked casts) unless justified and documented.
- `MUST` represent nullable/optional behavior explicitly in types.
- `SHOULD` model domain invariants through type constructs where practical.

## Code Structure and Readability
- `MUST` keep modules cohesive with clear ownership.
- `MUST` keep side effects explicit and localized.
- `MUST` avoid hidden behavior in utility abstractions.
- `SHOULD` prefer simple, composable patterns over deep indirection.

## Runtime and Error Handling
- `MUST` validate untrusted input at runtime boundaries.
- `MUST` define error-handling behavior for critical paths.
- `MUST` avoid silent failure patterns and swallowed exceptions.
- `SHOULD` provide actionable diagnostics context in logs/errors.

## Security and Dependency Hygiene
- `MUST` avoid storing secrets in source-controlled artifacts.
- `MUST` constrain and review third-party dependency usage.
- `MUST` avoid insecure dynamic evaluation patterns.
- `SHOULD` run vulnerability and license checks in CI.

## Testing and Quality Gates
- `MUST` include unit/integration tests for changed behavior.
- `MUST` enforce typecheck and lint checks in CI.
- `MUST` block release on critical test/type regressions.

## Review Checklist
- Are type boundaries explicit and safe?
- Are side effects and module responsibilities clear?
- Are runtime validation and error handling robust?
- Are CI gates and dependency controls adequate?
