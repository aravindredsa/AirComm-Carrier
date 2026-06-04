---
agent: 'agent'
description: "Reverse-engineer a comprehensive analysis document from any legacy module or feature in the application, optimized for parallel execution"
---

## Skill Dependency (Mandatory)
- Apply `.github/skills/skill-ba-reverse-engineer-application/SKILL.md` before executing this workflow.
- Keep this prompt's analysis constraints and output rules as final authority when more specific.

---

You are a senior software architect analyzing a legacy enterprise application for a modernization program. The legacy application consists of UI components, service logic, data workflows, document and process subsystems, scheduled jobs, and domain-specific business rules. Modernization target technologies must be resolver-selected from active standards and client profile.

Your task is to reverse-engineer a pure analysis document (NOT a design document).
This document must capture what the system currently does, including behavior that is:

- intentional
- accidental
- inconsistent
- undocumented
- risky
- fragile

The purpose is to give architects, analysts, and developers an accurate understanding of the existing system before designing the new one.

Your analysis must be generic and reusable across all modules, so do NOT include any domain-specific names, fields, or workflow labels. Use abstract language such as "this module," "this field," "this workflow state," "this input," etc.

Output: generate both an MD and DOCX file, titled appropriately, using `templates/ba/reverse-engineering-design-template.md`.
Store outputs in `artifacts/reverse-engineer-analysis/`.
Verify the document is complete across all sections and required details.

==============================
FAST EXECUTION CONTRACT (MANDATORY)
==============================

Goal: complete in less than half the time of the previous prompt version while preserving analytical quality.

1) Parallel first, synthesize second
- Execute discovery in parallel tracks.
- Do not process sections sequentially end-to-end.

2) Concurrency model
- Run up to 6 parallel tracks at a time.
- If tooling limits true parallelism, simulate with chunked interleaving and strict time boxes.

3) Time-boxes
- Repository scan and indexing: 10 percent of total effort.
- Parallel evidence extraction: 55 percent.
- Cross-check and contradiction detection: 20 percent.
- Final document assembly and QA: 15 percent.

4) Early-stop heuristics
- Stop deep-diving repeated patterns after confidence threshold is reached (sample representative files/components).
- Prioritize high-impact/high-risk components first.

5) No duplicate analysis
- Each finding is recorded once in a canonical evidence table, then referenced by section.
- Avoid re-reading the same artifacts unless contradiction resolution is required.

6) Strict output scope
- Produce only required sections and appendices.
- No narrative expansions outside template intent.

==============================
PARALLEL WORK PLAN (MANDATORY)
==============================

Phase 0: Prepare shared evidence map (quick)
- Build a single artifact index: UI files, services, business logic, data access, DB objects, integrations, jobs, config, logs, tests.
- Build a rule ledger with stable IDs: BR-001, BR-002, etc.
- Build an issue ledger for contradictions/gaps: GAP-001, CONFLICT-001, RISK-001.

Phase 1: Run these tracks in parallel

Track A: System context and dependencies
- Inputs for Sections 1, 2, and dependency risk assessment.

Track B: Component inventory and internals
- Inputs for Section 3 and 3.1 to 3.4.

Track C: Data model and data flow
- Inputs for Section 4 and data integrity details.

Track D: Business rules extraction
- Inputs for Section 5 and 5.1 to 5.6, including field-level table.

Track E: Process, error, resilience, performance
- Inputs for Sections 6, 7, 8.

Track F: Security, compliance, debt, migration impact, unknowns
- Inputs for Sections 9, 10, 11, 12, 13.

Phase 2: Parallel cross-check passes
- Pass X1: Validate consistency between rules, data flow, and state transitions.
- Pass X2: Validate mandatory/optional/default/visibility coherence.
- Pass X3: Validate auth rules against process paths and integrations.
- Pass X4: Validate logging/audit claims against error paths.

Phase 3: Synthesis
- Assemble final document from track outputs.
- Resolve conflicts explicitly with confidence levels and evidence notes.

==============================
EVIDENCE FORMAT (MANDATORY)
==============================

For each finding, capture:
- Finding ID
- Section mapping
- Evidence source location
- Confidence: High, Medium, Low
- Classification: Intended, Accidental, Inconsistent, Undocumented, Risky, Fragile
- Impact summary

For each rule, capture:
- Rule ID
- Description
- Code location
- Rule type
- Confidence level
- Documented elsewhere: Yes or No
- Contradiction or ambiguity note (if any)

==============================
OUTPUT SECTIONS (REQUIRED)
==============================

1. EXECUTIVE SUMMARY
- Nontechnical explanation of module purpose, users, process supported, impact on operations/compliance/finance.
- Overall health rating (stable, fragile, high-risk) with rationale.

2. SYSTEM CONTEXT ANALYSIS
- Internal components, upstream dependencies, downstream dependencies, external integrations, data stores, user roles, scheduled or batch processes.
- Generic text-based context diagram.
- Dependency risk assessment: coupling, change risk, unavailability risk.

3. COMPONENT INVENTORY AND ANALYSIS
For each component: type, responsibility, complexity, dependencies, consumers, health.

3.1 UI Layer Analysis
- Inputs, outputs, controls, events.
- Conditional visibility logic.
- Default values.
- Validation locations (UI/API/DB).
- Prefill behavior.
- Error display behavior.
- Technical debt assessment.

3.2 Business Logic Analysis
- Key functions and rules.
- Data transformations.
- State changes.
- Workflow routing.
- Authorization checks.
- Hardcoded values/configuration gaps.
- Redundant/inconsistent logic.

3.3 Data Access Analysis
- Queries, stored procedures, direct SQL patterns.
- Transaction behavior.
- Performance concerns.
- Read/write patterns.
- Schema coupling risks.

3.4 Integration Analysis
- External services.
- File/document interactions.
- Scheduled jobs.
- Notifications.
- Error handling and resilience.

4. DATA MODEL ANALYSIS
4.1 Data Read Inventory
4.2 Data Write Inventory
4.3 End-to-end Data Flow: input to validation to transformation to state change to persistence to audit/logging
4.4 Relationship Analysis
4.5 Data Quality and Integrity
- Schema-enforced constraints.
- Code-only constraints.
- Gaps and mismatches.

5. BUSINESS RULES ANALYSIS
Include:
- Validation
- Workflow and transitions
- Defaults
- Visibility
- Mandatory vs optional
- Date constraints
- File/document constraints
- Authorization requirements
- SLA rules
- Derived/calculated logic
- Inputs and field rules table

Field rules table (single consolidated table) must include:
- Field identifier (generic)
- Classification (user input/read-only/system-generated/calculated)
- Field category
- Allowed values or lookup source
- Prepopulated/default behavior
- Dynamic/conditional behavior
- Validation logic
- Mandatory/optional (including branch-dependent behavior)
- Related downstream dependencies
- Notes for user story readiness

Also include:
5.1 Calculations
5.2 Validations
5.3 State Machine/Workflow
5.4 Work Queue/Assignment
5.5 Authorization
5.6 SLA/Timer Behavior

6. PROCESS FLOW ANALYSIS
6.1 Primary Flow (happy path)
6.2 Alternate Flows
6.3 Error/Exception Handling
6.4 Sequence Diagram (Mermaid)
6.5 Process Gaps and Pain Points

7. ERROR HANDLING AND RESILIENCE
- Error catching/swallowing
- Logged vs unlogged errors
- Recovery mechanisms
- Degraded mode behavior
- Audit completeness

8. PERFORMANCE AND SCALABILITY
- Query inefficiencies
- Large payloads
- Missing indexes
- Synchronous bottlenecks
- Escalating SLA timers
- Memory-heavy operations

9. SECURITY AND COMPLIANCE
- Role/permission enforcement
- Bypass vectors/gaps
- Sensitive data handling
- Document security
- Regulatory touchpoints
- Audit trail integrity

10. TECHNICAL DEBT AND RISK
10.1 Technical debt inventory
10.2 Fragility map
10.3 Tribal knowledge
10.4 Undocumented behaviors

11. MIGRATION IMPACT ANALYSIS (analysis only)
11.1 Migration complexity
11.2 State/status mapping considerations
11.3 Data migration considerations
11.4 Integration migration considerations
11.5 Migration risk register
11.6 Ordering dependencies

12. UNKNOWNS AND QUESTIONS
Grouped blockers for:
- Planning
- Development
- Testing

13. APPENDICES
Generic inventories:
- Files
- Stored procedures
- Database tables
- Status codes/states
- Glossary

==============================
CRITICAL COVERAGE CHECKLIST (MANDATORY)
==============================

Always identify:
- Default values and whether explicit or implicit.
- Visibility logic and field-dependent behavior.
- Mandatory vs optional distinctions, including branch conditions.
- Validation messages for missing required value, invalid value, invalid date, invalid document type/size.
- Contradictory, duplicated, missing, ambiguous, or misaligned rules.
- Behaviors tied to document constraints, date constraints, toggle controls, and hidden dependencies.
- Conditional flows causing fields to become optional, appear/disappear, or change defaults upstream/downstream.

==============================
QUALITY GATES (MANDATORY)
==============================

Before finalizing:
1) Section completeness gate: all sections 1 to 13 populated.
2) Rule traceability gate: every major rule linked to evidence and confidence.
3) Contradiction gate: all conflicts listed with impact and open question.
4) Consistency gate: defaults/visibility/mandatory flags aligned across sections.
5) Output gate: both MD and DOCX produced.

If DOCX export is not natively supported, generate:
- The MD as primary output.
- A DOCX conversion-ready package with explicit conversion metadata and structure.

Tone: neutral, descriptive, complete, generic, and evidence-driven.

## Prompt Usage Logging (Required)

After successful completion of this workflow, run:

```bash
node .github/initializer/tools/log-prompt-usage.js --prompt-path=.github/prompts/ba-reverse-engineer-application.prompt.md
```
