# Onboarding Guide — AI DB Enabler

## Welcome

This workspace provides AI-assisted workflows for database schema design, stored procedure development, data migration analysis, and quality auditing for the Apollo DB project (Cascade 2.0).

---

## Phase 1: Understand the Workspace

### Read These First

1. **README.md** — Project overview and context
2. **docs/references/FOLDER-STRUCTURE.md** — Workspace organization
3. **.github/copilot-instructions.md** — Project rules and Copilot behavior
4. **.github/prompts/README.md** — List of all available prompts

### Key Folders to Know

- **.github/prompts/** — All runnable DB workflow prompts
- **config/** — Standards resolution policy, client profiles, and standards catalog used to resolve DB standards
- **docs/playbooks/** — Step-by-step workflow guides for each major process
- **artifacts/** — Generated working outputs (DD, schemas, SPs, ER diagrams, seed scripts)
- **reports/** — Audit and quality evaluation reports

---

## Phase 2: Initialize the Workspace

If your repository has not been aligned yet, run in Copilot Agent mode:

```
/initialize-ai-workspace
```

This creates the standard folders, seeds missing files, and aligns the workspace structure.

---

## Phase 3: Understand the DB Workflow

The core DB workflow follows this sequence:

### Step 0 (Optional): Normalize JSON Source
If starting from raw JSONB data:
```
/DB_normalize-json-source
```
Provide the JSONB source file. Output: normalization analysis in `artifacts/data-dictionary/`.

### Step 1: Generate Data Dictionary
```
/DB_generate-data-dictionary
```
Provide the JSONB source or an existing schema. Output: `artifacts/data-dictionary/`.

### Step 2: Generate Schema Script
```
/DB_generate-schema-script
```
Uses the Data Dictionary from Step 1. Output: `artifacts/schemas/`.

### Step 3: Generate ER Diagram
```
/DB_generate-er-diagram
```
Uses the Data Dictionary. Output: `artifacts/er-diagrams/`.

### Or: All in One Pass
```
/DB_generate-all-artifacts
```
Runs Steps 1–3 in sequence with cross-artifact consistency check.

### Step 4: Share with Customer
Send the customer: Data Dictionary + Schema Script + ER Diagram.
Customer adds review comments to the Data Dictionary's `IV Comment` column.

### Step 5: Address Review Comments
```
/DB_address-review-comments
```
Provide the reviewed Data Dictionary. The prompt processes all comments and regenerates all three artifacts.

### Step 6: Iterate
Repeat Steps 4–5 until the customer approves.

---

## Phase 4: Development Activities

### Generate Stored Procedures
```
/DB_generate-stored-procedures
```
Produces CRUD and business logic SPs aligned with the approved schema.

### Review / Optimize a SP
```
/DB_review-stored-procedure
```
Paste or reference the SP. Produces findings report + improved version.

### Generate Lookup Seed Scripts
```
/DB_generate-lookup-seed-scripts
```
Produces `IF NOT EXISTS` seed scripts for all Lookup tables.

### Prepare Deployment Scripts
```
/DB_post-deployment-preparation
```
Produces idempotent Dev→QA or QA→Prod promotion scripts.

---

## Phase 5: Quality and Analysis

### Gap Analysis
```
/DB_generate-gap-analysis
```
Compares DD, schema, and SPs for mismatches.

### Schema Change Impact
```
/DB_schema-change-impact
```
Propagates a schema change (rename, add, remove) across all artifacts.

### Pre-Commit Audit
```
/audit-uncommitted-changes
```
Review modified SQL/DD files before committing.

### Artifact Quality Evaluation
```
/evaluate-output-quality
```
Score any artifact against DB enabler standards.

---

## Key Standards to Know

- Resolve standards through `config/standards-resolution-policy.json`, `config/client-profiles.json`, and `config/standards-catalog.json`.
- Apply shared standards first, then the resolved DB domain standards, then the resolved database and SQL capability standards, then any active client overlay requirements.
