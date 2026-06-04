# Reset AI Workspace

## Purpose
Guide users through removing initializer-created workspace files so the workspace can be reinitialized from a clean baseline.

## Recommended Workflow
1. Review the files and folders that were created by `/initialize-ai-workspace`.
2. Run `/reset-ai-workspace`.
3. Review the deletion report, especially any skipped protected paths.
4. Re-run `/initialize-ai-workspace` only after confirming the workspace is ready.

## Output
- Cleanup summary including deleted, skipped, and already-absent paths
