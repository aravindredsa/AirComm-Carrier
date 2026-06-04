---
agent: 'agent'
description: Generate master data seed scripts for Lookup and LookupType tables with IF NOT EXISTS guards for idempotent execution.
---

## Skill Dependency (Mandatory)
- Apply `.github/skills/skill-db-seed-and-deployment/SKILL.md` before executing this workflow.
- Keep this prompt's seed rules and output location as final authority when more specific.

# DB: Generate Lookup Seed Scripts

## Purpose

Produce seed scripts for Lookup and Reference (LookupType) tables. All scripts must be idempotent — safe to run multiple times without creating duplicate rows.

## Inputs

- Approved Data Dictionary or schema script identifying Lookup/LookupType tables
- Lookup values (may be provided inline, from a spreadsheet attachment, or inferred from column names and business context)
- Target schema name

## Lookup Table Detection

Identify Lookup/LookupType tables by:
- Table name ending in `_LOOKUP`, `_TYPE`, `_STATUS`, `_CATEGORY`, or `_CONFIG`
- Tables with only ID, Code, Description, and IsActive columns
- FK target tables referenced by `*StatusId`, `*TypeId`, `*CategoryId`, `*ConfigId` columns

## Seed Script Rules

### Pattern for Each Row
```sql
IF NOT EXISTS (SELECT 1 FROM [Schema].[TABLE_NAME] WHERE [Code] = 'VALUE')
BEGIN
  INSERT INTO [Schema].[TABLE_NAME] ([Code], [Description], [IsActive], [CreatedDate], [CreatedBy])
  VALUES ('VALUE', 'Human readable description', 1, GETUTCDATE(), 'SEED_SCRIPT');
END
GO
```

### Script Structure
For each Lookup table:
1. Comment block: table name, purpose, version, generation date
2. `IF NOT EXISTS` seed statement for each row
3. `GO` after each block

### Lookup Value Inference
When actual values are not provided, infer from:
- Column names (e.g., `ClosingStatus` → values: Active, Closed, Cancelled, Pending)
- Industry-standard lookup lists for real estate / auction domain
- Flag explicitly inferred values with comment: `-- INFERRED: verify with business`

### Null/Empty Guard
Do not insert rows where `Code` would be empty or `NULL`.

## Output Location

- Individual table seed file: `artifacts/seed-scripts/Seed_<TABLE_NAME>.sql`
- Combined seed deployment script: `artifacts/seed-scripts/Seed_AllLookups_<ModuleName>_<Version>.sql`

## Quality Rules

- All scripts must use `IF NOT EXISTS` guard (idempotent).
- All scripts must use named column lists in `INSERT` (no positional inserts).
- All `IsActive` values default to `1` (active).
- All `CreatedDate` values use `GETUTCDATE()`.
- All `CreatedBy` values use `'SEED_SCRIPT'` placeholder.
- If a lookup value is inferred (not provided), add `-- INFERRED: verify with business` comment.

## Prompt Usage Logging (Required)

After successful completion of this workflow, run:

```bash
node .github/initializer/tools/log-prompt-usage.js --prompt-path=.github/prompts/db-generate-lookup-seed-scripts.prompt.md
```
