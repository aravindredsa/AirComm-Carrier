---
agent: 'agent'
description: Owner-only interactive workflow for incrementally updating an existing client profile without re-onboarding.
version: 1.0.0
---

# Update Client Profile

## Purpose

Update an existing client profile incrementally.

Use this workflow when you need to adjust client settings after onboarding, such as:
- adding or updating languages, frameworks, testing tools, data/storage, or hosting platform
- refining output preferences and terminology
- adding security, approval, or avoid-action guardrails

Do not use this workflow for first-time client setup. Use onboarding for that.

## Runtime Policy

Before execution, load and apply:
- `config/prompt-execution-policy.json`

Run this workflow in sequential mode because answers are collected step-by-step.

## Interaction Rules

0. First ask for target existing client id.
1. Then ask input mode using `vscode_askQuestions`:
- option A: `Use existing questionnaire file`
- option B: `Answer update questions interactively`
2. If option A is selected:
- ask for questionnaire file path (textbox)
- allow partial answers; missing answers mean no change
3. If option B is selected:
- ask update questions one-by-one using `vscode_askQuestions`
- prefix each prompt with `[X/18]`
- tell the user that leaving a response blank means `no change`
4. Use checkbox/radio/textbox control types matching `update-client-profile.js` parsing expectations.
5. For any question with `Other`, capture follow-up text and append it to the same answer.

## Update Semantics

- This workflow updates an existing client profile only.
- It must not prune other client folders.
- Missing answers should not erase existing values.
- The script merges incoming signals into current client state.

## Control Mapping

Use the same control mapping as onboarding for Q1-Q18.
For interactive update mode, blank responses should be omitted from the generated questionnaire file or recorded as `no change` and treated as no update intent.

## File Generation

If interactive mode is selected, write:
- `artifacts/onboarding/client-update-response-<YYYYMMDD-HHMMSS>.md`

Use questionnaire-compatible markdown format with `Answer:` lines only for changed responses when practical.

If existing-file mode is selected, use the provided file path directly as script input.

## Execution

1. Ask whether to run dry-run first (`yes`/`no`, default `yes`).
2. Build command:
- base:
  `node .github/initializer/tools/update-client-profile.js --input <file> --client-id <target-client-id> --sync-manifest`
- add `--dry-run` when selected
3. If dry-run succeeds, ask whether to execute apply run.

## Final Output To User

Return concise summary including:
- target client id
- selected input mode
- questionnaire file path used
- command(s) executed
- changed fields reported by script
- manifest sync status
- success/failure summary JSON

## Prompt Usage Logging

After successful completion, run:

```bash
node .github/initializer/tools/log-prompt-usage.js --prompt-path=.github/initializer/owner-prompts/update-client-profile.prompt.md
```
