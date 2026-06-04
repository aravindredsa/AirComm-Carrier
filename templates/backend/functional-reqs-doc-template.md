
# Functional Requirements Document

> Resolver instruction: Before producing final output, resolve `{{defaultClientId}}` from `config/standards-resolution-policy.json` (`defaultClientId`). If missing, fall back to `config/client-profiles.json` (`defaultClientId`). Replace all `{{defaultClientId}}` tokens with the resolved value.

## {Feature Name} — {Channel/Module}

### {{defaultClientId}} Modernization

| Field       | Value                                    |
|-------------|------------------------------------------|
| Application | {{defaultClientId}} (Modernization)              |
| Channel     | {Channel — e.g., REO, Foreclosure, CWCOT, All} |
| Version     | {Version — e.g., 1.0}                    |
| Date        | {YYYY-MM-DD}                             |
| Status      | {Draft / In Review / Approved}           |
| Author      | {Author Name}                            |
| Audience    | Product Team, Development Team, QA Team  |

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Process Overview](#2-process-overview)
3. [Roles & Permissions](#3-roles--permissions)
4. [Preconditions & Task Triggers](#4-preconditions--task-triggers)
5. [System Overview](#5-system-overview)
6. [Functional Requirements](#6-functional-requirements)
7. [Prepopulating Data](#7-prepopulating-data)
8. [Inputs & Field Rules](#8-inputs--field-rules)
9. [Use Cases / User Stories](#9-use-cases--user-stories)
10. [Data Requirements](#10-data-requirements)
11. [Interfaces](#11-interfaces)
12. [Post-Action Workflow Behavior](#12-post-action-workflow-behavior)
13. [Asset Status](#13-asset-status)
14. [Task Configuration](#14-task-configuration)
15. [Notifications](#15-notifications)
16. [Task History](#16-task-history)
17. [Non-Functional Requirements](#17-non-functional-requirements)
18. [Acceptance Criteria](#18-acceptance-criteria)
19. [Appendix](#19-appendix)

---

## 1. Introduction

### 1.1 Purpose

{Describe the purpose of this document and the feature it covers. Identify the intended audience (Product, Development, QA, Operations, Compliance) and how the document should be used during the modernization effort.}

### 1.2 Scope

{Describe what this FRD covers — e.g., task triggers, UI behavior, field rules, validations, workflow routing, rejection handling, stored procedure usage, technical dependencies, asset status impact, task configuration, and notifications. State whether content is derived from source documents, gap analysis, or design sessions.}

### 1.3 Business Objectives

{List the business goals this feature supports. Use bullet points for clarity.}

- {Objective 1 — e.g., Verify occupancy status and identify presence of personal property.}
- {Objective 2 — e.g., Ensure adequate documentation via mandatory photos and details.}
- {Objective 3 — e.g., Support review, compliance, and downstream workflows.}
- {Objective 4 — e.g., Prevent unauthorized actions or data loss.}

### 1.4 Overview

{Provide a high-level summary of the feature. Describe what it allows users to do, what business processes it supports, and how it fits within the {{defaultClientId}} platform.}

### 1.5 In Scope / Out of Scope

| In Scope | Out of Scope |
|----------|-------------|
| {Feature or capability included} | {Related feature or capability explicitly excluded} |
| {Feature or capability included} | {Related feature or capability explicitly excluded} |
| {Feature or capability included} | {Related feature or capability explicitly excluded} |
| {Feature or capability included} | {Related feature or capability explicitly excluded} |

---

## 2. Process Overview

{Provide a narrative description of the end-to-end process for this feature. Describe who initiates the process, what upstream events trigger it, the key steps performed, and what happens upon completion. This section gives context before diving into detailed requirements.}

{Example: The task is executed by an Agent after specific upstream tasks complete and defined conditions are met. The Agent reviews relevant data, performs required actions, uploads documents, enters required details, and submits the task. Upon completion, the system routes the task to review or triggers rework flows based on downstream task outcomes.}

---

## 3. Roles & Permissions

{Define all user roles that interact with this feature and their allowed actions.}

| Role | Description | Permissions |
|------|-------------|------------|
| {Role Name — e.g., Agent} | {Brief description of the role} | {List of allowed actions — e.g., Perform evaluation, upload photos, submit task} |
| {Role Name — e.g., Reviewer} | {Brief description} | {Allowed actions — e.g., Review submissions, approve/reject} |
| {Role Name — e.g., Admin / Support User} | {Brief description} | {Allowed actions — e.g., Add, Edit, View, Configure} |
| {Role Name — e.g., Read-Only User} | {Brief description} | {Allowed actions — e.g., View only} |

*Note: User roles will be managed via RBAC model.*

---

## 4. Preconditions & Task Triggers

{Define the conditions that must be met before the feature/task is available, and the specific events that trigger it. This section is critical for task-based features in {{defaultClientId}}.}

### 4.1 Preconditions

{List the prerequisites that must be true before this feature or task can be initiated.}

- {Precondition 1 — e.g., User is logged in with appropriate permissions.}
- {Precondition 2 — e.g., Asset is in an eligible status.}
- {Precondition 3 — e.g., Upstream task has been completed.}

### 4.2 Task Triggers

{Define each scenario that causes this task/feature to be triggered. Be explicit about upstream task, conditions, and asset state.}

| # | Trigger Scenario | Upstream Task / Event | Conditions |
|---|-----------------|----------------------|------------|
| T-1 | {Trigger description} | {Upstream task name — e.g., Initial Occupancy Inspection} | {Conditions — e.g., Occupancy Status = Vacant AND Asset Status ≠ HOLD AND this task not previously completed.} |
| T-2 | {Trigger description} | {Upstream task / event} | {Conditions.} |
| T-3 | {Trigger description} | {Upstream task / event} | {Conditions.} |
| T-4 | {Trigger description} | {Upstream task / event — e.g., Review task rejection} | {Conditions — e.g., Photos insufficient or task rejected.} |

---

## 5. System Overview

### 5.1 High-Level Description

{Describe how the feature is accessed, its main functional areas, and its role within the {{defaultClientId}} platform. List the primary views or modes available to the user.}

- **{View/Mode 1}** — {Brief description of what this view or mode provides.}
- **{View/Mode 2}** — {Brief description of what this view or mode provides.}
- **{View/Mode 3}** — {Brief description of what this view or mode provides.}
- **{View/Mode 4}** — {Brief description of what this view or mode provides.}

### 5.2 Navigation Path

```
{{defaultClientId}} > {Menu} > {Submenu} > {Screen Name}
```

### 5.3 Feature Sections / Components

{Describe how the feature is organized — e.g., collapsible sections, tabs, wizard steps, task panels.}

| # | Section / Component | Purpose |
|---|---------------------|---------|
| 1 | {Section Name} | {Brief purpose description} |
| 2 | {Section Name} | {Brief purpose description} |
| 3 | {Section Name} | {Brief purpose description} |

---

## 6. Functional Requirements

### 6.1 {Screen / View 1 — e.g., Landing Page, List View, Dashboard, Task UI}

#### 6.1.1 Layout

{Describe the layout of this screen — header, primary controls, and overall structure. For task UIs, describe unit designation, status fields, determination fields, media upload areas, action buttons, etc.}

#### 6.1.2 Filters

{If the screen includes filters, describe them here. Remove this section if not applicable.}

| Filter | Type | Behavior |
|--------|------|----------|
| {Filter Name} | {Dropdown / Text input / Date picker / Multi-select} | {Describe filter behavior.} |
| {Filter Name} | {Control Type} | {Describe filter behavior.} |
| **Clear** | Button | Resets all filter fields to default. |
| **Apply** | Button | Applies current filter selections to the grid. |

#### 6.1.3 Grid / Table Columns

{If the screen displays a data grid, define the columns. Remove this section if not applicable.}

| Column | Description |
|--------|-------------|
| (Action) | {Action link — e.g., "View", "Edit"} |
| {Column Name} | {Description of displayed data} |
| {Column Name} | {Description of displayed data} |

#### 6.1.4 Status Tabs / Toggles

{If the screen supports status-based filtering via tabs, define them here. Remove if not applicable.}

| Tab | Description |
|-----|-------------|
| All | Displays all records regardless of status. |
| {Status} (n) | Displays only records with this status; count shown in parentheses. |
| {Status} (n) | Displays only records with this status; count shown in parentheses. |

#### 6.1.5 Pagination

{Describe pagination behavior — rows per page default, "Showing X of Y" display, page navigation. Remove if not applicable.}

#### 6.1.6 Conditional Logic

{Describe dynamic field visibility and behavior based on user selections or data state. This is critical for task-based UIs with conditional mandatory fields.}

| Condition | Behavior |
|-----------|----------|
| {When field X = Value A} | {Fields Y, Z become mandatory and visible.} |
| {When field X = Value B} | {Fields Y, Z are optional / hidden.} |
| {When field X = Value C} | {Specific controls are enabled/disabled.} |

#### 6.1.7 Validation Rules

{Define all validation rules enforced on this screen.}

| # | Rule | Error Message |
|---|------|---------------|
| V-1 | {Validation rule — e.g., Required field must be populated.} | {Error message displayed to user.} |
| V-2 | {Validation rule — e.g., Minimum photo count enforced when condition met.} | {Error message.} |
| V-3 | {Validation rule — e.g., Numeric field must contain valid dollar amount.} | {Error message.} |

#### 6.1.8 Add / Delete Logic

{Describe how users can add or remove items — e.g., photo uploads, table rows, document attachments. Remove if not applicable.}

- {Add behavior — e.g., Users may upload multiple photo files.}
- {Delete behavior — e.g., Users may delete single or multiple photos prior to submission.}
- {Constraints — e.g., File type restrictions, size limits.}

#### 6.1.9 Save / Submit Logic

{Describe the behavior of Save and Submit actions separately.}

| Action | Behavior |
|--------|----------|
| **Save** | {Describe save behavior — e.g., Persists current data without triggering workflow. Validates partial inputs.} |
| **Submit** | {Describe submit behavior — e.g., Validates all inputs, persists data, routes workflow to next task. Validation errors shown in error panel.} |
| **Cancel** | {Describe cancel behavior — e.g., Returns to previous screen, no data persisted.} |

#### 6.1.10 Workflow Integration

{Describe how this feature integrates with the {{defaultClientId}} workflow engine — downstream task creation, rejection/send-back flows, etc.}

- {Workflow behavior 1 — e.g., Upon submission, a Review task is created and assigned to the configured role.}
- {Workflow behavior 2 — e.g., Rejection in review causes send-back to this task with rejection comments displayed.}
- {Workflow behavior 3 — e.g., Approval in review triggers downstream closing tasks.}

#### 6.1.11 Business Rules — {Screen Name}

| # | Rule |
|---|------|
| {ID}-1 | {Business rule description.} |
| {ID}-2 | {Business rule description.} |
| {ID}-3 | {Business rule description.} |

### 6.2 {Screen / View 2 — e.g., Add / Create Form}

#### 6.2.1 {Step 1 — e.g., Entity Selection, Initial Input}

{Describe the entry point and what the user sees first.}

| Field | Type | Required | Behavior |
|-------|------|----------|----------|
| {Field Name} | {Dropdown / Text / Read-only / Date picker / Multi-select / Toggle / File upload} | {Yes (★) / No / Auto / Conditional} | {Describe behavior, auto-population, visibility rules, or options.} |
| {Field Name} | {Control Type} | {Required?} | {Behavior description.} |

**Actions:**
- **Save / Next** — {Describe what Save or Next does.}
- **Cancel** — {Describe cancel behavior.}

#### 6.2.2 {Step 2 — e.g., Configuration Form, Detail Entry}

{Describe the form layout, header summary, and any global fields (e.g., Effective Date).}

##### Header Summary

| Field | Value |
|-------|-------|
| {Field Name} | {Value source — e.g., selected value, auto-populated, NA} |
| {Field Name} | {Value source} |

##### {Global Field — e.g., Effective Date}

| Field | Type | Required | Behavior |
|-------|------|----------|----------|
| {Field Name} | {Control Type} | {Required?} | {Behavior description — e.g., must be today or future date.} |

#### 6.2.3 Section 1 — {Section Name}

| # | Attribute | Control Type | Required | Default | Business Logic |
|---|-----------|-------------|----------|---------|---------------|
| {ID}-1 | {Attribute Name} | {Toggle / Dropdown / Text / Checkbox / Multi-select / File upload} | {Yes (★) / No / Conditional} | {Default value or —} | {Describe behavior, visibility rules, downstream effects, integration triggers.} |
| {ID}-2 | {Attribute Name} | {Control Type} | {Required?} | {Default} | {Business logic description.} |

**{Sub-Section Name} (if applicable):**

{Describe any tabular sub-sections, repeating groups, or nested data entry areas.}

| # | Column | Control Type | Required | Business Logic |
|---|--------|-------------|----------|---------------|
| {ID}-1 | {Column Name} | {Control Type} | {Required?} | {Business logic description.} |
| {ID}-2 | {Column Name} | {Control Type} | {Required?} | {Business logic description.} |
| (Action) | Delete | Icon button | — | Removes the row. |

**Validation Rules — {Section Name}:**

| # | Rule |
|---|------|
| V-{ID}1 | {Validation rule description.} |
| V-{ID}2 | {Validation rule description.} |

#### 6.2.4 Section 2 — {Section Name}

| # | Attribute | Control Type | Required | Default | Business Logic |
|---|-----------|-------------|----------|---------|---------------|
| {ID}-1 | {Attribute Name} | {Control Type} | {Required?} | {Default} | {Business logic description.} |
| {ID}-2 | {Attribute Name} | {Control Type} | {Required?} | {Default} | {Business logic description.} |

**Validation Rules — {Section Name}:**

| # | Rule |
|---|------|
| V-{ID}1 | {Validation rule description.} |
| V-{ID}2 | {Validation rule description.} |

<!-- Repeat Section blocks (6.2.N) for each additional section as needed -->

#### 6.2.N Save / Cancel — {Form Name}

| Action | Behavior |
|--------|----------|
| **Save** | {Describe full save behavior — validation, persistence, status assignment, effective date logic, cleanup of prior records, etc.} |
| **Cancel** | {Describe cancel behavior — e.g., returns to landing page, no data persisted.} |

### 6.3 {Screen / View 3 — e.g., Edit Form}

#### 6.3.1 Entry Point

{Describe how the user enters this screen — e.g., from View screen via Edit button.}

#### 6.3.2 Behavior

| # | Rule |
|---|------|
| E-1 | {Edit behavior rule — e.g., same layout as Add form.} |
| E-2 | {Edit behavior rule — e.g., fields pre-populated with current values.} |
| E-3 | {Edit behavior rule — e.g., header fields read-only.} |
| E-4 | {Edit behavior rule — e.g., new effective date required.} |
| E-5 | {Edit behavior rule — e.g., queued config replacement warning.} |
| E-6 | {Edit behavior rule — e.g., versioning and activation logic.} |
| E-7 | {Edit behavior rule — e.g., all Add-mode validations apply.} |
| E-8 | {Edit behavior rule — e.g., cancel returns to View screen.} |

### 6.4 {Screen / View 4 — e.g., View / Read-Only Detail}

#### 6.4.1 Entry Point

{Describe how the user reaches this screen — e.g., clicking "View" link from landing page grid.}

#### 6.4.2 Layout

{Describe the layout of the read-only view.}

- **{Element}** — {Description — e.g., header bar with status badge.}
- **{Element}** — {Description — e.g., Edit button in top-right.}
- **{Element}** — {Description — e.g., collapsible sections with read-only values.}

#### 6.4.3 Section Display — View Mode

{Describe how section data is rendered in view mode — e.g., label-value pairs.}

#### 6.4.4 Business Rules — View

| # | Rule |
|---|------|
| V-1 | {View rule — e.g., all fields read-only.} |
| V-2 | {View rule — e.g., unconfigured conditional fields hidden.} |
| V-3 | {View rule — e.g., sections collapsible and expanded by default.} |
| V-4 | {View rule — e.g., Edit button visible only for authorized users.} |
| V-5 | {View rule — e.g., status badge color logic.} |

---

## 7. Prepopulating Data

{Define which fields are prepopulated from upstream tasks or system data, and the source of each value. This is especially important for task-based features where data flows from one task to the next.}

| Field | Source Task / System | Behavior |
|-------|---------------------|----------|
| {Field Name} | {Source — e.g., Initial Occupancy Inspection} | {How the value is populated — e.g., Carried forward as read-only.} |
| {Field Name} | {Source — e.g., Asset Master Data} | {Behavior description.} |
| {Field Name} | {Source — e.g., Previous task submission} | {Behavior description.} |

---

## 8. Inputs & Field Rules

{Provide a comprehensive field-level specification for all inputs in this feature. This extended table captures control types, allowed values, mandatory status, validation rules, prepopulation, dynamic visibility, calculated fields, read-only status, data sources, constraints, and display logic.}

| Attribute Name | Category | Input Type | Allowed Values | Mandatory | Validation Rule / Message | Prepopulated | Dynamic Visibility | Calculated | Read-only | Data Source | Constraints | Display Logic |
|---------------|----------|-----------|----------------|-----------|--------------------------|-------------|-------------------|-----------|-----------|------------|------------|---------------|
| {Field Name} | {Category — e.g., Reference, Status, Decision, Value, Media, Details} | {Read-only / Dropdown / Textbox / Multiline Text / File Upload / Toggle / Date picker} | {Allowed values or NA} | {Yes / No / Conditional} | {Validation rule and error message, or NA} | {Yes / No} | {Yes / No} | {Yes / No} | {Yes / No} | {Data source — e.g., User Input, Upstream Task, System Lookup} | {Constraints — e.g., Max 5MB/file, or NA} | {When field is displayed — e.g., Always, If condition = Yes} |
| {Field Name} | {Category} | {Input Type} | {Allowed Values} | {Mandatory} | {Rule / Message} | {Prepopulated} | {Dynamic Visibility} | {Calculated} | {Read-only} | {Data Source} | {Constraints} | {Display Logic} |

---

## 9. Use Cases / User Stories

### UC-1: {Use Case Title — e.g., Add a New Configuration}

| Item | Detail |
|------|--------|
| **Actor** | {User role — e.g., Authorized User} |
| **Precondition** | {What must be true before this use case — e.g., user is logged in with appropriate permissions.} |
| **Trigger** | {What initiates the use case — e.g., user clicks a button.} |

**Steps:**
1. {Step description.}
2. {Step description.}
3. {Step description.}
4. {Step description.}

**Postcondition:** {Expected outcome after successful completion.}

### UC-2: {Use Case Title — e.g., Edit an Existing Record}

| Item | Detail |
|------|--------|
| **Actor** | {User role} |
| **Precondition** | {Precondition description.} |
| **Trigger** | {Trigger description.} |

**Steps:**
1. {Step description.}
2. {Step description.}
3. {Step description.}

**Postcondition:** {Expected outcome.}

### UC-3: {Use Case Title — e.g., View Record Details}

| Item | Detail |
|------|--------|
| **Actor** | {User role} |
| **Precondition** | {Precondition description.} |
| **Trigger** | {Trigger description.} |

**Steps:**
1. {Step description.}
2. {Step description.}

**Postcondition:** {Expected outcome.}

<!-- Add additional use cases (UC-4, UC-5, etc.) as needed -->

---

## 10. Data Requirements

### 10.1 Inputs

| Data | Source | Description |
|------|--------|-------------|
| {Data element} | {Source system or user input} | {Brief description of the data.} |
| {Data element} | {Source} | {Description.} |

### 10.2 Outputs

| Data | Destination | Description |
|------|-------------|-------------|
| {Data element} | {Destination system or API} | {Brief description of what is sent and why.} |
| {Data element} | {Destination} | {Description.} |

### 10.3 Data Retention / Archival

{Describe any data retention, archival, or purge rules. Remove if not applicable.}

### 10.4 Status Lifecycle

{Describe the status transitions for the primary entity managed by this feature.}

```
{Status Diagram — e.g.:}
[New] -> {Status A} -> {Status B} -> {Status C}
                     -> {Status D} (alternate path)
```

| Status | Description |
|--------|-------------|
| {Status Name} | {When and why a record enters this status.} |
| {Status Name} | {Description.} |
| {Status Name} | {Description.} |

---

## 11. Interfaces

### 11.1 APIs — Outbound Integrations

| System | Direction | Data Sent | Trigger |
|--------|-----------|-----------|---------|
| {External System} | Outbound | {List of data elements sent} | {Event that triggers the integration — e.g., on save, on status change.} |
| {External System} | Outbound | {Data elements} | {Trigger.} |

### 11.2 APIs — Internal

| Endpoint Pattern | Method | Description |
|-----------------|--------|-------------|
| /api/{Controller}/{Action} | {GET / POST / PUT / DELETE} | {Brief description of what the endpoint does.} |
| /api/{Controller}/{Action}/{id} | {Method} | {Description.} |

### 11.3 Dependencies

| Dependency | Description |
|------------|-------------|
| {System or Service} | {What it provides to this feature — e.g., dropdown data, validation, workflow triggers.} |
| {System or Service} | {Description.} |

---

## 12. Post-Action Workflow Behavior

{Define what happens after the primary action (e.g., task submission, form save) completes. Describe downstream task creation, routing, rejection/send-back flows, and any cascading effects on other tasks or processes.}

| # | Post-Action | Description |
|---|-------------|-------------|
| PA-1 | {Post-action — e.g., Review task creation} | {Description — e.g., Upon submission, a Review task is created and assigned to the configured reviewer role.} |
| PA-2 | {Post-action — e.g., Rejection send-back} | {Description — e.g., If the review task is rejected, this task is re-opened with rejection comments displayed to the original assignee.} |
| PA-3 | {Post-action — e.g., Downstream task trigger} | {Description — e.g., Upon approval, the next task in the workflow sequence is triggered.} |

---

## 13. Asset Status

{Define how the asset status is affected at each stage of this feature/task lifecycle.}

| Event | Asset Status |
|-------|-------------|
| Task Creation | {Asset status when task is created — e.g., Acquired} |
| Task Submission | {Asset status after task is submitted — e.g., Acquired, Active, Marketing} |
| Task Rejection | {Asset status upon rejection — e.g., unchanged, reverted} |
| {Other Event} | {Asset status.} |

---

## 14. Task Configuration

{Define the task-level configuration parameters. This section applies to task-based features in {{defaultClientId}}.}

| Parameter | Value | Description |
|-----------|-------|-------------|
| Due Date | {Value — e.g., 1 Business Day, 3 Days} | {When the task is due relative to creation.} |
| Warning Date | {Value — e.g., NA, 1 Day before due} | {When a warning is generated. NA if not applicable.} |
| Due Date Type | {Days / Hours / Business Days} | {Unit of the due date.} |
| Warning Date Type | {Days / Hours / Business Days / NA} | {Unit of the warning date.} |
| Ad-hoc | {Yes / No} | {Whether the task can be triggered as an ad-hoc task.} |
| Skip | {Yes / No} | {Whether the task can be skipped.} |
| Postpone | {Yes / No} | {Whether the task can be postponed.} |
| Assigned Role | {Role Name} | {Default role assigned to this task.} |
| QC Required | {Yes / No} | {Whether the task requires QC approval.} |

---

## 15. Notifications

{Define all email notifications triggered by this feature. Include task creation notifications, submission notifications, and any event-driven notifications.}

### 15.1 Task Creation Notification

{Notification sent when the task is triggered/created.}

| Parameter | Value |
|-----------|-------|
| **Trigger** | {Event — e.g., Task is created and assigned.} |
| **To** | {Recipient — e.g., Default role for the task mapped against the user in asset contact.} |
| **CC** | {CC recipients or NA.} |
| **Subject** | `[Asset ID] - [Task Name] assigned` |

**Body:**

> Hi [Assigned User First Name],
>
> You have been assigned [Task Name] (hyperlink) for [Address]. Please log in to re.{{defaultClientId}} via the {{defaultClientId}} app hub (hyperlink) and complete by [Time and Date].
>
> If you need assistance or have any questions, please contact us at {support email} or {support phone}.
>
> Thank you

| # | Rule |
|---|------|
| N-1 | Time and date in the email should be retrieved from task configuration for each task (Due Date). |

### 15.2 Task Submission Notifications

{Notifications sent after the task is submitted/completed.}

#### Email 1 — Assignee Confirmation

| Parameter | Value |
|-----------|-------|
| **Trigger** | {Event — e.g., Task is submitted.} |
| **To** | {Recipient — e.g., Assigned User.} |
| **CC** | {CC — e.g., User who completed the task (if different than assigned user).} |
| **Subject** | `[Asset ID] - [Task Name] submitted` |

**Body:**

> Hi [Assigned User First Name],
>
> Your task [Task Name] has been successfully submitted.
>
> If you have any questions, please contact us at {support email} or {support phone}.
>
> Thank you
> {{defaultClientId}}

#### Email 2 — Manager Notification

| Parameter | Value |
|-----------|-------|
| **Trigger** | {Event — e.g., Task is submitted.} |
| **To** | {Recipient — e.g., Asset Manager user.} |
| **CC** | {CC — e.g., User who completed the task.} |
| **Subject** | `[Asset ID] - [Task Name] submitted` |

**Body:**

> Hi [Asset Manager User First Name],
>
> This task [Task Name] has been successfully submitted by [Completed User First Name and Last Name].
>
> If you have any questions, please contact us at {support email} or {support phone}.
>
> Thank you
> {{defaultClientId}}

<!-- Add additional email constructs (Email 3, Email 4, etc.) as needed -->

### 15.3 Notification Rules

| # | Rule |
|---|------|
| NR-1 | **User Preference:** Account for the notification preference in the settings of the assigned user under the task configuration. If preference = Yes, send email notifications. If preference = No, do not send email. |
| NR-2 | **Same User Scenario:** When assignee and user who completed the task are the same — if preference = Yes, send notification to assignee. If preference = No, do not send. |
| NR-3 | **Different User Scenario:** When assignee and user who completed the task are different — if preference = Yes, send notification to assignee with completed user in CC. If preference = No, do NOT send email to the assignee; only send email to the completed user. |
| NR-4 | **Communication Tab:** All emails sent must be reflected in the Communication tab of the asset. |

---

## 16. Task History

{Describe how completed tasks are recorded and displayed in the task history.}

| # | Rule |
|---|------|
| TH-1 | {Task history rule — e.g., Upon successful submission, the system performs front-end validation. If validation is successful, the task becomes viewable in read-only mode within the Task History section.} |
| TH-2 | {Task history rule — e.g., Task history displays all submitted data including uploaded files.} |
| TH-3 | {Task history rule — e.g., Rejection comments from review tasks are visible in task history.} |

---

## 17. Non-Functional Requirements

### 17.1 Performance

| # | Requirement |
|---|-------------|
| NF-1 | {Performance requirement — e.g., page load time, response time for specific operations.} |
| NF-2 | {Performance requirement — e.g., photo upload performance and timeout handling.} |
| NF-3 | {Performance requirement.} |

### 17.2 Security

| # | Requirement |
|---|-------------|
| NF-{N} | Only authenticated users with the appropriate role can access this feature. |
| NF-{N} | Write operations require write-level permissions. Read-only users can only access View screens. |
| NF-{N} | All API endpoints must validate anti-forgery tokens for POST operations. |
| NF-{N} | Input fields must be sanitized to prevent script injection (XSS). |
| NF-{N} | Audit trail: every create, update, and status change must log the user ID, timestamp, and action performed. |
| NF-{N} | {Additional security requirement — e.g., file scanning, encryption, etc.} |

### 17.3 Usability

| # | Requirement |
|---|-------------|
| NF-{N} | {Usability requirement — e.g., visual indicators for required fields, inline validation, breadcrumb navigation.} |
| NF-{N} | The UI must be responsive and consistent with the {{defaultClientId}} design system. |
| NF-{N} | {Usability requirement.} |

### 17.4 Reliability

| # | Requirement |
|---|-------------|
| NF-{N} | If a save operation fails, no partial data should be persisted (transaction rollback). |
| NF-{N} | {Reliability requirement — e.g., scheduled job activation, atomic uploads, async/retry mechanisms.} |

---

## 18. Acceptance Criteria

### 18.1 {Screen / View 1 — e.g., Landing Page}

| # | Criteria |
|---|---------|
| AC-1 | {Acceptance criterion — e.g., page displays all records with correct column values.} |
| AC-2 | {Acceptance criterion — e.g., filtering returns correct results.} |
| AC-3 | {Acceptance criterion.} |

### 18.2 {Screen / View 2 — e.g., Add / Create}

| # | Criteria |
|---|---------|
| AC-{N} | {Acceptance criterion — e.g., required field validation prevents submission.} |
| AC-{N} | {Acceptance criterion — e.g., conditional fields show/hide correctly.} |
| AC-{N} | {Acceptance criterion.} |

### 18.3 {Screen / View 3 — e.g., Edit}

| # | Criteria |
|---|---------|
| AC-{N} | {Acceptance criterion — e.g., form pre-populates all current values.} |
| AC-{N} | {Acceptance criterion.} |

### 18.4 {Screen / View 4 — e.g., View}

| # | Criteria |
|---|---------|
| AC-{N} | {Acceptance criterion — e.g., all values displayed as read-only.} |
| AC-{N} | {Acceptance criterion.} |

### 18.5 Integrations

| # | Criteria |
|---|---------|
| AC-{N} | {Integration acceptance criterion — e.g., on save, data is sent to downstream system.} |
| AC-{N} | {Integration acceptance criterion.} |

### 18.6 Workflow & Notifications

| # | Criteria |
|---|---------|
| AC-{N} | {Workflow criterion — e.g., task submission creates the correct downstream review task.} |
| AC-{N} | {Notification criterion — e.g., email is sent to assignee upon task creation.} |
| AC-{N} | {Task history criterion — e.g., completed task is visible in read-only mode in Task History.} |

---

## 19. Appendix

### 19.1 Attribute Inventory

{Complete attribute list for the feature. Include all configurable or data-entry fields.}

| Section | Attribute | Control Type | Required | Mandatory |
|---------|-----------|-------------|----------|-----------|
| {Section} | {Attribute Name} | {Control Type} | {Y/N} | {Y / N / NA / Conditional} |
| {Section} | {Attribute Name} | {Control Type} | {Y/N} | {Y / N / NA / Conditional} |

### 19.2 Attributes Excluded from 2.0

{List any legacy attributes intentionally excluded from the modernization.}

| Attribute | Section | Reason |
|-----------|---------|--------|
| {Attribute Name} | {Section} | {Reason for exclusion.} |
| {Attribute Name} | {Section} | {Reason for exclusion.} |

### 19.3 Stored Procedures & Technical Dependencies

{List any stored procedures, database objects, or technical dependencies relevant to this feature. Remove if not applicable.}

| Object | Type | Description |
|--------|------|-------------|
| {SP/Object Name} | {Stored Procedure / View / Function / Job} | {What it does and when it is invoked.} |
| {SP/Object Name} | {Type} | {Description.} |

### 19.4 Glossary

{Define key terms, abbreviations, and acronyms used in this document. Remove if not needed.}

| Term | Definition |
|------|-----------|
| {Term / Abbreviation} | {Definition.} |
| {Term / Abbreviation} | {Definition.} |

### 19.5 Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| {1.0} | {YYYY-MM-DD} | {Author} | {Initial draft.} |
| {1.1} | {YYYY-MM-DD} | {Author} | {Description of changes.} |

---

*End of Document*
