---
name: skill-failure-triage-fix
description: Shared method for analyzing QA automation failures and applying the smallest safe fix.
---

# Skill: Failure Triage Fix

## Purpose
Provide a reusable failure-analysis method so prompts can focus on evidence, diagnosis, and fix output while this skill handles safe remediation discipline.

## Inputs
- Failure report or analysis artifact
- Affected page class, test class, or DOM evidence
- Prompt-defined mode and output targets

## Method
1. Select the failure evidence and capture the exact failure details.
2. Classify the failure into a clear failure-type bucket.
3. Determine the impacted page or test method.
4. Apply the smallest safe fix when requested.
5. Validate that no unstable or forbidden patterns were introduced.

## Quality Rules
- Keep every fix traceable to the report and DOM evidence.
- Never add assertions to page classes.
- Never add inline locators inside test methods.
- Never use `Thread.sleep()`.
- Use `WaitUtil` for synchronization changes.

## Constraints
- If stable locator or runtime details are missing, stop and request them.
- Do not rewrite files when a localized fix is sufficient.
- If the evidence suggests a product defect instead of an automation defect, call that out.

## Output Rules
- Save analysis and fix-summary artifacts under `reports/test-execution/`.
- Use the prompt's naming and template requirements exactly.
- Include remaining blockers and rerun recommendations when applicable.