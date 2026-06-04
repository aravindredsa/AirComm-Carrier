# Reverse Engineer Application

## Purpose
Guide users through producing a neutral, evidence-backed reverse-engineering analysis for legacy modules before redesign or implementation planning.

## Use This Playbook When
- documenting current-state behavior before modernization
- onboarding teams to unfamiliar legacy modules
- identifying hidden risks, contradictions, and undocumented rules

## Inputs
- selected module or feature scope
- source code, configuration, and related workflow artifacts
- standards resolved through `config/standards-resolution-policy.json`, `config/client-profiles.json`, and `config/standards-catalog.json`, applying shared standards first and then the resolved BA domain, capability, and client overlay standards
- template `templates/ba/reverse-engineering-design-template.md`

## Recommended Workflow
1. Define a focused module scope and confirm included sources.
2. Run `/ba-reverse-engineer-application`.
3. Verify the output stays analytical (current-state) and avoids future-state design.
4. Validate coverage of behavior categories: intentional, accidental, inconsistent, undocumented, risky, and fragile.
5. Save approved output to `artifacts/reverse-engineer-analysis/`.

## Output
- `artifacts/reverse-engineer-analysis/DesignDoc_<Scope>_<YYYY-MM-DD>.md`
- `artifacts/reverse-engineer-analysis/DesignDoc_<Scope>_<YYYY-MM-DD>.docx`

## Notes
- Use abstract, reusable terminology rather than module-specific labels.
- Treat this file as a human operating guide; execution logic remains in prompt and skill files.