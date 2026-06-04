# Onboarding Guide

## Welcome to the AI Enablement Workspace

This workspace provides AI-assisted workflows for initialization, feature delivery, analysis, testing, and audit reviews.

## Phase 1: Understand the Workspace Structure

### Read These First

1. **README.md** — Project overview and context
2. **docs/references/FOLDER-STRUCTURE.md** — Current workspace organization
3. **.github/copilot-instructions.md** — Project rules and execution expectations
4. Review prompt files under **.github/prompts/** to see available workflows

### Key Folders to Know

- **.github/prompts/** — Runnable prompt workflows
- **config/** — Standards resolution policy, client profiles, and standards catalog
- **docs/playbooks/** — Human operating guides for each major workflow
- **artifacts/** — Generated working outputs
- **reports/** — Audit and evaluation reports

## Phase 2: Set Up Your Workspace

### Initialize the Workspace

If the repository has not been aligned yet, run:

```
/initialize-ai-workspace
```

This creates the standard folders, seeds missing files, and aligns the AI workspace structure.

### Customize for Your Project

Review and tailor these files:

1. **.github/copilot-instructions.md** — project-specific coding and workflow rules
2. **config/standards-resolution-policy.json**, **config/client-profiles.json**, and **config/standards-catalog.json** — standards resolution inputs for your stack and delivery model
3. **README.md** — project-specific overview and setup information
4. **initializer-release-notes.md** — packaged release history for initializer/reset updates

## Phase 3: Try Your First Prompt

### Option A: Audit Current Work

```
/audit-uncommitted-changes
```

Output: `reports/audits/uncommitted-changes/`

### Option B: Reverse Engineer Existing Behavior

```
/reverse-engineer-application
```

Output: `artifacts/reverse-engineer-analysis/`

### Option C: Build a Frontend Feature

```
/plan-feature-from-story-and-figma
/build-feature-from-plan
```

Output: plan artifact in `artifacts/feature-plans/` followed by code changes in the repo plus updated tests.

## Phase 4: Explore Available Prompts

### Setup and Analysis Prompts
- **`/initialize-ai-workspace`** — bootstrap or align the workspace structure
- **`/reverse-engineer-application`** — generate current-state reverse-engineering analysis
- **`/ui-analysis-prompt`** — generate a UI analysis document from source documents

### Build and Test Prompts
- **`/plan-feature-from-story-and-figma`** — create an implementation-ready feature plan from story and design input
- **`/build-feature-from-plan`** — implement a frontend feature from an approved plan artifact
- **`/build-feature-from-story-and-figma`** — implement a frontend feature from story and design input
- **`/generate-unit-test-cases`** — discover unit-test gaps and generate missing tests
- **`/generate-component-test-cases`** — discover component-test gaps and generate missing tests

### Evaluation and Audit Prompts
- **`/generate-evaluation-matrix`** — create a structured evaluation matrix
- **`/evaluate-output-quality`** — review artifact quality against expectations
- **`/BA_evaluate-reverse-engineer-document`** — review reverse-engineered analysis quality
- **`/audit-fullcodebase`** — audit the full repository
- **`/audit-uncommitted-changes`** — audit only local changes before commit

## Phase 5: Learn the Playbooks

Current playbooks in `docs/playbooks/`:

1. **initialize-workspace.md** — workspace bootstrap guide
2. **reverse-engineer-application.md** — reverse-engineering workflow guide
3. **ui-analysis.md** — UI analysis workflow guide
4. **plan-feature-from-story-and-figma.md** — feature planning workflow guide
5. **build-feature-from-plan.md** — plan-driven feature implementation workflow guide
6. **build-feature-from-story-and-figma.md** — one-step feature implementation workflow guide
7. **generate-unit-test-cases.md** — unit-test generation workflow guide
8. **generate-component-test-cases.md** — component-test generation workflow guide
9. **generate-evaluation-matrix.md** — evaluation matrix workflow guide
10. **evaluate-output-quality.md** — artifact quality review guide
11. **evaluate-reverse-engineer-document.md** — reverse-engineering review guide
12. **run-full-codebase-audit.md** — full audit guide
13. **run-uncommitted-changes-audit.md** — pre-commit audit guide

Pick the playbook that matches the workflow you want to run.

## Phase 6: Integrate into Your Workflow

### Daily Development

```bash
# Before committing
/audit-uncommitted-changes
```

### When Changing Existing Behavior

```bash
# Understand the current implementation first
/reverse-engineer-application
```

### When Building New Frontend Work

```bash
# Create and review the feature plan
/plan-feature-from-story-and-figma

# Build from the approved plan
/build-feature-from-plan

# Strengthen unit coverage
/generate-unit-test-cases

# Strengthen component coverage
/generate-component-test-cases
```

### When Reviewing Generated Artifacts

```bash
/evaluate-output-quality
```

## Suggested Starting Order

1. Read **README.md**
2. Read **docs/references/FOLDER-STRUCTURE.md**
3. Review **.github/prompts/**
4. Run **`/initialize-ai-workspace`** if needed
5. Customize **.github/copilot-instructions.md**
6. Try one workflow prompt relevant to your task
7. Read the matching playbook in **docs/playbooks/**
8. Use audits and evaluations before major handoffs

## Common Questions

**Which prompt should I use for understanding existing code?**
- `/reverse-engineer-application`

**Which prompt should I use for documenting UI behavior from specs or screenshots?**
- `/ui-analysis-prompt`

**Which prompt should I use for building a frontend feature from requirements and design?**
- `/plan-feature-from-story-and-figma` and then `/build-feature-from-plan` for a controlled two-step workflow
- `/build-feature-from-story-and-figma`

**Which prompt should I use for tests?**
- `/generate-unit-test-cases` for logic-level coverage
- `/generate-component-test-cases` for UI component coverage

**Which prompt should I use before committing?**
- `/audit-uncommitted-changes`

**Where do outputs go?**
- Feature plans: `artifacts/feature-plans/`
- Reverse-engineering analysis: `artifacts/reverse-engineer-analysis/`
- UI analysis: `artifacts/ui-analysis/`
- Audit reports: `reports/audits/`
- Evaluation outputs: `reports/evaluations/` or workflow-specific artifact locations

## Next Steps

- Review `.github/prompts/` and `docs/playbooks/` together
- Choose one workflow and run it end-to-end
- Update project-specific instructions where needed
- Share the onboarding flow with your team
