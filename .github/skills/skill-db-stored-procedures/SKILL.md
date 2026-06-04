---
name: skill-db-stored-procedures
description: Shared method for generating and reviewing SQL stored procedures aligned with approved DB schema artifacts.
---

# Skill: DB Stored Procedures

## Purpose
Provide a reusable method for stored procedure generation and review so prompts can focus on operation-specific inputs, output format, and artifact paths.

## Inputs
- Approved schema script and data dictionary
- Existing stored procedure files when reviewing or updating
- Requested operations or business behaviors
- Prompt-defined output targets

## Method
1. Read the approved schema and related artifacts first.
2. Map each operation to the correct table and column contracts.
3. Generate idempotent SPs with named parameters and explicit columns.
4. Review for correctness, performance, concurrency, and maintainability.
5. Ensure audit columns and error handling are consistent.

## Quality Rules
- Use `CREATE OR ALTER PROCEDURE` for idempotency.
- Use `SET NOCOUNT ON` and `SET XACT_ABORT ON` in every SP.
- Use `TRY/CATCH` with transaction rollback and `THROW`.
- Never use `SELECT *`.
- Populate audit columns where required.

## Constraints
- Do not invent schema objects or parameter types.
- If the schema or data dictionary is missing, stop and request it.
- Do not rely on dynamic SQL unless explicitly required and justified.

## Output Rules
- Save outputs under `artifacts/stored-procedures/`.
- Use the prompt's naming, formatting, and review rules as final authority.