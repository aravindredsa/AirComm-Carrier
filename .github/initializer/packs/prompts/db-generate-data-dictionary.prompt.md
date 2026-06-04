---
agent: 'agent'
description: Analyze PostgreSQL JSONB source data and generate a comprehensive Data Dictionary in Excel-compatible markdown format documenting every column, data type, nullability, FK references, JSON source path, and business description.
---

## Skill Dependency (Mandatory)
- Apply `.github/skills/skill-db-schema-design/SKILL.md` before executing this workflow.
- Keep this prompt's analysis rules and output format as final authority when more specific.

# DB: Generate Data Dictionary

## Purpose

Produce a comprehensive Data Dictionary from PostgreSQL JSONB source data (or an existing schema/sample data file). The Data Dictionary is the master reference artifact that drives all downstream deliverables: schema script, ER diagram, stored procedures, and migration scripts.

## Inputs

Provide one or more of the following as context:

- JSONB source data file (e.g., `SourceJSONBID.txt` or similar)
- Existing schema script (`.sql`)
- Sample data rows
- Module scope description (e.g., "Bidder Management tables only")

## Analysis Rules

### JSON Source Analysis
1. Identify all top-level and nested objects (up to 4 levels deep).
2. Identify arrays — each array element becomes a child table with a FK back to the parent.
3. Identify all scalar fields and classify data type, nullability, and business purpose.
4. Detect patterns:
   - ID fields → `INT` or `BIGINT` primary keys, FK candidates
   - Status/type fields → `VARCHAR` lookup candidates or FK to a lookup table
   - Date/time fields → `DATETIME2` or `DATE`
   - Amount/percentage fields → `DECIMAL(18,4)`
   - Boolean flags → `BIT`
   - Free text notes → `NVARCHAR(MAX)`

### Normalization
- Normalize to 3NF minimum.
- Extract repeating groups into child tables.
- Extract lookup/reference data into separate `*_LOOKUP` / `*_TYPE` tables.

### Naming Conventions
- Table names: `UPPER_SNAKE_CASE` (e.g., `BIDDER_INFO`, `AUCTION_EVENT`)
- Column names: `PascalCase` (e.g., `BidderId`, `PreQualifiedPercent`, `LendingPartner`)
- Primary key columns: `<TableAlias>Id` (e.g., `BidderId` for `BIDDER_INFO`)
- Foreign key columns: match the referenced table's PK column name (e.g., `BidderId`)
- Lookup table FK column suffix: `Id` (e.g., `ClosingStatusId`)

## Output Format

Produce a markdown table for each table with these columns:

| Column Name | Data Type | Nullable | Is PK | Is FK | FK References | JSON Source Path | Business Description | IV Comment |

Rules:
- `Is PK`: `Y` or blank
- `Is FK`: `Y` or blank
- `FK References`: `TABLE_NAME.ColumnName` format
- `JSON Source Path`: dot-notation from root JSON object (e.g., `bid.borrower.firstName`)
- `Business Description`: concise business meaning
- `IV Comment`: blank — reserved for customer review feedback

## Output Location

- Save as `artifacts/data-dictionary/DataDictionary_<ModuleName>_V1.md`
- Also produce an Excel-compatible `.csv` version at `artifacts/data-dictionary/DataDictionary_<ModuleName>_V1.csv`

## Quality Rules

- Every table must have exactly one PK column.
- Every FK must reference a table and column that exists in the data dictionary.
- No column may have both `Is PK = Y` and `Nullable = Y`.
- Lookup/type tables must include at minimum: ID column (PK), Code, Description, IsActive.
- Do not omit columns that exist in the source data.
- Do not invent columns not present in the source data or explicitly requested.

## Do Not

- Do not delete or modify columns already reviewed and accepted in a prior version.
- Do not rename columns reviewed and accepted by the customer unless explicitly requested.
- Retain all columns and tables from previous Data Dictionary versions — only add, never remove.

## Prompt Usage Logging (Required)

After successful completion of this workflow, run:

```bash
node .github/initializer/tools/log-prompt-usage.js --prompt-path=.github/prompts/db-generate-data-dictionary.prompt.md
```
