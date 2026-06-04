# Stored Procedure Domain Standards

## Purpose
Define production-grade standards for stored procedure design, review, and deployment.

## Applies To
- Stored procedure authoring and refactoring
- Procedure-level security and performance analysis
- Deployment and post-deployment validation

## Required Rules
- Define procedure intent, inputs, outputs, and error behavior explicitly.
- Validate input assumptions and fail with actionable error details.
- Use transaction boundaries deliberately and document side effects.
- Keep permission model explicit and least-privilege.
- Ensure idempotent behavior where operationally required.

## Implementation Expectations
- Use clear naming and predictable parameter conventions.
- Avoid uncontrolled dynamic SQL; parameterize when unavoidable.
- Keep result-set contracts stable for consumers.
- Include performance-sensitive indexing/query assumptions.

## Avoid
- Silent failure behavior
- Hidden schema dependencies
- Non-deterministic output shape for the same input

## Review Checklist
- Is contract behavior explicit and stable?
- Are security and permission assumptions documented?
- Are transaction and concurrency behaviors safe?
- Is performance impact understood and measurable?
