---
agent: 'agent'
description: Generate Dev-to-QA (or QA-to-Prod) promotion deployment scripts with IF EXISTS validation for each row to ensure idempotent execution in the target environment.
---

## Skill Dependency (Mandatory)
- Apply `.github/skills/skill-db-seed-and-deployment/SKILL.md` before executing this workflow.
- Keep this prompt's deployment script structure and output location as final authority when more specific.

# DB: Post-Deployment Script Preparation

## Purpose

Generate environment-promotion deployment scripts that are safe to run multiple times. The scripts wrap every DDL and DML operation with appropriate existence guards so they can be executed in Dev → QA → Prod without errors even if a previous partial run occurred.

## Inputs

- Schema script to promote: `artifacts/schemas/Schema_<ModuleName>_<Version>.sql`
- Seed scripts to promote: `artifacts/seed-scripts/Seed_<ModuleName>_<Version>.sql`
- SP deployment scripts: `artifacts/stored-procedures/Deploy_SPs_<ModuleName>_<Version>.sql`
- Source environment: `Dev` / `QA`
- Target environment: `QA` / `Prod`

## Idempotency Patterns

### Table Creation
```sql
IF NOT EXISTS (SELECT 1 FROM sys.tables t
  JOIN sys.schemas s ON t.schema_id = s.schema_id
  WHERE s.name = 'BID' AND t.name = 'BIDDER_INFO')
BEGIN
  CREATE TABLE [BID].[BIDDER_INFO] (...)
END
GO
```

### Column Addition
```sql
IF NOT EXISTS (SELECT 1 FROM sys.columns c
  JOIN sys.tables t ON c.object_id = t.object_id
  JOIN sys.schemas s ON t.schema_id = s.schema_id
  WHERE s.name = 'BID' AND t.name = 'BIDDER_INFO' AND c.name = 'NewColumn')
BEGIN
  ALTER TABLE [BID].[BIDDER_INFO] ADD [NewColumn] NVARCHAR(200) NULL;
END
GO
```

### Index Creation
```sql
IF NOT EXISTS (SELECT 1 FROM sys.indexes WHERE name = 'IX_BIDDER_INFO_BidderId' AND object_id = OBJECT_ID('[BID].[BIDDER_INFO]'))
BEGIN
  CREATE NONCLUSTERED INDEX [IX_BIDDER_INFO_BidderId] ON [BID].[BIDDER_INFO]([BidderId]);
END
GO
```

### Stored Procedure
Use `CREATE OR ALTER PROCEDURE` — inherently idempotent.

### Seed Data
Use `IF NOT EXISTS (SELECT 1 FROM ... WHERE [Code] = 'VALUE')` per row — as defined in `DB_generate-lookup-seed-scripts`.

### FK Constraint Addition
```sql
IF NOT EXISTS (SELECT 1 FROM sys.foreign_keys WHERE name = 'FK_BIDDER_INFO_AUCTION_AuctionId')
BEGIN
  ALTER TABLE [BID].[BIDDER_INFO]
    ADD CONSTRAINT [FK_BIDDER_INFO_AUCTION_AuctionId]
    FOREIGN KEY ([AuctionId]) REFERENCES [AUCTION].[AUCTION_EVENT]([AuctionId]);
END
GO
```

## Deployment Script Structure

1. Script header: source/target environments, module, version, date
2. Pre-deployment checks: verify the target database and schema exist
3. Schema creation (if not exists)
4. Tables — in topological order (parents before children)
5. FK constraints — after all tables
6. Indexes
7. SPs (using `CREATE OR ALTER`)
8. Seed data — Lookup tables first, then dependent tables
9. Post-deployment validation query: `SELECT COUNT(*) FROM [Schema].[TABLE]` for each table
10. Script footer: success marker

## Output Location

- `artifacts/migration-scripts/Deploy_<ModuleName>_<SourceEnv>_to_<TargetEnv>_<Version>_<Date>.sql`

## Quality Rules

- Every DDL statement must use an `IF NOT EXISTS` / `IF EXISTS` guard.
- No `DROP TABLE` or `TRUNCATE TABLE` in promotion scripts.
- Every `INSERT` must use a named column list.
- Script must be executable as a single batch (no interactive prompts).
- Final section must contain a `PRINT 'Deployment complete: <module> <version>'` statement.

## Prompt Usage Logging (Required)

After successful completion of this workflow, run:

```bash
node .github/initializer/tools/log-prompt-usage.js --prompt-path=.github/prompts/db-post-deployment-preparation.prompt.md
```
