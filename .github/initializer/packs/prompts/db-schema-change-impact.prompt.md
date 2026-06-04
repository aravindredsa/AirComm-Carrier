---
agent: 'agent'
description: When a column is added, renamed, removed, or its type changes — propagate that change across all affected artifacts (Data Dictionary, Schema Script, ER Diagram, Stored Procedures, Seed Scripts, Migration Scripts).
---

## Skill Dependency (Mandatory)
- Apply `.github/skills/skill-db-change-management/SKILL.md` before executing this workflow.
- Keep this prompt's impact map and consistency verification rules as final authority when more specific.

# DB: Schema Change Impact Analysis

## Purpose

When a schema column or table changes, identify every artifact and code location that is affected and produce updated versions. This ensures consistency across the full artifact set after any approved schema modification.

## Inputs

- Change description (from user): e.g., `Rename column PreQualifiedAmtPercent → PreQualifiedPercent in BIDDER_INFO`
- Or: `Add column LoanOfficerEmail NVARCHAR(200) to BIDDER_INFO`
- Or: `Remove column LegacyRef from AUCTION_EVENT`
- Current artifact versions to target

## Change Classification

| Change Type | Impact Scope |
|---|---|
| Column rename | DD, Schema, ER, all SPs that reference it, seed scripts (if lookup) |
| Column type change | DD, Schema, all SPs that use the column as a parameter |
| Column added | DD, Schema, ER (if structural), SPs (add to Insert/Update SPs) |
| Column removed | DD (mark `[REMOVED]`), Schema (drop column), ER, SPs (remove from SELECT/INSERT/UPDATE) |
| Table added | DD, Schema, ER, generate CRUD SPs |
| Table removed | DD (mark `[REMOVED]`), Schema (drop table), ER, all SPs referencing the table |
| FK added | DD, Schema, ER (add relationship line) |
| FK removed | DD, Schema, ER (remove line) |
| Data type narrowed | Schema, all SPs (check for truncation risk) |
| Index added/removed | Schema only (unless SP hints reference it) |

## Execution Steps

1. **Impact Map**: List every file/artifact affected by this change with the specific location (table, column, SP name, line reference).
2. **Risk Assessment**: Flag any potential data loss, truncation, or integrity risks.
3. **Apply Changes**: For each affected artifact, produce the updated version.
4. **Consistency Verification**: After applying all changes, run a cross-artifact check (same as `DB_generate-gap-analysis`) to confirm no residual mismatches.

## Impact Map Format (Step 1 Output)

```
## Schema Change Impact Map
Change: <description>
Date: <date>

| Artifact | File | Location | Change Required |
|---|---|---|---|
| Data Dictionary | DataDictionary_BID_V3.md | BIDDER_INFO.PreQualifiedAmtPercent row | Rename column |
| Schema Script | Schema_BID_V3.sql | Line 45, BIDDER_INFO column def | Rename column |
| ER Diagram | ER_BID_V3.drawio | BIDDER_INFO entity | Update label |
| SP | usp_BidderInfo_Insert.sql | @PreQualifiedAmtPercent parameter | Rename parameter |
| SP | usp_BidderInfo_Update.sql | @PreQualifiedAmtPercent parameter | Rename parameter |
```

## Output Location

- Impact map: `reports/evaluations/SchemaChangeImpact_<Change>_<Date>.md`
- Updated artifacts: increment version numbers in-place (`V3 → V4`)

## Safety Rules

- Never drop a column from the Data Dictionary — mark as `[REMOVED]`.
- Never create a migration script that could cause data loss without an explicit warning comment.
- Flag any breaking changes to external consumers (e.g., APIs or ETL jobs that use the column).

## Prompt Usage Logging (Required)

After successful completion of this workflow, run:

```bash
node .github/initializer/tools/log-prompt-usage.js --prompt-path=.github/prompts/db-schema-change-impact.prompt.md
```
