---
name: skill-ba-reverse-engineer-application
description: Execute reverse-engineering analysis of legacy modules to extract behavior, rules, and risks as pure analysis (not design).
---

# Skill: BA Reverse Engineer Application

## Purpose
Define how the agent executes reverse-engineering analysis consistently while honoring the prompt-template split:
- prompt = analysis intent, constraints, and mandatory coverage rules
- template = final document organization

## Inputs
- source files for the selected scope
- folder and dependency context
- standards resolved through `config/standards-resolution-policy.json`, `config/client-profiles.json`, and `config/standards-catalog.json`, applying shared standards first and then the resolved BA domain, capability, and client overlay standards
- prompt contract in `.github/prompts/ba-reverse-engineer-application.prompt.md`
- template in `templates/ba/reverse-engineering-design-template.md`

## Method
1. Build scope inventory (code, config, data access, integrations, scheduled jobs).
2. Extract behavior as-is, including intentional and accidental behavior.
3. Catalog business rules with confidence level and source location.
4. Map data flow and process flow with happy path and alternates.
5. Identify risk areas: security, performance, resilience, and technical debt.
6. Capture unknowns and blockers for planning, development, and testing.
7. Apply all mandatory requirements defined in `.github/prompts/ba-reverse-engineer-application.prompt.md`.
8. Produce the final markdown using `templates/ba/reverse-engineering-design-template.md` section order and headings.

## Constraints
- Analysis only; do not propose target-state design.
- Prefer generic labels when domain naming is uncertain.
- Explicitly call out contradictions, missing rules, and hidden dependencies.
- Do not redefine the template structure inside this skill.

## Output Rules
- Store output in `artifacts/reverse-engineer-analysis/`.
- Do not overwrite meaningful existing files unless explicitly asked.
- Keep findings scan-friendly with headings, bullets, and concise tables.
- Keep template wording and section labels intact unless the user explicitly requests changes.
