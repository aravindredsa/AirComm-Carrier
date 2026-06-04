---
agent: 'agent'
description: 'Build a frontend feature from an implementation plan using existing project patterns and reuse-first decisions'
---

## Skill Dependency (Mandatory)
- Apply `.github/skills/skill-feature-implementation/SKILL.md` before executing this workflow.
- Keep this prompt's implementation constraints and output rules as final authority when more specific.

Build this frontend feature from an approved implementation plan.

Context:
- Tech stack: resolver-selected framework and language capabilities from standards catalog
- Follow the existing project structure, coding style, naming conventions, and reusable patterns already used in this codebase
- Reuse existing shared components, hooks, services, utilities, types, constants, and styles wherever possible
- Do not introduce a new pattern if an existing project pattern already solves it
- Keep the implementation production-ready, modular, clean, and maintainable

Inputs:
1. Plan file path:
${input:planFilePath:Enter the markdown plan path, for example artifacts/feature-plans/FeatureImplementationPlan_feature-name_YYYY-MM-DD.md}

2. Additional implementation constraints:
${input:implementationConstraints:Enter optional additional constraints if needed}

Instructions:
1. Read the implementation plan from the provided `planFilePath` before making changes
2. If the plan file is missing, unreadable, or incomplete, stop and ask for a valid plan instead of guessing
3. Inspect the codebase for the reuse candidates and target files identified in the plan before writing code
4. Follow the approved plan unless codebase discovery reveals a safer or more accurate implementation path
5. If the feature requires any shared utility or building block such as a calendar, date helper, formatter, mapper, hook, table helper, or form helper, search the repository first for an existing option
6. Reuse an existing utility or shared building block when it is suitable
7. Create a new utility only when no suitable existing option exists, and explain that decision in the final output

Implementation requirements:
- Keep code properly modularized
- Split large UI into smaller reusable components where appropriate
- Extract reusable logic into hooks, helpers, utilities, mappers, or constants where appropriate
- Keep business logic out of JSX as much as possible
- Avoid large monolithic components
- Prefer composition over duplication
- Refactor repeated logic instead of copying and pasting
- Use clear separation of concerns:
  - presentation/UI
  - state management
  - business logic
  - API/service calls
  - transformation/mapping logic
- If an existing file is already too large, refactor safely while implementing the new feature
- Keep naming semantic and consistent with the project
- Keep prop interfaces and types clean and minimal
- Remove unnecessary duplication introduced during implementation
- Do not leave placeholder TODO logic or pseudo-code unless something is genuinely missing from the codebase

UI hardening requirements:
- Core rule: use existing shared/common UI components already used across the repository instead of creating new ones
- Reuse shared components for all UI elements, including dropdowns, text inputs, buttons, checkboxes/radio buttons, modals/dialogs, and tables/lists
- Do not create new UI components if an equivalent already exists
- Do not use raw library components (for example Material UI, Ant Design, or similar) directly in feature code
- Do not introduce custom styling that deviates from existing shared component patterns
- Use a UI library directly only when shared/common components in this repository are built on top of that same library
- Before implementing or updating any UI screen/section, search the codebase for similar UI elements and identify the shared/common component already used
- Reuse the same shared/common component with consistent props, structure, styling, and behavior
- Goal: enforce full UI consistency across the application by following existing shared component patterns and avoiding one-off implementations

Behavior requirements:
- Implement all behavior required by the approved plan
- Add validation where implied by the plan and source story requirements
- Add loading, error, empty, disabled, and success states where relevant
- Preserve existing behavior and avoid breaking current flows

Testing requirements:
- Add or update unit tests for main rendering and interaction paths
- Cover important states and expected user actions
- Reuse existing testing patterns in the project

Output format:
1. Plan file used
2. Existing reuse candidates validated and used
3. Files created or updated
4. Code changes
5. Final summary including:
   - what was implemented
   - what was reused
   - any new utility created and why reuse was not sufficient
   - assumptions made
   - any follow-up needed

Important:
- Do not skip the repository reuse check before creating new shared utilities or abstractions
- Prefer reusing existing project patterns over creating parallel implementations
- Keep the final result maintainable and aligned to the approved plan

## Prompt Usage Logging (Required)

After successful completion of this workflow, run:

```bash
node .github/initializer/tools/log-prompt-usage.js --prompt-path=.github/prompts/frontend-build-feature-from-plan.prompt.md
```
