---
agent: 'agent'
description: Analyze PostgreSQL JSONB source data and normalize it to 3NF, producing a normalized entity model and a mapping between the original JSON paths and the target relational columns.
---

## Skill Dependency (Mandatory)
- Apply `.github/skills/skill-db-schema-design/SKILL.md` before executing this workflow.
- Keep this prompt's normalization rules and output location as final authority when more specific.

# DB: Normalize JSON Source Data

## Purpose

Analyze raw JSONB source data and produce a normalized relational model (3NF minimum). This is the prerequisite step before generating the Data Dictionary for deeply nested or denormalized JSON sources.

## Inputs

- JSONB source data file (e.g., `SourceJSONBID.txt`)
- Module/entity scope
- Nesting depth limit (default: 4 levels)

## Analysis Steps

### Step 1: Structure Discovery
1. Parse the JSON and build a complete field inventory:
   - Path (dot notation): `bid.borrower.address.city`
   - Value type: `string`, `number`, `boolean`, `array`, `object`, `null`
   - Sample values (first 3 occurrences)
   - Nullability rate (% of records where field is null/missing)
2. Identify all arrays — each array represents a potential one-to-many relationship.
3. Identify all nested objects — candidate for a child table or flattening.

### Step 2: Entity Identification
For each array or repeated nested object:
- Propose a table name (`UPPER_SNAKE_CASE`)
- Identify the parent entity and FK relationship
- List all scalar fields as candidate columns

### Step 3: Normalization to 3NF
Apply:
- **1NF**: Every field atomic; arrays become child tables with FK to parent
- **2NF**: Remove partial functional dependencies; if a non-key attribute depends on only part of a composite key, move to a separate table
- **3NF**: Remove transitive dependencies; if a non-key attribute determines another non-key attribute, extract to a separate lookup/reference table

### Step 4: JSON Path Mapping
For each normalized column, record the source JSON path(s) it originates from.

## Output Format

### Normalized Entity List
```
Entity: BIDDER_INFO
Source JSON Path: bid (root object)
Columns:
  - BidderId     INT PK          ← generated (no JSON source)
  - FirstName    NVARCHAR(100)   ← bid.borrower.firstName
  - LastName     NVARCHAR(100)   ← bid.borrower.lastName
  - EmailAddress NVARCHAR(200)   ← bid.borrower.email
  - BidAmount    DECIMAL(18,4)   ← bid.amount
```

### Relationship Map
```
BIDDER_INFO (1) ──→ (M) BIDDER_CONTACT
BIDDER_INFO (1) ──→ (M) BIDDER_DOCUMENT
```

## Output Location

- Normalization analysis: `artifacts/data-dictionary/NormalizationAnalysis_<ModuleName>_V1.md`
- Use this output as input to `DB_generate-data-dictionary` for the final Data Dictionary generation.

## Quality Rules

- Every array in the source must produce a child table (no arrays flattened into a single column).
- No `NVARCHAR(MAX)` for structured data fields (only for free-text/notes).
- Flag any fields with > 50% null rate as `nullable=true` with a note.
- Flag any field where the value looks like a lookup code (small enumerable set) as a Lookup FK candidate.

## Prompt Usage Logging (Required)

After successful completion of this workflow, run:

```bash
node .github/initializer/tools/log-prompt-usage.js --prompt-path=.github/prompts/db-normalize-json-source.prompt.md
```
