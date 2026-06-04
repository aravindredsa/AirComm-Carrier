# Stored Procedures Capability Standards

## Purpose
Define enforceable standards for stored procedure design, safety, and maintainability.

## Scope
Applies to stored procedures used for transactional workflows, reporting operations, and data services.

## Design and Interface Standards
- `MUST` define explicit input/output parameter contracts.
- `MUST` document side effects and transactional behavior.
- `MUST` keep procedure scope cohesive and purpose-specific.
- `SHOULD` keep backward-compatible parameter evolution unless approved breaking change exists.

## Safety and Security Standards
- `MUST` use parameterized patterns and avoid unsafe dynamic SQL.
- `MUST` validate input assumptions and handle invalid parameters explicitly.
- `MUST` enforce least-privilege execution context.
- `MUST` avoid exposing sensitive data in diagnostic output.

## Performance and Reliability Standards
- `MUST` assess query plans for critical procedures.
- `MUST` define timeout/error handling behavior for long-running operations.
- `MUST` avoid implicit cursor/row-by-row anti-patterns in high-volume paths unless justified.
- `SHOULD` optimize set-based patterns where practical.

## Testing and Deployment Standards
- `MUST` include unit/integration validation for changed procedure behavior.
- `MUST` include transaction rollback/consistency tests for critical paths.
- `MUST` deploy through versioned migration workflows.

## Review Checklist
- Are contracts, side effects, and transaction semantics explicit?
- Are security and input safeguards enforced?
- Are performance implications assessed and acceptable?
- Are deployment and validation controls sufficient?
