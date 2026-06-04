---
agent: 'agent'
description: Read customer review comments from the Data Dictionary spreadsheet and regenerate all three artifacts (Data Dictionary, Schema Script, ER Diagram) in one pass, resolving every comment.
---

## Skill Dependency (Mandatory)
- Apply `.github/skills/skill-db-change-management/SKILL.md` before executing this workflow.
- Keep this prompt's comment resolution rules and regeneration order as final authority when more specific.

# DB: Address Review Comments

## Purpose

Process customer review comments from the Data Dictionary and regenerate all three core deliverables — Data Dictionary, Schema Script, and ER Diagram — in one pass.

This implements the review cycle: customer annotates the Data Dictionary → this prompt ingests comments → outputs fully updated v(N+1) artifacts.

## Inputs

- Current Data Dictionary with customer review comments in the `IV Comment` column
  (path: `artifacts/data-dictionary/DataDictionary_<ModuleName>_<Version>.md` or `.csv`)
- Current schema script: `artifacts/schemas/Schema_<ModuleName>_<Version>.sql`
- Current ER diagram: `artifacts/er-diagrams/ER_<ModuleName>_<Version>.drawio`
- New version number (e.g., `V2`, `V3`)

## Comment Processing Rules

### Comment Types and Actions

| Comment Pattern | Action |
|---|---|
| Column rename (e.g., `PreQualifiedAmtPercent → PreQualifiedPercent`) | Rename in DD, schema, ER, and all SPs that reference it |
| Column type change | Update data type in DD and schema |
| New column requested | Add to DD, schema, and ER |
| Column removed | Mark as removed in DD (do NOT delete the row — mark with `[REMOVED]` prefix in Description); remove from schema and ER |
| Table added | Add full table to DD, schema, ER |
| Table removed | Mark as `[REMOVED]` in DD; remove from schema and ER |
| FK change | Update both DD and schema FK references and ER relationship lines |
| Business description update | Update DD description only |
| No changes required (e.g., `no changes required after discussion`) | Record as accepted; make no modifications for this row |
| Type clarification (e.g., `Define the type`) | Infer the most appropriate SQL type based on column name/content; note rationale in IV Comment column |

### Retention Rule
- **Never delete rows from the Data Dictionary** — columns/tables that are removed get `[REMOVED]` prefix in Description.
- Always increment the version number of the output artifacts.

## Execution Steps

1. Parse all rows in the `IV Comment` column.
2. Classify each comment by type (from table above).
3. Apply changes to the Data Dictionary first.
4. Re-generate the schema script from the updated Data Dictionary (follow `DB_generate-schema-script` rules).
5. Re-generate the ER diagram from the updated Data Dictionary (follow `DB_generate-er-diagram` rules).
6. Verify cross-artifact consistency after regeneration.

## Output Location

- `artifacts/data-dictionary/DataDictionary_<ModuleName>_V<N+1>.md` and `.csv`
- `artifacts/schemas/Schema_<ModuleName>_V<N+1>.sql`
- `artifacts/er-diagrams/ER_<ModuleName>_V<N+1>.drawio`

## Final Summary

Produce a comment resolution report:
- Total comments processed
- Changes applied (with description of each change)
- Comments accepted without change (with reason)
- Comments skipped or unclear (flag for manual review)
- Cross-artifact consistency check result

## Prompt Usage Logging (Required)

After successful completion of this workflow, run:

```bash
node .github/initializer/tools/log-prompt-usage.js --prompt-path=.github/prompts/db-address-review-comments.prompt.md
```
