# Stored Procedure Development Workflow

## Purpose
This playbook describes how to develop, review, and finalize stored procedures using the DB enabler prompts. It covers generating SPs from an approved schema, iterating on review feedback, and organizing SP artifacts.

---

## Prerequisites

Before developing SPs:
- [ ] Data Dictionary approved by customer (at minimum)
- [ ] Schema Script at a stable version in `artifacts/schemas/`
- [ ] Tables targeted by the SPs are clearly identified

---

## Step 1: Identify SP Requirements

Before generating, define the list of SPs needed for the module. Common operations per table:
- `Insert` — create a new record
- `Update` — modify specific fields
- `Delete` — soft delete (mark `IsActive = 0`)
- `GetById` — retrieve single record
- `GetPaged` — paginated list with filtering
- `GetAll` — full list (use with caution for large tables)

Additional SP types:
- Business logic SPs (e.g., `usp_BidderManagement_ApplyPreQual`)
- Cross-table query SPs (e.g., `usp_Auction_GetAuctionWithBidders`)
- Reporting SPs

Document the list before invoking the generation prompt. This prevents partial or missing SP sets.

---

## Step 2: Generate Stored Procedures

**Prompt**: `/DB_generate-stored-procedures`

Provide:
- The approved Schema Script for the target tables
- The list of required SPs from Step 1
- Any business logic rules that must be enforced (from `defaultClientId_DB_Rules.xlsx` if applicable)

**Output**: `artifacts/stored-procedures/SPs_<Module>_V1.sql`

The prompt will:
- Generate parameterized SPs with `TRY/CATCH`/`THROW` error handling
- Follow `usp_<TableAlias>_<Operation>` naming convention
- Include `SET NOCOUNT ON` on every SP
- Use soft delete (`IsActive = 0`) where applicable
- Include inline comments for business logic

---

## Step 3: Review Stored Procedures

**Prompt**: `/DB_review-stored-procedure`

Run this review on the generated SP set. The prompt evaluates 6 dimensions:
1. **Correctness** — SP logic matches the intent
2. **Performance** — Appropriate indexes used; no N+1 or NOLOCK misuse
3. **Concurrency** — Transaction isolation handled correctly
4. **Error Handling** — TRY/CATCH/THROW present and correct
5. **Code Formatting** — Follows `sp-coding-standards.md`
6. **Schema Alignment** — All referenced tables/columns exist in the schema

Review output format:
- Severity labels: `[CRITICAL]`, `[MAJOR]`, `[MINOR]`, `[INFO]`
- Finding table with SP name, dimension, finding, recommendation

---

## Step 4: Apply Review Findings

Iterate on findings using `/DB_review-stored-procedure` until no `[CRITICAL]` or `[MAJOR]` findings remain.

Document the final approved SP set version:
```
SPs_<Module>_V1.sql  → Initial generation
SPs_<Module>_V2.sql  → Review iteration 1
SPs_<Module>_V3.sql  → APPROVED (YYYY-MM-DD)
```

---

## Step 5: Gap Analysis After SP Approval

**Prompt**: `/DB_generate-gap-analysis`

Run this to confirm the full artifact set is consistent:
- All tables in the DD have at least Insert/Update/Delete coverage
- All SP parameters match column types in the schema
- No orphaned SPs referencing dropped tables

---

## Step 6: Deployment Preparation

**Prompt**: `/DB_post-deployment-preparation`

Generate the idempotent deployment script that promotes SPs from Dev → QA and QA → Prod. This script must be reviewed before execution.

---

## SP Naming Reference

| Pattern | Example |
|---|---|
| `usp_<TableAlias>_Insert` | `usp_BidMgmt_Insert` |
| `usp_<TableAlias>_Update` | `usp_BidMgmt_Update` |
| `usp_<TableAlias>_Delete` | `usp_BidMgmt_Delete` |
| `usp_<TableAlias>_GetById` | `usp_BidMgmt_GetById` |
| `usp_<TableAlias>_GetPaged` | `usp_BidMgmt_GetPaged` |
| `usp_<TableAlias>_<Action>` | `usp_BidMgmt_ApplyPreQual` |

---

## Output Files

```
artifacts/stored-procedures/
  SPs_<Module>_V1.sql
  SPs_<Module>_V2.sql
  SPs_<Module>_<Version>_APPROVED.sql
```
