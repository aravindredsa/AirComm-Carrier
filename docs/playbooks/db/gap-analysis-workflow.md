# Gap Analysis Workflow

## Purpose
This playbook describes how to run a gap analysis across the DB artifact set to detect inconsistencies between the Data Dictionary, Schema Script, ER Diagram, and Stored Procedures. Run this at any stage where artifact drift is suspected.

---

## When to Run

| Trigger | Description |
|---|---|
| After review iteration | Ensure address-review-comments didn't introduce drift |
| After SP generation | Confirm all tables have SP coverage |
| Before customer sharing | Final consistency check before sending artifacts |
| After schema change impact | Confirm all downstream artifacts updated |
| Pre-deployment | Last check before executing against Dev/QA/Prod |

---

## Inputs Required

| Input | Location | Notes |
|---|---|---|
| Data Dictionary | `artifacts/data-dictionary/DataDictionary_<Module>_VN.csv` | Must be latest approved version |
| Schema Script | `artifacts/schemas/Schema_<Module>_VN.sql` | Must match DD version |
| ER Diagram | `artifacts/er-diagrams/ER_<Module>_VN.drawio` | Optional but recommended |
| Stored Procedures | `artifacts/stored-procedures/SPs_<Module>_VN.sql` | Required for SP coverage track |

---

## Step 1: Run Gap Analysis Prompt

**Prompt**: `/DB_generate-gap-analysis`

Provide all available artifacts. The prompt evaluates 4 tracks:
1. **Track A: DD vs Schema** — Every DD table/column present in the schema with matching types and constraints
2. **Track B: Schema vs DD** — No schema objects missing from the DD
3. **Track C: ER vs DD** — All DD tables/FKs reflected in the ER diagram
4. **Track D: SP Coverage** — All tables have minimum Insert/Update/Delete/GetById coverage

---

## Step 2: Read the Gap Analysis Report

The output is structured by track. Each finding has a severity:
- `[CRITICAL]` — Structural mismatch that will cause runtime errors
- `[MAJOR]` — Missing SP or missing artifact entry
- `[MINOR]` — Naming inconsistency or incomplete metadata
- `[INFO]` — Advisory note, no immediate action required

---

## Step 3: Resolve Gaps

### Track A/B Gaps (DD vs Schema mismatch)
- Re-run `/DB_generate-schema-script` with the latest DD
- Or manually apply the specific change to the schema and increment the version

### Track C Gaps (ER vs DD mismatch)
- Re-run `/DB_generate-er-diagram` with the latest DD

### Track D Gaps (missing SP coverage)
- Run `/DB_generate-stored-procedures` specifying only the missing SPs

---

## Step 4: Re-Run Until Clean

After resolving findings, re-run `/DB_generate-gap-analysis` to confirm no `[CRITICAL]` or `[MAJOR]` findings remain.

Acceptable final state:
- Zero `[CRITICAL]` findings
- Zero `[MAJOR]` findings
- `[MINOR]` and `[INFO]` findings documented and acknowledged

---

## Output Files

Save the gap analysis report to:
```
artifacts/gap-analysis/GapAnalysis_<Module>_<YYYY-MM-DD>.md
```

Include:
- Date run
- Artifact versions analyzed
- Summary counts by severity and track
- Finding table
- Resolution notes
