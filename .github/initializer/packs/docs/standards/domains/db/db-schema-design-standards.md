# DB Schema Design Domain Standards

## Purpose
Provide production-grade standards for schema design and schema change analysis.

## Applies To
- Relational schema design and evolution
- Data dictionary and schema review outputs
- Schema impact and migration analysis

## Required Rules
- Make entities, keys, constraints, and relationships explicit.
- Preserve data integrity and backward compatibility unless approved otherwise.
- Document migration impact, rollback considerations, and data quality risk.
- Align schema decisions with expected access patterns.
- Keep naming, data types, and nullability rules consistent.

## Design Expectations
- Capture candidate keys, foreign keys, and uniqueness constraints.
- Specify defaults, check constraints, and indexing strategy rationale.
- Record assumptions about volume, concurrency, and retention.

## Avoid
- Ambiguous relationships
- Hidden breaking schema changes
- Missing integrity constraints where required

## Review Checklist
- Are entities and relationships explicit?
- Are constraints complete and enforceable?
- Is migration impact and rollback strategy documented?
- Are performance and maintainability tradeoffs explained?
