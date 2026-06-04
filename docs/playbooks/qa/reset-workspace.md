# Reset Workspace

## Purpose
Guide users through safely removing initializer-managed QA files so the workspace can be reinitialized.

## Recommended Workflow
1. Confirm `.github/prompts/reset-qa-workspace.prompt.md` exists.
2. Run `/reset-qa-workspace` in Copilot Agent mode.
3. Review deletion report: deleted, skipped (protected), failed, already absent.
4. Re-run `/initialize-ai-workspace` if you need a clean reseed.

## Output
- Workspace cleaned using manifest-derived inventory only.
- Protected paths preserved.
