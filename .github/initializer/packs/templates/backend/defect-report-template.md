
# Defect Report

## Defect ID
## Summary
## Steps to Reproduce
## Expected Result
## Actual Result
## Severity
## Notes

### README files for empty artifact and report folders  

For each of these folders, if empty, create a README.md with this content:

# Folder Purpose

This folder stores generated artifacts or reports for this category.

Apply this to:

- artifacts/reverse-engineer-analysis  
- artifacts/docx  
- reports/audits/full-codebase  
- reports/audits/uncommitted-changes  
- reports/evaluations  
- reports/test-execution  
- reports/test-coverage  

### .vscode/tasks.json  

If missing or empty, write this content exactly as JSON:

{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Convert current Markdown to Word",
      "type": "shell",
      "command": "pandoc",
      "args": [
        "${file}",
        "-o",
        "${fileDirname}/${fileBasenameNoExtension}.docx"
      ],
      "runOptions": {
        "runOn": "default"
      },
      "problemMatcher": []
    }
  ]
}

## Final Execution

Now perform the initialization:

- Pass 1: create all missing folders and files, then seed all required target files with the content above (overwrite existing target-file content)  
- standards import: execute the Standards Import Rule after core seeding  
- Pass 2 verification: re-check every required folder/file and every seeded target  
- remediation: if any required folder/file is still missing, create it; if any target that should be seeded is missing/empty/mismatched, reseed it  
- content exact-match verification: for files created/seeded in this run, compare each file one-by-one to its corresponding starter block using normalized exact match; reseed and re-verify any mismatches until exact match passes  
- retry once for any failed writes/extraction operations, then re-verify  
- overwrite required target files even when they already contain meaningful content, except meaningful pre-existing `.github/copilot-instructions.md`; use the current workspace root as the base  
- cleanup: remove transient initialization artifacts created by execution (`.init_state/`, `.is.EOF`)  
- completion gate: do not end until verification reports zero missing required items, zero missed seeds, and zero exact-match failures for files created/seeded in this run  

## Summary Output

At the end, provide a concise summary of:

- folders created  
- files created  
- files seeded (including overwrites)  
- files skipped (packaged artifact/do-not-seed and meaningful pre-existing `.github/copilot-instructions.md`), with full absolute path for each skipped file  
- verification results (missing required items = 0, missed seeds = 0, exact-match failures = 0 for files created/seeded in this run)  
- exact-match validation scope (count of files validated one-by-one, and full absolute path list of any files that required reseed before passing)  
- cleanup results (`.init_state` removed = yes/no, `.is.EOF` removed = yes/no)  
- standards files skipped during zip import, with full absolute path for each skipped file  
- recommendations

Apply the changes directly to the workspace.
Do not generate a script unless explicitly asked.
