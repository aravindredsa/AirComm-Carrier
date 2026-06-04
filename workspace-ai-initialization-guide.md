# Getting Started - AI Universal Enabler Workspace Initialization

Hi Team,

This package is built from the ai-universal-enabler workspace and is intended to initialize a target repository with a standardized AI prompt/skill/playbook framework.

Follow the steps below to initialize your workspace.

## Setup Steps

1. Unzip the distribution on your local machine.
   - Do not unzip inside your active project workspace.

2. After extraction, open the extracted folder (versioned folder name may vary) and confirm it contains:
   - `.github/`
     - `.github/prompts/`
     - `.github/initializer/`
   - `docs/` (including onboarding guides and release notes)

3. In your target project workspace root, ensure a `.github/` folder exists.
   - Create it if missing.

4. From the extracted package, copy these into the target workspace:
   - `.github/prompts/initialize-ai-workspace.prompt.md` -> `<workspace>/.github/prompts/`
   - `.github/initializer/` -> `<workspace>/.github/initializer/` (copy full folder and contents)

 5. Copy the `docs/` folder from the extracted package to the target workspace (includes onboarding guides).

6. If your system asks whether to overwrite existing files, choose overwrite when you want the package version to be the source of truth.

7. Open the target workspace in VS Code.

8. In Copilot Chat, switch to Agent mode and run:

   ```
   /initialize-ai-workspace
   ```

## What Initialization Does

- Reads `.github/initializer/manifest/seed-manifest.json`.
- Applies seeded files from `.github/initializer/packs/`.
- Creates/updates required folders and files for prompts, skills, standards, playbooks, templates, artifacts, and reports.

## Important Notes

- Approve file-write permission prompts when they appear.
- Initialization usually completes in a few minutes.
 - You can review packaged changes in `docs/onboarding/initializer-release-notes.md` before running initialization.

---

Happy Coding!
