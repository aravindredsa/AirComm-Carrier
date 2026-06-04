# Data Migration Workflow

## Purpose
This playbook describes how to plan and execute data migration scripts for the defaultClientId/defaultClientId project. It covers schema change impact analysis, generating migration scripts, and safely promoting migrations through environments.

---

## When to Use
- When an approved schema change requires migrating existing data in Dev/QA/Prod
- When a column is renamed, split, or merged
- When a new required column is added to a table with existing rows
- When a lookup table is introduced and existing rows must be mapped to lookup values

---

## Step 1: Analyze Schema Change Impact

**Prompt**: `/DB_schema-change-impact`

Before writing any migration script, run the schema change impact prompt with:
- The current schema version
- The proposed changes (column renames, new required columns, type changes, table additions/removals)

The prompt will:
- Identify all affected tables, SPs, and FK relationships
- Produce a change checklist: schema, data dictionary, ER diagram, SPs, seed scripts
- Flag migration risk level: `LOW` / `MEDIUM` / `HIGH`

Do not proceed with migration if the risk level is `HIGH` without customer/team sign-off.

---

## Step 2: Classify the Migration

| Type | Description | Risk |
|---|---|---|
| Additive | New nullable column, new table | LOW |
| Rename | Column or table rename | MEDIUM |
| Type change | Widening type (e.g., `INT → BIGINT`) | MEDIUM |
| Type change | Narrowing type (e.g., `VARCHAR(500) → VARCHAR(100)`) | HIGH |
| Removal | Column or table removed | HIGH |
| Data transform | Values must be mapped/transformed during migration | HIGH |

---

## Step 3: Generate Migration Script

**Prompt**: `/DB_post-deployment-preparation`

Request migration-specific script generation if needed. For complex migrations, provide:
- The schema change impact report
- Sample existing data (row count, value range) if available
- The target environment (Dev / QA / Prod)

Migration scripts must be:
- **Idempotent** — Safe to run multiple times without side effects
- **Reversible** — Include a rollback block or document rollback steps separately
- **Batched** — For large tables, process in batches of 1,000–10,000 rows
- **Audited** — Log migration start/end time and row counts affected

Script template structure:
```sql
-- Migration: <Module> <Change Description>
-- Version: <Schema Version>
-- Date: <YYYY-MM-DD>
-- Author: AI-generated via /DB_post-deployment-preparation

BEGIN TRANSACTION;
BEGIN TRY

  -- Pre-migration validation
  -- ...

  -- Migration logic
  -- ...

  -- Post-migration validation
  -- ...

  COMMIT TRANSACTION;
  PRINT 'Migration completed successfully.';

END TRY
BEGIN CATCH
  ROLLBACK TRANSACTION;
  THROW;
END CATCH;
```

---

## Step 4: Test in Dev First

All migration scripts must be executed in Dev before QA or Prod.

Checklist:
- [ ] Script executed without errors in Dev
- [ ] Row counts verified before and after
- [ ] SP behavior verified against migrated data
- [ ] Rollback procedure documented
- [ ] Team informed of Dev change

---

## Step 5: Promote to QA and Prod

Use `/DB_post-deployment-preparation` to generate environment-specific promotion scripts.

Each promotion must be approved by the team lead before execution.

---

## Output Files

```
artifacts/migration-scripts/
  Migration_<Module>_<Change>_V<N>_<YYYY-MM-DD>.sql
  Migration_<Module>_<Change>_V<N>_Rollback.sql
```
