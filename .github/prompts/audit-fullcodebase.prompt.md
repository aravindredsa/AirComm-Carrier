---
agent: 'agent'
description: Consolidated full-codebase audit prompt for frontend, backend, QA automation, and DB repositories.
---

## Skill Dependency (Mandatory)
- Apply `.github/skills/skill-codebase-audit/SKILL.md` before executing this workflow.
- Keep this prompt's scope, stack routing, and required output format as final authority when more specific.

# Audit Full Codebase

## Purpose
Run a full-repository audit using one shared workflow while preserving stack-specific checks, standards, and reporting requirements.

## Standards Resolution (Mandatory)
Load the standards model from:
- `config/standards-resolution-policy.json`
- `config/client-profiles.json`
- `config/standards-catalog.json`

Determine the client profile and applicable capabilities before scoring.

Optional override: user may explicitly provide `client=<client-id>` to force client routing.

If multiple capability areas exist, prefer the primary business scope and note cross-capability risk.

## Template Mapping (Mandatory)
Use the resolved standards catalog and client profile to determine the audit template and output structure.

If a capability group maps to `null`, use this prompt's output requirements and capability-specific gates/checks.

If the mapped template is missing, keep the output sections aligned to the closest existing audit template and call out the fallback in the report.

## Scope
- Scan the full repository (not only git diff).
- Produce a discovery inventory before scoring.
- Score each required dimension from 0 to 10 in 0.5 increments.

## Standards Baseline
Resolve standards through `config/standards-resolution-policy.json`, `config/client-profiles.json`, and `config/standards-catalog.json`, then apply shared standards first followed by the resolved domain, capability, and client overlay standards.

If a standards document conflicts with this prompt rubric, this prompt takes precedence.

## Stack-Specific Discovery Checklist

### UI / Frontend Capability
- Catalog pages, components, hooks, stores, services, types, tests, config.
- Validate state management split according to resolver-selected capability standards.
- Validate accessibility and performance concerns for UI components in the resolved framework.

### Backend / API Capability
- Catalog controllers, services, repositories, entities/DTOs, migrations, tests, config.
- Validate auth/authorization, input validation, architecture layering, API conventions.
- Validate data integrity and transaction handling.

### QA / Automation Capability
- Catalog test sources, page objects, framework utilities, runners, config.
- Validate locator stability, synchronization strategy, POM compliance, flakiness risks.
- Classify findings by severity (Critical/High/Warning/Low/Info).

### DB / SQL Capability
- Catalog schema scripts, stored procedures, migrations, seed scripts, DD artifacts.
- Validate naming conventions, PK/FK constraints, audit columns, SP quality, DD consistency.

## Output Requirements
- Include: discovery inventory, dimension-by-dimension scores, evidence-backed findings, prioritized recommendations.
- Use heading-per-dimension detail sections.
- Include an executive summary first.

## Output Location
Save to:
- `reports/audits/full-codebase/AuditReport_<client>_<YYYY-MM-DD>.md`

For QA stack, `QAAuditReport_<YYYY-MM-DD>.md` is also acceptable if required by downstream consumers.

After saving, output only:
```md
Saved to: reports/audits/full-codebase/<filename>.md
```

## Prompt Usage Logging (Required)

After successful completion of this workflow, run:

```bash
node .github/initializer/tools/log-prompt-usage.js --prompt-path=.github/prompts/audit-fullcodebase.prompt.md
```
