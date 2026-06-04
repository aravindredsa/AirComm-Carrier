# Uncommitted Changes Audit

## Purpose
This playbook describes how to audit uncommitted DB artifact changes before committing or sharing — catching naming violations, schema drift, missing metadata, and security issues early.

---

## When to Run
- Before committing SQL scripts or DD files to version control
- Before sharing a new artifact version with the customer
- After a bulk regeneration (e.g., after addressing review comments)
- As part of a regular pre-deployment check

---

## How to Run

**Prompt**: `/audit-uncommitted-changes`

Provide:
- The list of changed/new files (or paste content of changed files)
- The module name and current version being audited

The prompt checks:
1. **Naming conventions** — Tables in `UPPER_SNAKE_CASE`, columns in `PascalCase`, SPs in `usp_<TableAlias>_<Operation>`
2. **Idempotency** — All DDL uses `IF NOT EXISTS` or `IF OBJECT_ID(...)` guards
3. **Audit columns** — `CreatedDate`, `CreatedBy`, `ModifiedDate`, `ModifiedBy`, `IsActive` on every table
4. **PK/FK integrity** — Every table has a PK; every FK has a corresponding constraint
5. **Security** — No hardcoded values in SPs, no dynamic SQL, parameters used for all input
6. **Documentation** — Every new table/column has a non-empty Business Description in the DD

---

## Reading Audit Output

Findings are labeled by severity:
- `[CRITICAL]` — Must be resolved before commit/share
- `[MAJOR]` — Should be resolved; document reason if deferring
- `[MINOR]` — Address as time allows
- `[INFO]` — Advisory note, no action required

---

## Resolving Findings

| Finding Type | Resolution Action |
|---|---|
| Naming violation | Rename using `/DB_address-review-comments` or directly in the artifact |
| Missing idempotency guard | Add `IF NOT EXISTS` block around the DDL statement |
| Missing audit columns | Add to DD and regenerate schema |
| Missing FK constraint | Add FK reference in DD and regenerate schema |
| Security violation | Replace hardcoded value with parameter; remove dynamic SQL |
| Missing Business Description | Add description to the DD before regenerating |

---

## Output

Save audit reports to:
```
reports/audits/Audit_<Module>_<YYYY-MM-DD>.md
```

Include:
- Audit date
- Files reviewed
- Finding counts by severity
- Finding detail table
- Sign-off once all CRITICAL/MAJOR items resolved
