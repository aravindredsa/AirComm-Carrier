---
agent: 'agent'
description: Generate a complete SQL CREATE TABLE schema script from the approved Data Dictionary, applying naming conventions, constraints, FKs, and indexes.
---

## Skill Dependency (Mandatory)
- Apply `.github/skills/skill-db-schema-design/SKILL.md` before executing this workflow.
- Keep this prompt's generation rules and output location as final authority when more specific.

# DB: Generate Schema Script

## Purpose

Produce a production-ready SQL schema script from the approved Data Dictionary. The script must be idempotent, fully constrained, and ready for execution against Azure SQL (T-SQL syntax).

## Input

- Approved Data Dictionary file at `artifacts/data-dictionary/DataDictionary_<ModuleName>_<Version>.md` (or `.csv`)
- Specify the target schema name (e.g., `BID`, `AUCTION`, `dbo`)

## Generation Rules

### Script Structure
Generate in this order:
1. Script header comment block with: module name, version, generation date, source DD version
2. `USE [DatabaseName]` statement (use a placeholder comment if unknown)
3. `SET NOCOUNT ON; SET XACT_ABORT ON;`
4. `CREATE SCHEMA` statements (if schema is not `dbo`)
5. `CREATE TABLE` statements — parent tables before child tables (topological order for FK dependencies)
6. `ALTER TABLE` statements to add FK constraints (after all tables created)
7. `CREATE INDEX` and `CREATE UNIQUE INDEX` statements

### Table Rules
- Use `IF OBJECT_ID(...) IS NOT NULL DROP TABLE ...` guard before each `CREATE TABLE` — only for fresh creation scripts
- For migration-safe scripts: use `IF OBJECT_ID(...) IS NULL` guard around each table
- All table names: `[Schema].[TABLE_NAME]` with brackets
- All column names: `[PascalCase]` with brackets
- Include column-level `CONSTRAINT PK_<table>_<col> PRIMARY KEY CLUSTERED` on PK column
- Include `DEFAULT` constraints where applicable (e.g., `DEFAULT GETUTCDATE()` for audit timestamps, `DEFAULT 1` for `IsActive`)

### Column Type Mapping
Follow the data dictionary exactly:
- `INT` / `BIGINT` — integer identifiers
- `DECIMAL(18,4)` — monetary or percentage amounts
- `NVARCHAR(n)` — variable character (use `MAX` only for free-text notes)
- `VARCHAR(n)` — ASCII-safe codes (e.g., status codes, enums)
- `DATETIME2(7)` — timestamps
- `DATE` — date-only fields
- `BIT` — boolean flags (0/1)
- `UNIQUEIDENTIFIER` — GUID fields

### Constraint Naming
- Primary key: `PK_<TABLE_NAME>`
- Foreign key: `FK_<TABLE_NAME>_<REFERENCED_TABLE>_<ColumnName>`
- Unique constraint: `UQ_<TABLE_NAME>_<ColumnName>`
- Default constraint: `DF_<TABLE_NAME>_<ColumnName>`
- Check constraint: `CK_<TABLE_NAME>_<ColumnName>`

### Indexes
- Create clustered index on PK (implicit with PRIMARY KEY CLUSTERED)
- Create non-clustered indexes on all FK columns
- Create non-clustered index on any column marked as a common filter/lookup key in the DD

### Audit Columns
Add to every table automatically:
```sql
[CreatedDate]  DATETIME2(7) NOT NULL CONSTRAINT DF_<table>_CreatedDate DEFAULT GETUTCDATE(),
[CreatedBy]    NVARCHAR(100) NOT NULL,
[ModifiedDate] DATETIME2(7) NULL,
[ModifiedBy]   NVARCHAR(100) NULL
```

## Output Location

- Save as `artifacts/schemas/Schema_<ModuleName>_<Version>.sql`

## Quality Rules

- Script must be syntactically valid T-SQL.
- All FK references must resolve to existing tables in the same script.
- No circular FK dependencies (report if found, suggest resolution).
- Every table must have at least one PK constraint.
- Script must be idempotent when using `IF NOT EXISTS` guards.
- Do not use `SELECT *` anywhere in the output.

## Do Not

- Do not omit any table or column that exists in the Data Dictionary.
- Do not use dynamic SQL in the schema script.
- Do not add columns not present in the Data Dictionary without explicit request.

## Prompt Usage Logging (Required)

After successful completion of this workflow, run:

```bash
node .github/initializer/tools/log-prompt-usage.js --prompt-path=.github/prompts/db-generate-schema-script.prompt.md
```
