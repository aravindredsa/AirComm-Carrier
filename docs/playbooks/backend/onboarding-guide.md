# Onboarding Guide

## Welcome to the AI Enablement Workspace

This workspace provides AI-assisted tools for implementation, testing, analysis, evaluation, and workspace setup.

## Start Here

1. Read `README.md` for repository context.
2. Read `docs/references/FOLDER-STRUCTURE.md` for workspace organization.
3. Run `/initialize-ai-workspace` if the workspace has not been bootstrapped yet.
4. Review `.github/copilot-instructions.md` before making code changes.

## Prompt to Playbook Map

## Workspace Setup
- `/initialize-ai-workspace` -> `docs/playbooks/initialize-workspace.md`
- `/reset-ai-workspace` -> `docs/playbooks/reset-ai-workspace.md`

## Analysis and Design
- `/reverse-engineer-application` -> `docs/playbooks/reverse-engineer-application.md`
- `/ui-analysis-prompt` -> `docs/playbooks/ui-analysis.md`
- `/plan-feature-from-story-and-figma` -> `docs/playbooks/plan-feature-from-story-and-figma.md`
- `/build-feature-from-plan` -> `docs/playbooks/build-feature-from-plan.md`
- `/build-feature-from-story-and-figma` -> `docs/playbooks/build-feature-from-story-and-figma.md`

## Test Case Generation
- `/generate-unit-test-cases` -> `docs/playbooks/generate-unit-test-cases.md`
- `/generate-component-test-cases` -> `docs/playbooks/generate-component-test-cases.md`
- `/generate-integration-test-cases` -> `docs/playbooks/generate-integration-test-cases.md`
- `/generate-functional-test-cases` -> `docs/playbooks/generate-functional-test-cases.md`
- General test-case guidance -> `docs/playbooks/generate-test-cases.md`

## Evaluation and Review
- `/generate-evaluation-matrix` -> `docs/playbooks/generate-evaluation-matrix.md`
- `/evaluate-output-quality` -> `docs/playbooks/evaluate-output-quality.md`
- Uncommitted-change audit workflow -> `docs/playbooks/run-uncommitted-changes-audit.md`

## Additional Guidance
- Test automation support -> `docs/playbooks/generate-automation-tests.md`
- Full codebase audit playbook -> `docs/playbooks/run-full-codebase-audit.md`

## Recommended First Workflows

1. Run `/initialize-ai-workspace` to create missing folders and starter files.
2. Use `/audit-uncommitted-changes` before commits.
3. Use `/plan-feature-from-story-and-figma` and then `/build-feature-from-plan` for controlled story-driven backend implementation.
4. Use the appropriate `/generate-*-test-cases` prompt before QA handoff.
5. Use `/generate-evaluation-matrix` and `/evaluate-output-quality` when reviewing deliverables.

## Output Locations

- Workspace bootstrap files -> repository root, `.github/`, `docs/`, `templates/`
- UI analysis documents -> `artifacts/ui-analysis/`
- Reverse-engineering documents -> `artifacts/reverse-engineer-analysis/`
- Feature implementation plans -> `artifacts/feature-plans/`
- Test case outputs -> `artifacts/test-cases/` or `test-assets/manual/` depending on prompt
- Audit and evaluation outputs -> `reports/`
