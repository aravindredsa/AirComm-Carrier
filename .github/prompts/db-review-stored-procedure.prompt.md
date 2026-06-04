---
agent: 'agent'
description: Review an existing stored procedure for correctness, performance, concurrency handling, and coding standard compliance. Produce an improved version with explanations.
---

## Skill Dependency (Mandatory)
- Apply `.github/skills/skill-db-stored-procedures/SKILL.md` before executing this workflow.
- Keep this prompt's review dimensions and output format as final authority when more specific.

# DB: Review Stored Procedure

## Purpose

Perform a structured review of an existing stored procedure (SP) and produce:
1. A findings report summarizing issues found
2. An improved version of the SP with all issues resolved

## Input

Paste the SP to review, or reference its file path: `artifacts/stored-procedures/<filename>.sql`

## Review Dimensions

### 1. Correctness
- Does the SP correctly implement the intended business logic?
- Are all FK references valid (do they reference actual tables/columns)?
- Are data types consistent between parameters and target columns?
- Are NULL handling and optional parameters handled correctly?
- Are cursor-based loops used where set-based operations would suffice?

### 2. Performance
- Are indexes used effectively on filter and join columns?
- Are implicit type conversions present (will disable index usage)?
- Are sub-queries used where CTEs or JOINs would be more efficient?
- Are derived tables present (replace with CTEs)?
- Is `SELECT *` used anywhere (expand to named columns)?
- Is `WITH (NOLOCK)` applied appropriately (only on read-only, never on transactional)?
- Are unnecessary re-reads of the same data present?

### 3. Concurrency Handling
- Are appropriate isolation levels set?
- Is `SET XACT_ABORT ON` present for transaction safety?
- Are transactions scoped as narrowly as possible?
- Is `@@TRANCOUNT` checked before rollback in CATCH blocks?
- Are there possible deadlock risks (table access order, lock escalation)?

### 4. Error Handling
- Is a `BEGIN TRY / BEGIN CATCH` block present?
- Is `THROW` used in CATCH (preferred over `RAISERROR`)?
- Is the transaction rolled back on error?
- Are meaningful error messages propagated?

### 5. Format and Maintainability
- Is the header comment block present (SP purpose, author, version, date)?
- Is `SET NOCOUNT ON` present?
- Are column names and table names consistently bracketed?
- Is indentation consistent (2 or 4 spaces)?
- Is dynamic SQL present without justification?

### 6. Schema Alignment
- Does the SP reference columns and tables that exist in the current approved schema?
- Are audit columns (`CreatedDate`, `CreatedBy`, `ModifiedDate`, `ModifiedBy`) populated?

## Output Format

### Section 1: Findings Summary
| # | Dimension | Severity | Finding | Recommendation |
|---|---|---|---|---|
| 1 | Performance | High | `SELECT *` on line 12 | Replace with explicit column list |

Severity levels: `High` / `Medium` / `Low` / `Info`

### Section 2: Improved SP
Output the full corrected SP with inline comments where changes were made:
```sql
-- CHANGED: replaced SELECT * with named columns for performance
-- CHANGED: wrapped in TRY/CATCH with transaction rollback
-- CHANGED: replaced derived table with CTE
```

## Output Location

- Save findings report: `reports/evaluations/SPReview_<SPName>_<Date>.md`
- Save improved SP: `artifacts/stored-procedures/<SPName>_Improved.sql`

## Prompt Usage Logging (Required)

After successful completion of this workflow, run:

```bash
node .github/initializer/tools/log-prompt-usage.js --prompt-path=.github/prompts/db-review-stored-procedure.prompt.md
```
