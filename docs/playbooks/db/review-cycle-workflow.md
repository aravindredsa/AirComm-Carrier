# Review Cycle Workflow

## Purpose
This playbook describes how to run the customer review and iteration cycle for DB artifacts. It covers receiving review feedback, processing comments, regenerating artifacts, and tracking approval status.

---

## When to Use
After sharing the initial (V1) set of artifacts with the customer and receiving back the annotated Data Dictionary with `IV Comment` entries.

---

## Inputs Required

| Input | Location | Notes |
|---|---|---|
| Reviewed Data Dictionary | `artifacts/data-dictionary/DataDictionary_<Module>_VN.csv` | Customer has filled IV Comment column |
| Current Schema Script | `artifacts/schemas/Schema_<Module>_VN.sql` | Will be regenerated |
| Current ER Diagram | `artifacts/er-diagrams/ER_<Module>_VN.drawio` | Will be regenerated |

---

## Iteration Loop

### 1. Triage Comments

Before invoking the prompt, manually read all `IV Comment` entries and classify:
- **Rename** — column/table name change
- **Type change** — data type clarification
- **New addition** — new column or table requested
- **Removal** — column no longer needed
- **Clarification** — informational, no structural change needed
- **Approved** — `no changes required` or blank with positive confirmation

If all comments are Approved or Clarification-only, skip to Approval step.

### 2. Run Address Review Comments Prompt

**Prompt**: `/DB_address-review-comments`

Provide:
- The full reviewed Data Dictionary (paste or attach)
- The current Schema Script
- A summary list of the types of changes found (from triage above)

The prompt will:
1. Apply all structural changes to the DD
2. Regenerate the Schema Script at V(N+1)
3. Regenerate the ER Diagram at V(N+1)
4. Produce a Change Summary table listing every comment and its resolution

### 3. Verify Output

Before sharing back with customer, verify:

**Data Dictionary:**
- [ ] Version number incremented
- [ ] All IV Comments addressed (column updated or change documented)
- [ ] No IV Comment rows deleted — addressed ones can have `RESOLVED:` prefix added to the comment
- [ ] Audit columns still present on every table
- [ ] IV Comment column is blank again (ready for next review round)

**Schema Script:**
- [ ] Version number in file header incremented
- [ ] All structural changes from DD reflected
- [ ] No orphaned FK references
- [ ] Script remains idempotent

**ER Diagram:**
- [ ] Renamed tables/columns reflected
- [ ] New tables/columns added
- [ ] Removed items absent

**Gap Analysis** (recommended): Run `/DB_generate-gap-analysis` to confirm all three artifacts are aligned. Resolve any gaps before sending to customer.

### 4. Resend to Customer

Send the customer updated package:
1. Updated `DataDictionary_<Module>_V(N+1).csv`
2. Updated `Schema_<Module>_V(N+1).sql`
3. Updated `ER_<Module>_V(N+1).drawio`
4. Change Summary list (from the prompt output)

### 5. Track Approval Status

Maintain an approval status note in `artifacts/data-dictionary/`:
```
DataDictionary_<Module>_V1.csv  → Customer review pending
DataDictionary_<Module>_V2.csv  → Iteration 2 — changes applied
DataDictionary_<Module>_V3.csv  → APPROVED (YYYY-MM-DD)
```

---

## Approval Criteria

Customer approval is confirmed when:
- Customer explicitly states approval in writing (email or Teams message)
- OR all `IV Comment` entries are `no changes required after discussion`

Do not proceed to deployment without explicit approval.

---

## Common Issues

| Issue | Resolution |
|---|---|
| Customer edits column names in the DD directly | Undo their edits; only IV Comment column should be modified by customer |
| Multiple IV Comments on the same column | Address each separately in the Change Summary |
| Conflicting comments (C1 renames a column that C2 references by old name) | Note the conflict in Change Summary and pick the consistent resolution |
| Customer asks for a new schema/module mid-cycle | Start a new schema design workflow for the new module; keep existing module iteration on its own track |
