---
agent: 'agent'
description: One-pass generation of all three core DB artifacts — Data Dictionary, Schema Script, and ER Diagram — from JSONB source data or existing inputs for a given module.
---

## Skill Dependency (Mandatory)
- Apply `.github/skills/skill-db-schema-design/SKILL.md` before executing this workflow.
- Keep this prompt's execution order and cross-artifact consistency rules as final authority when more specific.

# DB: Generate All Artifacts

## Purpose

Generate all three core deliverables in a single prompt execution for a given module:

1. **Data Dictionary** (markdown + CSV) — `artifacts/data-dictionary/`
2. **Schema Script** (T-SQL `.sql`) — `artifacts/schemas/`
3. **ER Diagram** (`.drawio` XML) — `artifacts/er-diagrams/`

These three artifacts are shared together with the customer for review.

## Inputs

Provide one or more of the following:
- JSONB source data file
- Existing schema script
- Module name and scope description
- Target DB schema name (e.g., `BID`, `AUCTION`)

## Execution Order

Run in this exact sequence — each step depends on the output of the previous:

### Step 1: Generate Data Dictionary
Follow all rules in `.github/prompts/db-generate-data-dictionary.prompt.md`.
Output: `artifacts/data-dictionary/DataDictionary_<ModuleName>_V1.md` and `.csv`

### Step 2: Generate Schema Script
Follow all rules in `.github/prompts/db-generate-schema-script.prompt.md`.
Use the Data Dictionary produced in Step 1 as input.
Output: `artifacts/schemas/Schema_<ModuleName>_V1.sql`

### Step 3: Generate ER Diagram
Follow all rules in `.github/prompts/db-generate-er-diagram.prompt.md`.
Use the Data Dictionary produced in Step 1 as input.
Output: `artifacts/er-diagrams/ER_<ModuleName>_V1.drawio` and `_summary.md`

## Cross-Artifact Consistency Rules

After generating all three, verify:
- Every table in the schema script exists in the Data Dictionary.
- Every FK in the schema script has a corresponding relationship in the ER diagram.
- Column names and data types are identical across Data Dictionary, schema script, and ER diagram.
- If any inconsistency is found, fix it and note the correction in the final summary.

## Final Summary

Output a concise summary:
- Module name
- Tables generated
- Total columns
- FK relationships
- Output files produced (with relative paths)
- Any corrections applied during cross-artifact validation

## Prompt Usage Logging (Required)

After successful completion of this workflow, run:

```bash
node .github/initializer/tools/log-prompt-usage.js --prompt-path=.github/prompts/db-generate-all-artifacts.prompt.md
```
