---
agent: 'agent'
description: Compare Data Dictionary, schema script, and stored procedures for a module to identify mismatches, missing elements, and undeclared dependencies.
---

## Skill Dependency (Mandatory)
- Apply `.github/skills/skill-db-change-management/SKILL.md` before executing this workflow.
- Keep this prompt's analysis tracks and output format as final authority when more specific.

# DB: Generate Gap Analysis

## Purpose

Perform a structured comparison of the three core DB artifacts for a module to identify:
- Columns present in schema but missing from Data Dictionary
- Tables present in schema but missing from ER diagram
- SP parameters that reference non-existent columns
- Lookup FK columns without a corresponding Lookup table
- Undocumented business rules embedded in SPs

## Inputs

- Data Dictionary: `artifacts/data-dictionary/DataDictionary_<ModuleName>_<Version>.md`
- Schema script: `artifacts/schemas/Schema_<ModuleName>_<Version>.sql`
- ER diagram summary: `artifacts/er-diagrams/ER_<ModuleName>_<Version>_summary.md`
- Stored procedures directory: `artifacts/stored-procedures/`

## Analysis Tracks

### Track 1: DD vs Schema
Compare every table and column in the Data Dictionary against the schema script.

| Check | Pass Condition |
|---|---|
| Table exists in schema | `CREATE TABLE` present for every DD table |
| Column exists in schema | Column present in correct table |
| Data type matches | Schema type matches DD type |
| Nullability matches | Schema `NOT NULL` / nullable matches DD |
| PK declared | Schema `PRIMARY KEY` matches DD `Is PK = Y` |
| FK declared | Schema `FOREIGN KEY` matches DD `Is FK = Y` |

### Track 2: Schema vs ER Diagram
Compare every table and FK in the schema against the ER diagram.

| Check | Pass Condition |
|---|---|
| Table has entity node | Every schema table has an ER entity |
| FK has relationship line | Every schema FK has an ER relationship |
| Cardinality labeled | Relationship line uses crow's foot notation |

### Track 3: Schema vs Stored Procedures
Scan all SPs and compare against schema.

| Check | Pass Condition |
|---|---|
| Referenced table exists | Every `FROM`/`JOIN` table exists in schema |
| Referenced column exists | Every column reference is valid |
| Parameter type matches | SP `@Param` type matches schema column type |
| Audit columns populated | Insert/Update SPs set `CreatedDate`, `CreatedBy`, `ModifiedDate`, `ModifiedBy` |

### Track 4: Lookup Completeness
For every FK column ending in `Id` that references a Lookup table:

| Check | Pass Condition |
|---|---|
| Lookup table exists | Referenced lookup table in schema |
| Lookup seeded | Seed script exists in `artifacts/seed-scripts/` |

## Output Format

### Gap Report Structure
```
## Gap Analysis — <ModuleName> v<Version>
Date: <generation date>

### Track 1: DD vs Schema
| # | Table | Column | Gap Type | Severity | Recommended Action |

### Track 2: Schema vs ER
| # | Table/FK | Gap Type | Severity | Recommended Action |

### Track 3: Schema vs SPs
| # | SP Name | Reference | Gap Type | Severity | Recommended Action |

### Track 4: Lookup Completeness
| # | FK Column | Lookup Table | Gap Type | Severity | Recommended Action |

### Summary
- Total gaps found: N
- High severity: N
- Medium severity: N
- Low severity: N
```

Severity: `High` (breaks functionality), `Medium` (incomplete / data integrity risk), `Low` (documentation gap)

## Output Location

- `artifacts/gap-analysis/GapAnalysis_<ModuleName>_<Version>_<Date>.md`
- `reports/evaluations/GapSummary_<ModuleName>_<Date>.md` (executive summary only)

## Prompt Usage Logging (Required)

After successful completion of this workflow, run:

```bash
node .github/initializer/tools/log-prompt-usage.js --prompt-path=.github/prompts/db-generate-gap-analysis.prompt.md
```
