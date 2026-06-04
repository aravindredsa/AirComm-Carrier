---
agent: 'agent'
description: 'Build a frontend feature from a user story and Figma screenshot using existing project patterns'
---

## Skill Dependency (Mandatory)
- Apply `.github/skills/skill-feature-implementation/SKILL.md` before executing this workflow.
- Keep this prompt's implementation constraints and output rules as final authority when more specific.
 
Build this frontend feature based on the provided user story, acceptance criteria, and attached Figma screenshot.
 
Context:
- Tech stack: resolver-selected framework and language capabilities from standards catalog
- Follow the existing project structure, coding style, naming conventions, and reusable patterns already used in this codebase
- Reuse existing shared components, hooks, services, utilities, types, constants, and styles wherever possible
- Do not introduce a new pattern if an existing project pattern already solves it
- Keep the implementation production-ready, modular, clean, and maintainable
 
Inputs:
1. User story:
${input:userStory:Paste the user story}
 
2. Acceptance criteria:
${input:acceptanceCriteria:Paste acceptance criteria}
 
3. Target feature or area:
${input:targetArea:Enter target folder, module, page, or component area}
 
4. Target component name:
${input:componentName:Enter component name if known}
 
Design reference:
- Use the attached Figma screenshot as the visual reference
- Match layout, spacing, section order, labels, states, and interaction intent as closely as possible
- Use existing design system/components/tokens in the project instead of hardcoding custom styling unless necessary
 
Instructions:
1. First inspect the codebase for similar screens, dialogs, forms, cards, tables, sections, and interaction patterns before writing code
2. Identify the best existing location for this feature
3. Reuse existing patterns and shared building blocks whenever possible
4. Before implementation, create a short plan that includes:
   - main UI sections
   - state requirements
   - validations
   - interactions
   - API/service integration points
   - files to create or update
 
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
- Implement all behavior required by the story and acceptance criteria
- Add validation where implied
- Add loading, error, empty, disabled, and success states where relevant
- Preserve existing behavior and avoid breaking current flows
 
Testing requirements:
- Add or update unit tests for main rendering and interaction paths
- Cover important states and expected user actions
- Reuse existing testing patterns in the project
 
Output format:
1. Brief implementation plan
2. Similar existing files or patterns found in the codebase
3. Files to create or update
4. Code changes
5. Final summary including:
   - what was implemented
   - what was refactored or modularized
   - assumptions made
   - any follow-up needed
 
Important:
- Do not jump straight into a single large component
- Refactor when needed so the final result is maintainable
- Prefer clean modular code over quick inline implementation

## Prompt Usage Logging (Required)

After successful completion of this workflow, run:

```bash
node .github/initializer/tools/log-prompt-usage.js --prompt-path=.github/prompts/frontend-build-feature-from-story-and-figma.prompt.md
```
