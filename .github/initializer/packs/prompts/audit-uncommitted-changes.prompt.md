---
agent: 'agent'
description: Consolidated uncommitted-changes audit prompt for frontend, backend, QA automation, and DB repositories.
---

## Skill Dependency (Mandatory)
- Apply `.github/skills/skill-codebase-audit/SKILL.md` before executing this workflow.
- Keep this prompt's scope, stack routing, and required output format as final authority when more specific.

# Audit Uncommitted Changes

## Scope (Mandatory)
Audit only local uncommitted changes:
1. Run `git diff HEAD`
2. Run `git diff --name-only HEAD`
3. Run `git status`
4. Include staged, unstaged, and relevant untracked files in scope
5. If no changes exist, stop and return:
   `No uncommitted changes detected. Please make changes before running the audit.`

## Standards Resolution (Mandatory)
Load the standards model from:
- `config/standards-resolution-policy.json`
- `config/client-profiles.json`
- `config/standards-catalog.json`

Determine the client profile and applicable capabilities from the changed files.

Optional override: user may explicitly provide `client=<client-id>` to force client routing.

If mixed capability changes exist, prefer the primary business scope and call out cross-capability risks.

## Template Mapping (Mandatory)
Use the resolved standards catalog and client profile to determine the audit template and output structure.

If a capability group maps to `null`, use this prompt's output requirements and capability-specific gates/checks.

If the mapped template is missing, keep the output sections aligned to the closest existing audit template and call out the fallback in the report.

## Standards Baseline
Resolve standards through `config/standards-resolution-policy.json`, `config/client-profiles.json`, and `config/standards-catalog.json`, then apply shared standards first followed by the resolved domain, capability, and client overlay standards.

## Evaluation Requirements
- Score dimensions from 0 to 10 in 0.5 increments.
- Use only evidence from changed files and diff.
- Provide actionable remediation in priority order.
- Distinguish findings from recommendations.

### QA Stack Additional Gate
For `qa` stack, include commit verdict:
- `APPROVED`
- `APPROVED WITH NOTES`
- `BLOCKED`

If `BLOCKED`, include explicit must-fix actions and targeted code-level guidance.

### DB Stack Additional Checks
For `db` stack, explicitly check:
- naming conventions
- schema quality (PK/FK/audit columns)
- DD consistency
- stored procedure quality

## Output Location
Save to:
- `reports/audits/uncommitted-changes/AuditReport_<client>_<YYYY-MM-DD>.md`

For QA stack, `QAAuditReport_<YYYY-MM-DD>.md` is also acceptable if required by downstream consumers.

After saving, output only:
```md
Saved to: reports/audits/uncommitted-changes/<filename>.md
```

## Prompt Usage Logging (Required)

After successful completion of this workflow, run:

```bash
node .github/initializer/tools/log-prompt-usage.js --prompt-path=.github/prompts/audit-uncommitted-changes.prompt.md
```
