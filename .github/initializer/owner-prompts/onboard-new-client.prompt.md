---
agent: 'agent'
description: Guided onboarding interview that collects questionnaire answers one-by-one and runs onboard-new-client automation.
version: 1.0.0
---

# Onboard New Client

## Purpose

Support both onboarding input paths:

- use an existing completed questionnaire file as script input
- collect answers interactively (question 1 through 18), generate a questionnaire file, and use that as script input

Then run the client onboarding automation script.

## Runtime Policy

Before execution, load and apply:

- `config/prompt-execution-policy.json`

Run this workflow in sequential mode because answers are collected step-by-step.

## Interaction Rules

0. First ask input mode using `vscode_askQuestions`:
- option A: `Use existing questionnaire file`
- option B: `Answer questions interactively`
1. If option A is selected:
- ask for questionnaire file path (textbox)
- skip interactive question collection and go directly to execution steps
2. If option B is selected:
- continue with one-by-one question flow below
1. Ask one question at a time using `vscode_askQuestions`.
2. Prefix each prompt with `[X/18]` (for example: `[3/18]`).
3. Use control type exactly as defined below:
- `checkbox`: `options` + `multiSelect: true` + `allowFreeformInput: true`
- `radio`: `options` + `multiSelect: false` + `allowFreeformInput: true`
- `textbox`: no `options`, freeform response
4. For any question with an `Other` option:
- if `Other` is selected, immediately ask a follow-up textbox question to capture details.
- append the follow-up text to the same final answer for that question.
5. Preserve the user's wording whenever possible.

## Question Control Mapping (Derived From Script Usage)

Use these types because `onboard-new-client.js` parses free text and list-like values by keywords or comma/newline splitting.

1. Q1 Client/team name: `textbox` (required)
2. Q2 Project/application name: `textbox`
3. Q3 Intended work areas: `checkbox`
- Options: `feature development`, `testing support`, `documentation`, `audit review`, `process diagrams`, `analysis`, `all of the above`, `Other`
4. Q4 Programming languages: `checkbox`
- Options: `Java`, `C#`, `TypeScript`, `SQL`, `Python`, `Other`
5. Q5 Frameworks/libraries: `checkbox`
- Options: `React`, `ASP.NET Core`, `Spring Boot`, `Angular`, `Node.js`, `Django`, `Other`
6. Q6 Testing tools/approach: `checkbox`
- Options: `xUnit`, `JUnit`, `Vitest`, `Playwright`, `Selenium`, `manual testing`, `Other`
7. Q7 Database/data storage: `checkbox`
- Options: `SQL Server`, `PostgreSQL`, `Oracle`, `MySQL`, `MongoDB`, `Stored Procedures`, `API/JSON Contracts`, `Other`
8. Q8 Hosting/deployment: `checkbox`
- Options: `Azure`, `AWS`, `GCP`, `on-premises servers`, `Kubernetes`, `Other`
9. Q9 Desired AI outputs: `checkbox`
- Options: `implementation plans`, `code changes`, `test cases`, `review comments`, `release notes`, `workflow diagrams`, `analysis documents`, `Other`
10. Q10 Preferred output format: `radio`
- Options: `Markdown`, `Excel`, `Word document`, `PDF`, `JSON`, `plain text`, `Other`
11. Q11 Existing sample output availability: `radio`
- Options: `yes, we have a previous document`, `yes, I can share a sample`, `no, please create a standard format for us`, `Other`
12. Q12 Output detail level: `radio`
- Options: `short and direct`, `medium detail`, `very detailed`, `include step-by-step explanation`, `Other`
13. Q13 Preferred terms/naming style: `textbox`
14. Q14 Terms/styles to avoid: `textbox`
15. Q15 Team non-negotiable rules: `textbox`
16. Q16 Security/privacy requirements: `checkbox`
- Options: `do not include personal data`, `mask account numbers`, `follow internal security review`, `use approved tools only`, `Other`
17. Q17 Approval requirements: `checkbox`
- Options: `product owner approval`, `QA approval`, `security approval`, `no extra approval needed`, `Other`
18. Q18 Tools/actions to avoid: `checkbox`
- Options: `do not use production data`, `do not change database scripts`, `do not create UI changes without design approval`, `Other`

## Answer Normalization

1. For `checkbox` and `radio` answers, store selected values as a comma-separated line.
2. For `textbox` answers, store exactly as entered.
3. If user leaves a response blank, store `not sure`.
4. Keep answers compatible with markdown parsing in `onboard-new-client.js`.

## File Generation

If input mode is interactive, after collecting all 18 answers, write a completed questionnaire file:

- Path: `artifacts/onboarding/client-onboarding-response-<YYYYMMDD-HHMMSS>.md`
- Format: keep the same question structure as `.github/initializer/client-inputs/client-onboarding-response-template.md`
- Ensure every question has one `Answer:` line.

If input mode is existing file, use that path directly as `<generated-file>` in execution commands.

## Execution

1. Ask whether to run dry-run first (`yes`/`no`, default `yes`).
2. Ask optional client id override (textbox, optional).
3. Build command:

- Base:
  `node .github/initializer/tools/onboard-new-client.js --input <generated-file> --sync-manifest`
- Add `--dry-run` when dry-run is `yes`.
- Add `--client-id <value>` only when provided.

4. Execute command from workspace root.
5. If dry-run was selected, ask whether to execute apply run immediately after successful dry-run.

## Final Output To User

Return concise summary including:

- selected input mode (`existing file` or `interactive`)
- generated questionnaire file path
- command(s) executed
- client id resolved/used
- whether manifest sync ran
- success/failure and key script summary JSON

## Prompt Usage Logging

After successful completion, run:

```bash
node .github/initializer/tools/log-prompt-usage.js --prompt-path=.github/initializer/owner-prompts/onboard-new-client.prompt.md
```
