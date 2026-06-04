# Vitest Capability Standards

## Purpose
Define enforceable standards for Vitest-based TypeScript/JavaScript testing.

## Scope
Applies to Vitest unit/integration tests, mock strategy, and CI execution.

## Test Quality
- `MUST` keep tests deterministic, isolated, and behavior-focused.
- `MUST` test changed logic and relevant edge/error paths.
- `MUST` avoid implementation-detail assertions when user-visible behavior can be asserted.
- `SHOULD` keep fixtures and mocks explicit and localized.

## Mocking and Runtime Safety
- `MUST` use mocks/stubs for unstable external dependencies in unit tests.
- `MUST` avoid global mock leakage across tests.
- `MUST` validate runtime boundary assumptions with integration tests where needed.

## CI and Performance
- `MUST` run required Vitest suites in CI for impacted scope.
- `MUST` fail CI on required test failures.
- `SHOULD` keep suite runtime bounded with targeted parallelism and sharding.

## Review Checklist
- Are tests deterministic and behavior-oriented?
- Are mocks scoped correctly without leakage?
- Are CI quality gates and diagnostics sufficient?
