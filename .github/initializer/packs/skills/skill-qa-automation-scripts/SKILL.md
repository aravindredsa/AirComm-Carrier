---
name: skill-automation-scripts
description: Shared method for generating resolver-selected automation stack automation artifacts from approved test cases.
---

# Skill: Automation Scripts

## Purpose
Provide a reusable automation-generation method so prompts can focus on inputs, phased delivery, and output package structure while this skill handles codebase inspection and script hygiene.

## Inputs
- Approved test cases and scenario plans
- DOM or HTML evidence for locator extraction
- Existing framework patterns: page objects, base classes, utilities, and test logging
- Prompt-defined output package path

## Method
1. Scan the repository for framework patterns and conventions.
2. Group test cases into executable automation scenarios.
3. Generate assets in the required phase order.
4. Use evidence-based locators and fixed-value enums where appropriate.
5. Keep assertions in test classes and interactions in page objects.
6. Validate the generated package statically before completion.

## Quality Rules
- Never invent locators when DOM evidence is missing; use placeholders and flag them.
- Never use `Thread.sleep()`.
- Use `WaitUtil` before interactions.
- Keep assertions in test classes, not page classes.
- Include `TestLogger.data`, `TestLogger.pass`, and `TestLogger.fail` where required.

## Constraints
- Do not generate scripts before test-case and scenario artifacts exist.
- Do not execute tests unless explicitly requested.
- Require confirmation when the prompt defines phase gates.

## Output Rules
- Save automation assets under the prompt-defined artifact folder.
- Populate the required template structure fully.
- Report files created, modified, covered TCs, and review status.