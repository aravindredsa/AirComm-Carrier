# Owner Guides

This folder contains maintainer-facing implementation guides for initializer and pack behavior.

These guides are intended for enabler owners and contributors, not downstream enabler users.

## Guide Layout

- `prompts/` for prompt-level owner guides
- `tools/` for script-level owner guides
- `hooks/` for local git hook and editor-hook owner guides
- `standards/` for standards resolution and policy notes
- `architecture/` for cross-cutting system architecture guides
- `policies/` for unified-enabler config policy guides

## Prompt Guides

- [Initialize AI Workspace Prompt Guide](./prompts/initialize-ai-workspace-guide.md)
- [Report Prompt Adoption Guide](./prompts/report-prompt-adoption-guide.md)
- [Onboard New Client Prompt Guide](./prompts/onboard-new-client-prompt-guide.md)
- [Update Client Profile Prompt Guide](./prompts/update-client-profile-prompt-guide.md)

## Tool Guides

- [initialize-workspace.js Guide](./tools/initialize-workspace-guide.md)
- [onboard-new-client.js Guide](./tools/onboard-new-client-guide.md)
- [update-client-profile.js Guide](./tools/update-client-profile-guide.md)
- [sync-seed-manifest.js Guide](./tools/sync-seed-manifest-guide.md)
- [finalize-distribution.js Guide](./tools/finalize-distribution-guide.md)
- [watch-owner-loop.js Guide](./tools/watch-owner-loop-guide.md)
- [sync-owner-from-zip.js Guide](./tools/sync-owner-from-zip-guide.md)
- [generate-prompt-adoption-report.js Guide](./tools/generate-prompt-adoption-report-guide.md)
- [log-prompt-usage.js Guide](./tools/log-prompt-usage-guide.md)

## Hook Guides

- [Hooks Guide](./hooks/hooks-guide.md)

## Standards Guides

- [Standards Resolution User Guide](./standards/standards-resolution-user-guide.md)

## Architecture Guides

- [Manifest and Pack Architecture Guide](./architecture/manifest-pack-architecture-guide.md)

## Policy Guides

- [Auto Finalizer Release Policy Guide](./policies/auto-finalizer-release-policy.md)
- [Audit Stack Routing Policy Guide](./policies/audit-stack-routing-policy-guide.md)
- [Model Routing Policy Guide](./policies/model-routing-policy-guide.md)
- [Prompt Execution Policy Guide](./policies/prompt-execution-policy-guide.md)
