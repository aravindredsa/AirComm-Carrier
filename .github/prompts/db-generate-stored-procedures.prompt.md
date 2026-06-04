---
agent: 'agent'
description: Generate CRUD and business logic stored procedures (SPs) aligned with the approved schema and Data Dictionary for a given module.
---

## Skill Dependency (Mandatory)
- Apply `.github/skills/skill-db-stored-procedures/SKILL.md` before executing this workflow.
- Keep this prompt's generation rules and output location as final authority when more specific.

# DB: Generate Stored Procedures

## Purpose

Generate production-ready stored procedures (SPs) for the specified module. SPs must be aligned with the approved schema, follow T-SQL best practices, and include proper error handling and transaction management.

## Inputs

- Approved schema script: `artifacts/schemas/Schema_<ModuleName>_<Version>.sql`
- Approved Data Dictionary: `artifacts/data-dictionary/DataDictionary_<ModuleName>_<Version>.md`
- List of operations required (or generate standard CRUD set for each table if not specified)

## SP Types to Generate

### CRUD SPs (generate for every table unless told otherwise)

| SP Type | Naming Convention | Description |
|---|---|---|
| Insert | `usp_<TableAlias>_Insert` | Insert one row, return new ID |
| Update | `usp_<TableAlias>_Update` | Update row by PK |
| Delete (soft) | `usp_<TableAlias>_Delete` | Set `IsActive = 0` (soft delete by default) |
| Select by ID | `usp_<TableAlias>_GetById` | Select one row by PK |
| Select all active | `usp_<TableAlias>_GetAll` | Select all rows where `IsActive = 1` |
| Select by parent | `usp_<TableAlias>_GetBy<ParentKey>` | Select child rows by parent FK |

### Business Logic SPs
Generate additional SPs for any business operation described in the Data Dictionary or explicitly requested.

## SP Writing Rules

### Structure
```sql
CREATE OR ALTER PROCEDURE [Schema].[usp_<Name>]
  @Param1  DataType,
  @Param2  DataType
AS
BEGIN
  SET NOCOUNT ON;
  SET XACT_ABORT ON;

  BEGIN TRY
    BEGIN TRANSACTION;

    -- SP body here

    COMMIT TRANSACTION;
  END TRY
  BEGIN CATCH
    IF @@TRANCOUNT > 0 ROLLBACK TRANSACTION;
    THROW;
  END CATCH
END
GO
```

### Rules
- Use `CREATE OR ALTER PROCEDURE` for idempotent deployment.
- All parameters must use the exact data types from the schema (no mismatches).
- Use named parameters — no positional parameter reliance.
- No `SELECT *` — always name columns explicitly.
- No dynamic SQL unless specifically required (must be justified with a comment).
- No sub-queries where a JOIN can be used.
- No derived tables — use CTEs instead.
- Include `SET NOCOUNT ON` and `SET XACT_ABORT ON` at the top of every SP.
- Wrap multi-statement SPs in `BEGIN TRY / BEGIN CATCH` with transaction rollback on error.
- Use `THROW` in `CATCH` blocks to propagate errors (not `RAISERROR`).
- Audit columns (`CreatedDate`, `CreatedBy`, `ModifiedDate`, `ModifiedBy`) must be populated by all Insert/Update SPs.

### Performance Rules
- Use `WITH (NOLOCK)` hint only on read-only reporting SPs, never on transactional SPs.
- Avoid implicit conversions — ensure parameter types exactly match column types.
- Parameterize all filter conditions (no string concatenation).

## Output Location

- Save each SP as a separate file: `artifacts/stored-procedures/usp_<TableAlias>_<Operation>.sql`
- Also produce a combined deployment script: `artifacts/stored-procedures/Deploy_SPs_<ModuleName>_<Version>.sql`

## Quality Rules

- Every SP must compile without errors against the target schema.
- Every FK parameter must correspond to an existing PK in the referenced table.
- All SPs must be idempotent (`CREATE OR ALTER`).

## Prompt Usage Logging (Required)

After successful completion of this workflow, run:

```bash
node .github/initializer/tools/log-prompt-usage.js --prompt-path=.github/prompts/db-generate-stored-procedures.prompt.md
```
