# Initialize Workspace

## Purpose
This playbook describes how to bootstrap a new developer's local environment with the `ai-db-enabler` workspace files using the initializer tooling.

---

## Prerequisites

- Node.js 18+ installed
- VS Code with GitHub Copilot extension installed and signed in
- Access to the distribution zip (`ai-db-enabler-vX.Y.Z.zip`)

---

## Step 1: Receive the Distribution Zip

Obtain the latest `ai-db-enabler-vX.Y.Z.zip` from the team. Place it in the target workspace root alongside (or inside) your project folder.

---

## Step 2: Extract and Bootstrap

In the VS Code terminal, run:

```bash
node .github/initializer/tools/initialize-workspace.js
```

This script:
1. Detects the distribution zip in the current workspace root
2. Extracts all pack sources to their mapped destination paths
3. Creates any missing artifact/report folders
4. Sets up `.init_state/` tracking for future sync operations

---

## Step 3: Verify Initialization

After running, confirm:
- `.github/prompts/` contains all `DB_*` prompt files
- `docs/standards/` contains all 6 standards files
- `docs/playbooks/` contains all playbook files
- `templates/` contains all template files
- `agents/` directory is present
- Report folders exist under `reports/`

---

## Step 4: Open in VS Code

Open the workspace folder in VS Code. The GitHub Copilot Chat will auto-load `.github/copilot-instructions.md` as the instruction context.

Verify by opening Copilot Chat and asking:
> What prompts are available in this workspace?

---

## Step 5: Test a Prompt

Run a quick smoke test by invoking:
```
/DB_generate-data-dictionary
```

If Copilot responds with a structured prompt flow, the workspace is initialized correctly.

---

## Re-Initializing (Reset)

If you need to reset the workspace to a clean state without losing your artifacts:

```bash
# Via VS Code Task:
# Run Task → "initializer: sync owner from zip"
```

Or invoke the reset prompt:
```
/reset-ai-workspace
```

---

## Updating to a New Version

When a new distribution zip is released:
1. Place the new zip in the workspace root
2. Run `node .github/initializer/tools/initialize-workspace.js`
3. The tool will detect the version bump and apply incremental updates

---

## Troubleshooting

| Issue | Resolution |
|---|---|
| `initialize-workspace.js` not found | Ensure you are in the workspace root, not a subfolder |
| Prompts not visible in Copilot Chat | Restart VS Code after initialization |
| Zip not detected | Ensure the zip filename matches `ai-db-enabler-vX.Y.Z.zip` pattern |
| Missing artifact folders | Re-run the initialize script; it is idempotent |
