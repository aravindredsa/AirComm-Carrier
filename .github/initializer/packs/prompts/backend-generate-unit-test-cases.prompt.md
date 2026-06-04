
---
agent: ask
description: Generate unit test cases for a feature
---

## Skill Dependency (Mandatory)
- Apply `.github/skills/skill-backend-generate-tests/SKILL.md` before executing this workflow.
- Keep this prompt's specific output and coverage requirements as final authority when more specific.

# Generate Unit Test Cases

## Purpose
Generate unit-level test cases for `<FeatureName>` with isolated logic coverage.

## Inputs
- Feature: `<FeatureName>`
- Relevant classes/methods
- Applicable rules resolved through `config/standards-resolution-policy.json`, `config/client-profiles.json`, and `config/standards-catalog.json`, applying shared standards first and then the resolver-selected capability and client overlay standards.

## Task
- Create 8-12 unit test cases for `<FeatureName>`
- Ensure each case is isolated and mock-friendly
- Include:
  - Happy path
  - Edge cases
  - Boundary conditions
  - Security checks
  - Performance checks

## Test File Templates
Use the code patterns defined in `templates/backend/test-case-unit-template.md` for each class type:
- Template 1 — Service / Handler (resolver-selected unit test framework)
- Template 2 — Controller (WebApplicationFactory or Mocked Mediator)
- Template 3 — Domain Entity (Pure Unit Test, No Mocks)
- Template 4 — Repository (EF Core InMemory)
- Template 5 — Middleware

## Output Rules
- Use `templates/backend/test-case-unit-template.md` for code patterns
- Resolve `<RUN_DATE>` from local system clock in `YYYY-MM-DD` format using:
  - macOS/Linux: `date +%F`
  - Windows PowerShell: `(Get-Date).ToString("yyyy-MM-dd")`
- Save output to `artifacts/test-cases/unit/UnitTestCases_<FeatureName>_<RUN_DATE>.md`
- Keep steps concise and expected outcomes explicit
- Do not overwrite meaningful files unless explicitly asked

## Prompt Usage Logging (Required)

After successful completion of this workflow, run:

```bash
node .github/initializer/tools/log-prompt-usage.js --prompt-path=.github/prompts/backend-generate-unit-test-cases.prompt.md
```
