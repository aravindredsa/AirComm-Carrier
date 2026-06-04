# SQL Capability Standards

## Purpose
Define enforceable SQL standards for schema changes, queries, and data operations.

## Scope
Applies to DDL, DML, stored logic, migration scripts, and performance-sensitive queries.

## Safety and Correctness
- `MUST` make schema and data changes explicit, reversible where feasible, and ordered.
- `MUST` avoid destructive operations without approved migration/backup strategy.
- `MUST` use parameterized access patterns in application-facing SQL.
- `SHOULD` keep transactions scoped to preserve consistency and minimize contention.

## Performance and Scalability
- `MUST` evaluate query plans for changed critical queries.
- `MUST` define indexing strategy for new high-traffic access patterns.
- `MUST` avoid unbounded scans on critical paths without explicit justification.
- `SHOULD` benchmark significant query or schema changes pre-release.

## Data Integrity and Compliance
- `MUST` enforce key, constraint, and referential integrity rules where applicable.
- `MUST` define data retention and archival impacts for schema changes.
- `MUST` avoid exposing sensitive data in logs/scripts/exports.

## Testing and Deployment
- `MUST` test migrations against representative datasets.
- `MUST` include rollback/forward-fix strategy for deployment failures.
- `MUST` block promotion on failed migration validation.

## Review Checklist
- Are safety and integrity constraints explicit?
- Are performance impacts assessed and acceptable?
- Are deployment, rollback, and compliance controls sufficient?
