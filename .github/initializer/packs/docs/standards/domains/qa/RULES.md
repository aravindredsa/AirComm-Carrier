# QA Domain Standards

## Purpose
Define production-grade QA standards for test design, automation, and defect reporting.

## Applies To
- Test case design and maintenance
- Automation scripts and validation flows
- Failure triage and bug reporting

## Required Rules
- Base tests on explicit requirements and observable behavior.
- Cover positive, negative, boundary, and error paths.
- Keep test data, setup, and environment assumptions explicit.
- Ensure failures are diagnosable with actionable evidence.
- Maintain deterministic and repeatable test execution.

## Test Design Expectations
- Use clear preconditions, steps, expected results, and exit criteria.
- Tag tests by scope (smoke, regression, integration, e2e) consistently.
- Define validation points for UI, API, data, and logs when relevant.

## Automation Expectations
- Prefer stable locators and resilient synchronization.
- Avoid brittle waits and environment-coupled assumptions.
- Capture artifacts (logs/screenshots) for failed runs.

## Avoid
- Flaky, timing-sensitive tests without mitigation
- Assertions that validate implementation details only
- Bug reports without reproducible evidence

## Review Checklist
- Is requirement coverage complete and traceable?
- Are tests deterministic and maintainable?
- Are failures actionable for engineering teams?
- Are environment and data assumptions documented?
