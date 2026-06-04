# TestNG Capability Standards

## Purpose
Define enforceable standards for TestNG-based testing workflows in JVM projects.

## Scope
Applies to TestNG suites, groups, data providers, and CI execution patterns.

## Test Architecture
- `MUST` keep tests isolated and independent unless explicitly grouped by workflow.
- `MUST` define suite/group intent and execution order dependencies explicitly.
- `MUST` keep data providers deterministic and reproducible.
- `SHOULD` avoid cross-test side effects through shared mutable fixtures.

## Reliability and Coverage
- `MUST` include tests for changed behavior and critical failure paths.
- `MUST` separate smoke/regression/extended suite concerns clearly.
- `MUST` avoid flaky timing dependencies and uncontrolled external dependencies.
- `SHOULD` include boundary-condition and invalid-input tests.

## CI and Reporting
- `MUST` run required suites in CI for impacted scope.
- `MUST` fail CI on required suite failures.
- `MUST` publish actionable reports/artifacts for failed runs.

## Review Checklist
- Are suite/group boundaries and intent clear?
- Are tests deterministic and robust?
- Are CI gates and artifacts sufficient for rapid triage?
