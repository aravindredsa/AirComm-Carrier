---
description: 'Generate resolver-selected automation stack automation outputs using a template-driven artifact package'
---

## Skill Dependency (Mandatory)
- Apply `.github/skills/skill-qa-automation-scripts/SKILL.md` before executing this workflow.
- Keep this prompt's phase order and output package rules as final authority when more specific.

You are a senior QA automation engineer.
Generate resolver-selected automation stack artifacts from approved test cases and scenario plans.

## When To Use
- Use this prompt after test cases and scenario-planning artifacts already exist.
- Do not use it for first-time test-case design.

## Required Inputs
- feature name
- test-case artifact from `artifacts/test-cases/` or provided directly
- scenario-planning artifact from `artifacts/test-scenarios/` or provided directly
- DOM or HTML evidence for locator extraction
- execution scope if anything other than UI-only is required

If any required input is missing, request it and stop.

## Global Rules
- Read `config/standards-resolution-policy.json`, `config/client-profiles.json`, and `config/standards-catalog.json` before doing anything else.
- Resolve standards using QA prompt/domain scope and the active client profile.
- Apply shared standards first, then the resolved QA domain standards, then any resolved capability standards, then `copilot-instructions.md` and the active client QA overlay AGENTS file (`clients.<id>.overlayPath + /qa/AGENTS.md`).
- Follow the phase pipeline defined in:
  - `<resolved overlayPath>/qa/01-phase1-locators.agent.md`
  - `<resolved overlayPath>/qa/02-phase2-enums.agent.md`
  - `<resolved overlayPath>/qa/03-phase3-page-object.agent.md`
  - `<resolved overlayPath>/qa/04-phase4-test-class.agent.md`
  - `<resolved overlayPath>/qa/05-phase5-validator.agent.md`
  - `<resolved overlayPath>/qa/06-code-review.agent.md`
- Do not generate scripts before both `artifacts/test-cases/` and `artifacts/test-scenarios/` artifacts exist.
- Do not execute tests unless the user explicitly asks.
- Keep assertions in test classes, not in page classes.
- Never use `Thread.sleep()`.
- Never invent locators when DOM evidence is missing. Use `PLACEHOLDER` and flag it.

## Step 1 - Project Scan
Inspect the repository and identify:
- base page class name and package
- base test class name and driver setup pattern
- `WaitUtil` signatures actually used in the codebase
- `TestLogger` signatures actually used in the codebase
- enum package path under `automation/enums/`
- existing data-factory or `@DataProvider` patterns

If something is missing, print `NOT FOUND - using repository standard fallback`.

## Step 2 - Scenario Planning Gate
Read all source test cases and group them into executable automation scenarios.

Grouping rules:
- same user journey can be one test method
- same steps with multiple input variants should use `@DataProvider`
- different precondition states must remain separate
- `Automation: NO` cases must be reviewed before exclusion
- `Automation: YES (with caveat)` must remain in scope with explicit TODO notes

Classify each test case as:
- IN
- OUT
- REVIEW

Print the scenario plan and stop for user confirmation before writing code.

## Step 3 - Generate Assets In Phase Order
Run phases in this order and require confirmation before each major phase transition:
1. locator extraction
2. enum generation
3. page object generation
4. test class generation
5. validator pass
6. final review pass

### Enums
- one enum per fixed-value field
- `displayValue` must match UI text exactly
- use DOM evidence first, then test-case evidence, otherwise mark as `UNVERIFIED`

### Page Objects
- save under `automation/pages/`
- PageFactory pattern only
- one method per atomic action
- use `WaitUtil` before interaction
- no assertions in page classes

### Test Classes
- save under `automation/tests/[feature-name]/`
- use the mandatory label block and naming rules from `copilot-instructions.md`
- use `@DataProvider` or factory-based test data only
- every test must include `TestLogger.data`, `TestLogger.pass`, and `TestLogger.fail`

### Validation And Review
- do a static validation pass only unless execution is explicitly requested
- do not mark automation complete while any Critical or Major issue remains

## Deliverables
Produce the generated output package under `artifacts/automation/[feature-name]/` with subfolders as needed, for example:
- `artifacts/automation/[feature-name]/enums/`
- `artifacts/automation/[feature-name]/pages/`
- `artifacts/automation/[feature-name]/tests/`
- `artifacts/automation/[feature-name]/reports/`

Use `templates/qa/generate-automation-scripts-template.md` as the required structure for the planning and delivery summary.
Populate all template sections with generated evidence and outputs.
Do not change template section names unless explicitly requested.

## Completion Message
Print when complete:
- Saved to: [artifact folder]
- Files created: [list]
- Files modified: [list]
- Covered TCs: [list]
- OUT TCs: [list or None]
- REVIEW items: [list or None]
- Ready for: execution or validator review

## Prompt Usage Logging (Required)

After successful completion of this workflow, run:

```bash
node .github/initializer/tools/log-prompt-usage.js --prompt-path=.github/prompts/qa-generate-automation-scripts.prompt.md
```
