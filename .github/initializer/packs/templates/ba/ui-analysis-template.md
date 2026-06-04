# UI Analysis Document

## 1. Introduction

### 1.1 Purpose
Provide the complete business and technical purpose of the UI feature/module exactly as documented.

### 1.2 Scope
Define in-scope and out-of-scope UI/process boundaries, including dependencies, systems, workflows, and constraints.

### 1.3 Business Objectives
List all business objectives with full detail.

## 2. Process Overview
Describe the end-to-end process flow, including initiation points, user/system actions, branching, and completion states.

## 3. Roles & Permissions

| Role | Permissions | Access Scope | Restrictions | Notes |
|---|---|---|---|---|
|  |  |  |  |  |

Document every role-action mapping, authorization rule, and restriction.

## 4. Preconditions & Task Triggers

### 4.1 Preconditions
List all required upstream conditions.

### 4.2 Task Triggers

| Trigger ID | Trigger Event | Source | Condition(s) | Resulting Action |
|---|---|---|---|---|
|  |  |  |  |  |

Capture every trigger and transition rule.

## 5. Functional Requirements

### 5.1 Detailed UI Behavior
Describe all screens, sections, controls, states, and user interactions.

### 5.2 Conditional Logic
List all dynamic visibility/enabled/disabled/required rules.

### 5.3 Validation Rules

| Validation ID | Scope (Field/Form/Workflow) | Rule | Error Message | Trigger Condition |
|---|---|---|---|---|
|  |  |  |  |  |

### 5.4 Add/Delete Logic
Document all add/remove behavior for rows, files, items, and related constraints.

### 5.5 Save/Submit Logic
Document save vs submit behavior, checks, side effects, persistence, and error paths.

### 5.6 Workflow Integration
Document post-submit routing, task transitions, and downstream/upstream effects.

## 6. Prepopulating Data

| Field | Source | Rule | Timing | Overrides |
|---|---|---|---|---|
|  |  |  |  |  |

Document all prepopulation behavior and precedence.

## 7. Inputs & Field Rules

| Attribute Name | Section Name | Category | Input Type | Allowed Values | Mandatory/Optional | Validation Rules/Messages | Prepopulated | Dynamic Visibility | Calculated Field | Read-only/Editable | Data Source | Constraints | Logic for Displaying |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
|  |  |  |  |  |  |  |  |  |  |  |  |  |  |

Include every field with complete rule coverage.

## 8. Use Cases / User Stories
Provide each use case in step-by-step detail.

### 8.1 Use Case Template
- Actor
- Preconditions
- Trigger
- Main Flow (numbered steps)
- Alternate Flows
- Exception Flows
- Postconditions

## 9. Non-Functional Requirements

### 9.1 Performance
### 9.2 Reliability
### 9.3 Security
### 9.4 Accessibility
### 9.5 Auditability/Traceability

Document all stated NFR requirements and constraints.

## 10. Acceptance Criteria

| AC ID | Requirement Reference | Acceptance Criteria | Evidence/Validation Method |
|---|---|---|---|
|  |  |  |  |

Map acceptance criteria to functional requirements.

## 11. Post-Action Workflow Behavior
Describe all actions, assignments, transitions, and state changes after key user actions.

## 12. Asset Status

| Event | Previous Status | New Status | Condition | Notes |
|---|---|---|---|---|
|  |  |  |  |  |

Capture all status transition logic.

## 13. Task Configuration

| Parameter | Value | Rule | Notes |
|---|---|---|---|
| Warning Days |  |  |  |
| Due Days |  |  |  |
| Adhoc |  |  |  |
| Skip |  |  |  |
| Postpone |  |  |  |

Document every task configuration rule.

## 14. Notifications

| Notification ID | Trigger | Recipient(s) | Channel | Content Rules | Conditions |
|---|---|---|---|---|---|
|  |  |  |  |  |  |

Document all notification behavior, routing, and constraints.

## 15. Task History
Describe how task history is written, displayed, filtered, and audited.

## Completeness Checklist
- No placeholders.
- No invented rules.
- No omissions.
- All fields, validations, triggers, and workflows captured.
- Output is fully detailed and ready for Dev/QA/Product consumption.

### README files for empty artifact and report folders  

For each of these folders, if empty, create a README.md with this content:

# Folder Purpose

This folder stores generated artifacts or reports for this category.

Apply this to:

- artifacts/reverse-engineer-analysis  
- artifacts/ui-analysis  
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

- Pass 1: create all missing folders and files, then seed all missing or empty files with the content above  
- standards import: execute the Standards Import Rule after core seeding  
- Pass 2 verification: re-check every required folder/file and every seeded target  
- remediation: if any required folder/file is still missing, create it; if any target that should be seeded is still empty, seed it  
- content exact-match verification: for files created/seeded in this run, compare each file one-by-one to its corresponding starter block using normalized exact match; reseed and re-verify any mismatches until exact match passes  
- retry once for any failed writes/extraction operations, then re-verify  
- preserve meaningful existing content and use the current workspace root as the base  
- cleanup: remove transient initialization artifacts created by execution (`.init_state/`, `.is.EOF`)  
- completion gate: do not end until verification reports zero missing required items, zero missed seeds, and zero exact-match failures for files created/seeded in this run  

## Summary Output

At the end, provide a concise summary of:

- folders created  
- files created  
- files seeded  
- files skipped, with full absolute path for each skipped file  
- verification results (missing required items = 0, missed seeds = 0, exact-match failures = 0 for files created/seeded in this run)  
- exact-match validation scope (count of files validated one-by-one, and full absolute path list of any files that required reseed before passing)  
- cleanup results (`.init_state` removed = yes/no, `.is.EOF` removed = yes/no)  
- standards files skipped during zip import, with full absolute path for each skipped file  
- recommendations  

Apply the changes directly to the workspace.
Do not generate a script unless explicitly asked.
