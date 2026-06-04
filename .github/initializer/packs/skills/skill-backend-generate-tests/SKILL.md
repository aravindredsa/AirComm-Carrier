---
name: skill-generate-tests
description: Shared methodology for generating resolver-selected service testing stack unit tests with setup checks, coverage analysis, and gap-driven test creation.
---

# Skill: Generate Tests

## Purpose
Provide a reusable test-generation method for resolver-selected backend testing stack workflows so prompts can focus on scope and output details.

## Inputs
- Source files for the selected feature or module
- Existing test files matching the target feature
- Project test configuration (test project `.csproj`, resolver-selected unit test framework settings)
- Prompt-specific scope and output expectations

## Method
1. Identify target source files and their responsibilities (service, controller, repository, domain entity).
2. Verify test project setup: resolver-selected test dependencies installed and referenced.
3. Analyze existing tests to identify coverage gaps across all layers.
4. Identify untested paths: happy path, edge cases, error states, boundary values, and security flows.
5. Generate test cases using the appropriate template per class type.
6. Validate test isolation: mock all external dependencies, no cross-test or database state leakage.

## Coverage and Quality Rules
- Prefer behavioral assertions with selected assertion library over raw framework assertions.
- Cover happy path, edge cases, boundary values, and error/exception paths.
- Mock all external dependencies (services, repositories, HTTP clients) using Moq.
- Use InMemory context or mocked interfaces for repository tests; avoid real database connections in unit tests.
- Name tests using the `MethodUnderTest_Scenario_ExpectedResult` convention.
- Use `describe`-style organization via nested classes where it aids readability.

## Constraints
- Do not reduce existing test coverage or remove meaningful tests without reason.
- Do not change production behavior while creating tests.
- Preserve prompt-defined output format, test file path, and artifact requirements when provided.

## Output Rules
- Place test files in the expected test project, mirroring the source project structure.
- Report what was added and what remains as a coverage gap or deferred item.
- Keep the prompt contract as final authority when prompt rules are more specific.
