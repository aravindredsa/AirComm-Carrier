# Relational Schema Capability Standards

## Purpose
Define enforceable standards for relational schema design, evolution, and operational quality.

## Scope
Applies to relational table design, constraints, indexing, migrations, and schema governance.

## Schema Design Standards
- `MUST` define clear primary keys and enforce referential integrity where applicable.
- `MUST` model constraints to protect domain invariants.
- `MUST` use consistent naming conventions for tables, columns, indexes, and constraints.
- `SHOULD` avoid overloading generic columns that obscure semantics.

## Evolution and Migration Standards
- `MUST` deliver schema changes through versioned migration scripts.
- `MUST` preserve backward compatibility during staged rollouts unless approved otherwise.
- `MUST` include data migration/backfill strategy when changing cardinality or constraints.
- `SHOULD` plan online-safe migrations for large tables.

## Performance and Operability
- `MUST` validate index strategy against query workload changes.
- `MUST` assess lock/contention impact of migration steps.
- `MUST` document high-risk schema changes and rollout order.
- `SHOULD` monitor post-deployment query regressions.

## Security and Compliance
- `MUST` classify and protect sensitive columns.
- `MUST` enforce least-privilege access for schema and data operations.
- `MUST` align retention/deletion behavior with compliance expectations.

## Testing and Quality Gates
- `MUST` test migrations and integrity checks on representative data.
- `MUST` block release for unresolved integrity/performance regressions.
- `SHOULD` include rollback or forward-fix procedures for migration failures.

## Review Checklist
- Are schema semantics and constraints explicit?
- Are migration safety and compatibility controls adequate?
- Are performance and compliance impacts assessed?
