# Generate User Stories

## Purpose
Guide users through generating cross-stack user stories that are implementation-ready and traceable.

## Inputs
- approved requirements and analysis artifacts
- applicable stack context (frontend, backend, QA)
- standards resolved through `config/standards-resolution-policy.json`, `config/client-profiles.json`, and `config/standards-catalog.json`, applying shared standards first and then the resolved BA domain, capability, and client overlay standards

## Recommended Workflow
1. Confirm story scope, personas, and acceptance intent.
2. Run `/ba-generate-user-stories` for broad story generation.
3. Route refinement through stack-specific prompts for deeper detail.
4. Validate story completeness, acceptance coverage, and dependency clarity.
5. Save final artifacts to `artifacts/user-stories/`.

## Output
- user-story package in markdown and docx under `artifacts/user-stories/`

## Notes
- Use this playbook as the umbrella workflow before stack-specific refinement.
