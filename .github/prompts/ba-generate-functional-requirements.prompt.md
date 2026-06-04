---
agent: 'agent'
description: 'Create complete functional requirements using the workspace template and supporting artifacts'
---

## Skill Dependency (Mandatory)
- Apply `.github/skills/skill-ba-analysis/SKILL.md` before executing this workflow.
- Keep this prompt's template, output path, and filename/date rules as final authority when more specific.

# Generate Functional Requirements

## Purpose
Create a complete Functional Requirements Document (FRD) using the workspace template and provided evidence.

## Template
Use this template:
- /templates/ba/functional-reqs-doc-template.md

## Required Inputs
- Attached source document(s)
- Latest modernization UI snapshots

## Task
1. Create the FRD using the specified template structure.
2. Fill all sections completely using only validated source inputs.
3. Verify the document is complete across all sections and section-level details.

## Additional Required Output Rules
- No placeholders (for example: TBD, insert here)
- No omissions
- No invented rules not present in the source documents
- Entire output must be complete and ready for Dev, QA, and Product consumption
- Output must be formatted as both .docx and .md and stored in /artifacts/functional-requirements
- Use date stamp naming in the same format as the full-codebase audit prompt: `<YYYY-MM-DD>`
- Filename format must be: `FunctionalRequirements_<YYYY-MM-DD>.md` and `FunctionalRequirements_<YYYY-MM-DD>.docx`
- Resolve `<YYYY-MM-DD>` from the current local run date at execution time (not from examples, memory, or prior runs)
- Optional command guidance: on macOS/Linux use `date +%F`; on Windows PowerShell use `Get-Date -Format yyyy-MM-dd`
- Use one resolved `RUN_DATE` value consistently for filename and report date fields
- Do not hardcode year/month/day values
- Before finalizing, validate output filename date equals the current local date
- If the filename date is incorrect, correct it immediately (rename/regenerate) before completing
- Avoid jargon
- Avoid referencing tables or stored procedures in the narrative
- Ensure all technical details are clearly explained for a non-technical audience
- Remove redundant information and keep the document concise while still comprehensive
- Remove all details regarding approval process and stakeholders

## Guardrails
- Resolve active standards through `config/standards-resolution-policy.json`, `config/client-profiles.json`, and `config/standards-catalog.json`, then apply shared standards first followed by the resolved BA domain, capability, and client overlay standards.
- Do not overwrite meaningful files unless explicitly asked

## Prompt Usage Logging (Required)

After successful completion of this workflow, run:

```bash
node .github/initializer/tools/log-prompt-usage.js --prompt-path=.github/prompts/ba-generate-functional-requirements.prompt.md
```
