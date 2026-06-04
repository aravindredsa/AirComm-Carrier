# xUnit Capability Standards

## Purpose
Define enforceable standards for xUnit-based testing in .NET projects.

## Scope
Applies to xUnit unit/integration tests, fixtures, and CI test execution.

## Test Design
- `MUST` keep tests isolated, deterministic, and independently runnable.
- `MUST` include success, edge, and failure path validation for changed logic.
- `MUST` keep fixture initialization explicit and controlled.
- `SHOULD` use clear test naming with behavior intent.

## Reliability and Coverage
- `MUST` add regression tests for defect fixes.
- `MUST` include boundary condition checks for critical code paths.
- `MUST` avoid fragile timing assumptions in tests.
- `SHOULD` separate unit and integration concerns explicitly.

## CI and Diagnostics
- `MUST` run required xUnit suites in CI for impacted changes.
- `MUST` fail CI on required test failures.
- `MUST` publish actionable failure output and context.

## Review Checklist
- Are tests deterministic and independent?
- Are changed behaviors and failure paths covered?
- Are CI gates and diagnostics operationally adequate?
