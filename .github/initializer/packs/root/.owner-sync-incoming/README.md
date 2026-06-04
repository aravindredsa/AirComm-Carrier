# Owner Sync Incoming

Drop incoming owner distribution zip files in this folder.

## Run Sync

Use one of the following commands from workspace root:

- `node .github/initializer/tools/sync-owner-from-zip.js .owner-sync-incoming/<distribution-file>.zip`
- `node .github/initializer/tools/sync-owner-from-zip.js` (auto-picks latest `.zip` in `.owner-sync-incoming`)
- VS Code task: `initializer: sync owner from zip` (auto-picks latest `.zip` in `.owner-sync-incoming`)

## Notes

- Keep this folder for incoming artifacts only.
- ZIP files in this folder are ignored by git.
