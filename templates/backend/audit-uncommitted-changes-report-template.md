
# Code Audit Report
**Date:** <today's date>  
**Scope:** Uncommitted changes only (`git diff HEAD`)  
**Files Reviewed:** <list from git diff --name-only>  
**Reviewed By:** GitHub Copilot (Automated Audit)

---

## Score Summary

Use 0.5 increments for all scores (for example: `7.5/10`, `8.5/10`).

| Dimension         | Score | Rating |
|-------------------|--------|
| Security          |  /10  | 🔴 / 🟡 / 🟢 |
| Architecture      |  /10  | 🔴 / 🟡 / 🟢 |
| Code Quality      |  /10  | 🔴 / 🟡 / 🟢 |
| API Accessibility |  /10  | 🔴 / 🟡 / 🟢 |
| Performance       |  /10  | 🔴 / 🟡 / 🟢 |
| Maintainability   |  /10  | 🔴 / 🟡 / 🟢 |
| Explainability    |  /10  | 🔴 / 🟡 / 🟢 |
| Test Coverage     |  /10  | 🔴 / 🟡 / 🟢 |
| DevOps            |  /10  | 🔴 / 🟡 / 🟢 |
| Data Integrity    |  /10  | 🔴 / 🟡 / 🟢 |
| **Overall**       |  /10  | 🔴 / 🟡 / 🟢 |

Rating key: 🔴 0–3.5 Critical  |  🟡 4–6.5 Needs Attention  |  🟢 7–10 Good  _(scores in 0.5 increments)_

---

## Files in Scope
| File | Change Type | Lines Added | Lines Removed |
|------|-------------|-------------|---------------|
| <filename> | Modified/Added/Deleted | +N | -N |

---

## Executive Summary
<Write 2–3 paragraphs of professional prose.>
<Paragraph 1: What the changes are and overall impression.>
<Paragraph 2: Most critical issues found — be specific with file names and line references.>
<Paragraph 3: Readiness assessment — are these changes safe to commit and push?>

---

## Key Findings

| # | Severity | File | Finding | Line(s) |
|---|----------|------|---------|---------|
| 1 | 🔴 Critical | filename.cs | Description of issue | L42 |
| 2 | 🟡 Warning  | filename.ts | Description of issue | L18 |
| 3 | 🔵 Info     | filename.cs | Description of issue | L91 |

---

## Recommendations

| Priority | Action | File(s) Affected | Effort |
|----------|--------|------------------|--------|
| 🔴 Immediate | Remove hardcoded connection string | appsettings.json | Low |
| 🟡 Before Merge | Add [Authorize] to new endpoint | OrderController.cs | Low |
| 🔵 Follow-up | Add unit tests for new service method | OrderService.cs | Medium |

---

## Audit Trail
- **Git Diff Command Used:** `git diff HEAD`  
- **Untracked Files Included:** Yes (from `git status`)  
- **Full Codebase Scanned:** No — scope limited to changed files only  
- **Report Generated:** <timestamp>

---

## How to Invoke It in VS Code

In Copilot Chat (Agent Mode), type:
```
/audit-uncommitted-changes
```

Or trigger it manually with a one-liner chat prompt:
```
Run git diff HEAD, audit only the changed files, 
and generate /reports/audits/uncommitted-changes/AuditReport_<today>.md 
following the audit prompt rules
```
