# Schema Design Workflow

## Purpose
This playbook describes the end-to-end process for designing and approving a DB schema module for the defaultClientId/defaultClientId project. It covers the full lifecycle from source data analysis to approved schema deployment.

---

## Workflow Overview

```
JSONB Source Data
      ↓
[Step 0] Normalize JSON Source   ← /DB_normalize-json-source
      ↓
[Step 1] Generate Data Dictionary ← /DB_generate-data-dictionary
      ↓
[Step 2] Generate Schema Script  ← /DB_generate-schema-script
      ↓
[Step 3] Generate ER Diagram     ← /DB_generate-er-diagram
      ↓
[Step 4] Share with Customer
      ↓
[Step 5] Customer Reviews DD (IV Comment column)
      ↓
[Step 6] Address Review Comments ← /DB_address-review-comments
      ↓
     ↙ APPROVED      ↘ MORE COMMENTS
[Step 7] Deploy        → Back to Step 4
```

---

## Step 0: Normalize JSON Source (if applicable)

**When to run**: When the source data is raw JSONB (not an existing schema).  
**Prompt**: `/DB_normalize-json-source`  
**Input**: JSONB source file (e.g., `SourceJSONBID.txt`)  
**Output**: `artifacts/data-dictionary/NormalizationAnalysis_<Module>_V1.md`

Verify:
- All arrays are identified as child table candidates
- All repeating groups extracted
- All lookup candidates flagged

---

## Step 1: Generate Data Dictionary

**Prompt**: `/DB_generate-data-dictionary`  
**Input**: JSONB source or normalization analysis from Step 0  
**Output**: `artifacts/data-dictionary/DataDictionary_<Module>_V1.md` + `.csv`

Verify before sending to customer:
- Every column has a non-trivial Business Description
- Every FK has a value in FK References
- Audit columns present on every table
- IV Comment column present but blank

---

## Step 2: Generate Schema Script

**Prompt**: `/DB_generate-schema-script`  
**Input**: Data Dictionary from Step 1  
**Output**: `artifacts/schemas/Schema_<Module>_V1.sql`

Verify:
- All tables from DD are present
- PK constraints declared on every table
- FK constraints declared for every FK column
- Audit columns present on every table
- Script is idempotent (`IF NOT EXISTS` guards)

---

## Step 3: Generate ER Diagram

**Prompt**: `/DB_generate-er-diagram`  
**Input**: Data Dictionary from Step 1  
**Output**: `artifacts/er-diagrams/ER_<Module>_V1.drawio`

Verify:
- Every table has an entity in the diagram
- Every FK has a crow's foot relationship line
- Lookup tables visually grouped

---

## Step 4: Share with Customer

Send the customer a package containing:
1. `DataDictionary_<Module>_V1.csv` (preferred for customer editing)
2. `Schema_<Module>_V1.sql`
3. `ER_<Module>_V1.drawio`

**Customer instruction**: Add review comments directly in the `IV Comment` column of the spreadsheet. Do not modify column names or structure — only fill in the `IV Comment` column.

---

## Step 5: Customer Review

Customer reviews the Data Dictionary and adds:
- Rename requests (e.g., `PreQualifiedAmtPercent → PreQualifiedPercent`)
- Type clarification requests (e.g., `Define the type`)
- New column/table requests
- `no changes required after discussion` for accepted items

**Do not manually apply these changes** — use Step 6 to process them consistently.

---

## Step 6: Address Review Comments

**Prompt**: `/DB_address-review-comments`  
**Input**: Reviewed Data Dictionary with `IV Comment` filled  
**Output**: All three artifacts at V(N+1)

Rules:
- Never delete DD rows — removed columns get `[REMOVED]` prefix
- Always increment version
- Run gap analysis after regenerating to confirm consistency

---

## Step 7: Deploy to Dev

Once the customer approves:
1. Run `/DB_post-deployment-preparation` to generate an idempotent deployment script
2. Execute the script against the Azure SQL Dev environment
3. Inform the team that Dev DB is updated
4. Run `/DB_generate-lookup-seed-scripts` if lookup seed data is not yet deployed
