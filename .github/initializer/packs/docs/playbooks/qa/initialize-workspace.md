# Initialize Workspace

## Purpose
Explain how to bootstrap or align the QA enablement workspace using the initializer prompt.

## Recommended Workflow
1. Confirm `.github/prompts/initialize-ai-workspace.prompt.md` exists.
2. Run `/initialize-ai-workspace` in Copilot Agent mode.
3. Review summary output (mode, created/updated/skipped files, mismatches).
4. Verify seeded QA folders and prompts are present.

## Output
- Initialized or aligned QA workspace based on manifest and pack sources.
- Updated initializer state under `.init_state/`.
