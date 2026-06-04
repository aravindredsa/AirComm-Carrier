
# Run Uncommitted Changes Audit

## Purpose
Guide users through generating an audit report for local uncommitted changes.

## Recommended Workflow
1. Run `/audit-uncommitted-changes`.
2. Limit scope to `git diff HEAD`, `git diff --name-only HEAD`, and untracked files from `git status`.
3. Use `templates/audit-uncommitted-changes-report-template.md` for the final report structure.
4. Save final output in `reports/audits/uncommitted-changes/`.

## Output
Store final report in `reports/audits/uncommitted-changes/`
