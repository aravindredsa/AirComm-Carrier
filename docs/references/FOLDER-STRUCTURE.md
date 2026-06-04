# AI Unified Enabler - Folder Structure Guide

This document reflects the current structure of the unifier workspace.

## Purpose
- explain where source assets live
- show how initializer pack mirroring is organized
- help downstream users navigate prompts, skills, templates, and playbooks

## Current Workspace Structure

```text
[PROJECT_ROOT]/
├── .githooks/
│   └── pre-push
├── .github/
│   ├── hooks/
│   │   ├── detect-stack.cjs
│   │   ├── format.json
│   │   ├── pre-push-audit-gate.config.json
│   │   ├── pre-push-audit-gate.js
│   │   ├── run-post-tool-checks.cjs
│   │   └── README.md
│   ├── initializer/
│   │   ├── manifest/
│   │   ├── migrations/
│   │   ├── packs/
│   │   │   ├── artifacts/
│   │   │   ├── docs/
│   │   │   ├── prompts/
│   │   │   ├── reports/
│   │   │   ├── root/
│   │   │   ├── skills/
│   │   │   ├── templates/
│   │   │   └── vscode/
│   │   ├── rules/
│   │   └── tools/
│   ├── prompts/
│   │   ├── README.md
│   │   ├── audit-*.prompt.md
│   │   ├── ba-*.prompt.md
│   │   ├── backend-*.prompt.md
│   │   ├── bpmn-*.prompt.md
│   │   ├── db-*.prompt.md
│   │   ├── frontend-*.prompt.md
│   │   ├── qa-*.prompt.md
│   │   ├── initialize-ai-workspace.prompt.md
│   │   └── reset-ai-workspace.prompt.md
│   └── skills/
│       ├── skill-codebase-audit/
│       ├── skill-feature-implementation/
│       ├── skill-ba-*/
│       ├── skill-backend-*/
│       ├── skill-bpmn-*/
│       ├── skill-db-*/
│       ├── skill-frontend-*/
│       └── skill-qa-*/
├── .init_state/
├── .owner-sync-incoming/
├── .vscode/
├── agents/
├── artifacts/
│   ├── docx/
│   ├── feature-plans/
│   ├── functional-requirements/
│   ├── gap-analysis/
│   ├── reverse-engineer-analysis/
│   ├── ui-analysis/
│   └── user-stories/
├── config/
│   ├── client-profiles.json
│   ├── standards-catalog.json
│   └── standards-resolution-policy.json
├── distributions/
│   ├── frontend-ai-enabler-v10/
│   └── frontend-ai-enabler-v*.zip
├── docs/
│   ├── architecture/
│   ├── playbooks/
│   │   ├── ba/
│   │   ├── backend/
│   │   ├── bpmn/
│   │   ├── db/
│   │   ├── frontend/
│   │   └── qa/
│   ├── references/
│   │   ├── FOLDER-STRUCTURE.md
│   │   └── GLOSSARY.md
│   └── standards/
│       ├── ba/
│       ├── common/
│       ├── domains/
│       ├── capabilities/
│       └── clients/
├── reports/
│   ├── audits/
│   │   ├── full-codebase/
│   │   └── uncommitted-changes/
│   ├── evaluations/
│   ├── test-coverage/
│   └── test-execution/
├── templates/
│   ├── ba/
│   ├── backend/
│   ├── bpmn/
│   ├── db/
│   ├── frontend/
│   └── qa/
├── agent.md
├── README.md
├── initializer-release-notes.md
├── workspace-ai-initialization-guide.md
└── supporting workflow/manifest guides (*.md, *.docx)
```

## Key Directories

### .github/prompts
Runnable entry points for user workflows. Prompts are grouped by stack prefix (for example ba-, bpmn-, frontend-, backend-, qa-, db-) plus shared prompts.

### .github/skills
Execution methods used by prompts. Skills contain detailed implementation constraints and quality rules.

### docs/playbooks
Human-readable operating manuals for downstream users. These explain when and how to run prompts but are intentionally not wired as runtime dependencies.

### docs/standards
Rules and quality baselines by stack, plus common shared standards in docs/standards/common.

### templates
Output structures used by prompts and skills. Organized by stack folder.

### artifacts
Working outputs created during workflows (analysis, plans, user stories, and document exports).

### reports
Finalized audit and evaluation outputs.

### config
Centralized runtime configuration. Current files: `standards-catalog.json`, `client-profiles.json`, and `standards-resolution-policy.json`.

### .github/initializer/packs
Mirrorable distribution source used to seed initialized workspaces.

### .githooks
Git hook entry points for local repository actions (for example pre-push), typically wired via `core.hooksPath`.

### .github/hooks
Hook support scripts and configurations used by `.githooks` and editor hook integrations.

## Notes
- This repository is an AI workspace and distribution source, not a frontend application scaffold.
- Do not expect root files such as package.json, tsconfig.json, or src/ in this unifier workspace.
- Pre-push audit/security gating is implemented through `.githooks/pre-push` and `.github/hooks/pre-push-audit-gate.*`.
- Keep this document updated whenever top-level folders or stack folders are added, removed, or renamed.
