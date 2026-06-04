# JUnit Capability Standards

## Purpose
Define enforceable standards for JUnit-based unit and integration testing in JVM projects.

## Scope
Applies to JUnit test suites, fixtures, assertions, and CI execution.

## Test Design Standards
- `MUST` keep tests deterministic, isolated, and independently executable.
- `MUST` validate behavior contracts, including edge and failure paths.
- `MUST` keep fixtures explicit and avoid hidden global shared state.
- `SHOULD` prefer clear Arrange-Act-Assert structure.

## Coverage and Reliability
- `MUST` include tests for changed logic and bug-fix regressions.
- `MUST` include negative and exception-path coverage for critical logic.
- `MUST` avoid flaky time/network dependencies unless controlled.
- `SHOULD` separate unit and integration test scopes clearly.

## CI and Diagnostics
- `MUST` run required JUnit suites in CI for relevant changes.
- `MUST` report failures with enough context to reproduce quickly.
- `MUST` fail pipeline on required test failures.

## Review Checklist
- Are tests deterministic and scoped correctly?
- Are failure and edge cases covered?
- Is CI enforcement and diagnostics sufficient?
