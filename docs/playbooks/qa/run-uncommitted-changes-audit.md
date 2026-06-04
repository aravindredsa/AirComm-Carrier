# Run Uncommitted Changes Audit

## Purpose
Guide users through generating a QA audit report for local staged or uncommitted changes.

## Recommended Workflow
1. Run `/audit-uncommitted-changes`.
2. Limit scope to submitted diff and changed files only.
3. Use `templates/audit-uncommitted-changes-report-template.md` for report structure.
4. Save final output in `reports/audits/uncommitted-changes/`.

## Output
- One report file named `QAAuditReport_<YYYY-MM-DD>.md` in `reports/audits/uncommitted-changes/`.
