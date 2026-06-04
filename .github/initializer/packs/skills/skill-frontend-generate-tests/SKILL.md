---
name: skill-generate-tests
description: Shared methodology for generating resolver-selected UI test stack unit and component tests with setup checks, coverage analysis, and gap-driven test creation.
---

# Skill: Generate Tests

## Purpose
Provide a reusable test-generation method for resolver-selected UI test stack workflows so prompts can focus on scope and output details.

## Inputs
- Project source files under `src/`
- Existing test files
- resolver-selected test configuration files
- Prompt-specific scope and output expectations

## Method
1. Discover target source/test files for the requested scope.
2. Verify or set up resolver-selected test framework and UI testing utilities prerequisites.
3. Run tests with coverage and capture structured coverage output.
4. Identify gaps by uncovered files, branches, and critical behavior paths.
5. Generate or update tests to close meaningful gaps.
6. Re-run tests and coverage to validate pass state and impact.

## Coverage and Quality Rules
- Prioritize behavioral assertions over fragile snapshots.
- Cover positive, negative, and edge paths for business-critical logic.
- Keep test data deterministic and avoid hidden global state.
- Use existing workspace testing patterns before introducing new conventions.

## Constraints
- Do not reduce existing test coverage or remove meaningful tests without reason.
- Do not change production behavior while creating tests.
- Preserve prompt-defined output format, thresholds, and artifact requirements when provided.

## Output Rules
- Add tests in expected project locations and naming patterns.
- Report what was added and what remains as risk or deferred coverage.
- Keep the prompt contract as final authority when prompt rules are more specific.
