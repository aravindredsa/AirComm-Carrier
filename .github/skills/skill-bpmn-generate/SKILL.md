---
name: bpmn-generate
description: Deterministically generate Camunda 8 BPMN XML from BRD using strict grounding, staged derivation, and zero hallucination policy for defaultClientId.
argument-hint: Use ONLY when generating BPMN from BRD or workflow requirements in defaultClientId
context: Camunda 8 (Zeebe), defaultClientId microservices, async/event-driven orchestration
user-invocable: true
---

# CORE PRINCIPLE (NON-NEGOTIABLE)

You are NOT a BPMN generator.
You are a REQUIREMENT-TO-FLOW DERIVER that produces BPMN as a final transformation.

DO NOT jump to BPMN.

---

# GROUNDING RULE (STRICT)

* Model ONLY what is explicitly stated in the BRD.
* Every BPMN element MUST map to an BRD statement.
* If mapping is not possible → DO NOT CREATE the element.
* If critical information is missing → STOP and ASK.

---

# STOP CONDITIONS (MANDATORY)

DO NOT PROCEED if any of the following are unclear or missing:

* flow sequence ambiguity
* branching condition missing
* async vs sync unclear
* termination condition missing

Ask concise clarification questions instead.

---

# EXECUTION

---

## STEP 0.5 — KNOWLEDGE SOURCE PRIORITY (MANDATORY)

When a question or uncertainty arises, consult sources in THIS order and
stop at the first one that resolves it:

1. **Workspace exemplars** (`.bpmn` files in repo root) — house style,
   element kinds, DI layout, fan idiom.
2. **Repo skills** (`.github/skills/**/SKILL.md`) — non-negotiable
   conventions and rules.
3. **Camunda Docs MCP server** (`search_camunda_knowledge_sources`) —
   ONLY for: FEEL syntax, Zeebe extension element shapes, Camunda 8
   semantics on edge cases, version-specific feature checks. Do NOT
   use it to override repo conventions.
4. **General model knowledge** — last resort.

If step 1 or 2 already answers the question, do not call the MCP server.
The MCP is rate-limited (40/hr per user) and is a doc-search tool, not
a validator.

---

## STEP 1 — INGEST

* Read BRD
* Read standards_pdf (if available)
* Scan workspace for existing BPMN:
  - If found → ASK: reuse / diff / replace
  - NEVER create duplicates

---

## STEP 1.5 — STRUCTURED EXTRACTION (MANDATORY)

Extract ONLY facts from BRD (NO interpretation):

### OUTPUT:

**TRIGGERS**
- Explicit start conditions only

**ACTORS / SYSTEMS**
- Only named systems/services

**STEPS (ORDERED)**
- One line per step
- Each step MUST reference a BRD sentence

**DECISIONS**
- ONLY if explicitly stated in BRD
- Include exact condition wording

**INTERACTIONS**
- Sync or async ONLY if explicitly stated

**TERMINATION**
- Explicit end states only

**UNKNOWNS**
- Missing or ambiguous items

---

## STEP 1.6 — VALIDATION GATE

IF UNKNOWNS not empty:

* ASK questions
* DO NOT PROCEED

---

## STEP 1.7 — DESIGN-DECISION CHECKPOINT (MANDATORY, BUT BOUNDED)

BEFORE writing any flow or XML, ask the user upfront IF AND ONLY IF the
decision falls in one of the categories below. Batch all questions into
ONE message. Do not ask once per element; do not ask in follow-ups.

### Categories worth a question (ask)

* **Ambiguous BRD wording** that materially changes the model
  (e.g. "trigger task X when no for rebuttal required" — semantically
  odd; confirm Yes vs No).
* **Hard-to-reverse structural choices** the BRD does not pin down:
  - exclusive vs inclusive gateway when multiple post-actions are listed
    without explicit "AND/OR" semantics,
  - whether a struck-through / "not in defaultClientId yet" item should still
    appear as a placeholder branch,
  - whether to model a sub-process or keep flat.
* **Cross-cutting policy** the BRD does not state but the orchestration
  needs (e.g. correlation key when not obviously `assetId`).
* **DI exemplar selection** when no workspace `.bpmn` matches within
  ±1 branch of the same gateway shape.

### Categories NOT worth a question (do not ask — apply convention)

* Anything covered by an existing SKILL rule (e.g. fan-out is
  `messagePublisher` throw — STEP 3.6).
* Workspace-convention omissions (SLA fields, Adhoc/Skip/Postpone, SP
  names, page paths, UI validation matrix — never modeled).
* Standard defaultClientId element shapes (`zeebe:userTask` + execution
  listener, taskHeaders.taskCode, ioMapping payload pattern).
* DI cosmetics (label widths, ±20 px shifts).
* Anything you can resolve by reading another `.bpmn` exemplar.

### Format of the checkpoint message

A single bulleted list of questions, each with:

* the BRD sentence or ambiguity in one line,
* 2–3 named options,
* a recommended default (so the user can reply "go with defaults").

If there are zero questions in the worth-asking categories: skip this
step silently and proceed.

---

## STEP 2 — FLOW DERIVATION (MANDATORY)

Construct a deterministic flow representation.

### RULES:

* Use numbered sequence
* Explicit transitions only
* No BPMN constructs
* No assumptions

### FORMAT:

1 → 2 → 3  
3 → (if condition X) → 4  
3 → (if condition Y) → END  

---

## STEP 2.5 — FLOW VALIDATION

Verify:

* No gaps in sequence
* All decisions have conditions
* End states defined

IF NOT → STOP and ASK

---

## STEP 3 — BPMN MAPPING (CONTROLLED TRANSFORMATION)

Transform flow → BPMN elements

### ALLOWED ELEMENTS:

* Start Event (required)
* Service Task (default)
* Exclusive Gateway (ONLY if decision exists)
* End Event

### STRICT RULES:

* NO parallel gateways unless explicitly stated
* NO timers unless explicitly stated
* NO retries unless explicitly stated
* NO error boundaries unless explicitly stated
* NO event-based gateways unless explicitly stated

---

## STEP 3.5 — TASK RULE (defaultClientId)

For each service task:

* MUST include `<zeebe:taskDefinition>`
* type = capability-based (NOT service name)
* MUST NOT include:
  - SQL / SP names
  - URLs
  - secrets
  - implementation details

---

## STEP 3.6 — POST-ACTION FAN-OUT IDIOM (defaultClientId, NON-NEGOTIABLE)

Every branch off a post-completion fan (inclusive/exclusive gateway after
the user task) MUST be modeled as an `intermediateThrowEvent` with
`<zeebe:taskDefinition type="messagePublisher" />` and a corresponding
global `<bpmn:message>` (correlationKey `=assetId`).

This applies to BOTH:

* downstream task triggers (e.g. "trigger Order Eviction"), AND
* state mutations owned by another bounded context (e.g. "asset status
  changes to Pending Listing" → publish `asset_status_update_request`,
  do NOT model as a local service task).

### Rationale

* Bounded-context ownership — the data owner decides its own state.
* Async-safe orchestration (matches workspace exemplars
  `eviction-v1.bpmn`, `auction_result_review.bpmn`,
  `cwcot_approve_sign_hud.bpmn`).
* Visual uniformity — one shape kind per fan, one x column for throws.

### When a service task IS allowed in the fan

Only for synchronous, orchestrator-owned computation that has no
natural owner microservice. Default answer is **message throw**;
service-task usage requires an explicit one-line justification in the
DESIGN RATIONALE.

### Self-check before emitting any non-throw element in a fan

Ask: *"Who owns this state or action?"* If the answer is anything other
than "this orchestrator," it MUST be a `messagePublisher` throw.

---

## STEP 4 — INTERACTION MODELING

* Use messages ONLY if explicitly required
* Ensure:
  - messageRef exists
  - properly linked

---

## STEP 5 — XML GENERATION (CRITICAL)

Generate FULL Camunda 8 BPMN XML:

### REQUIRED:

* `<bpmn:definitions>`
* namespaces:
  - bpmn
  - zeebe
  - xsi

### VALIDATION:

* XML must be WELL-FORMED
* All IDs:
  - present
  - unique
* All references resolvable
* No orphan elements

---

## STEP 5.5 — TRACEABILITY CHECK (MANDATORY)

Create mapping:

| Element ID | Element Type | BRD Evidence |

RULE:

* If ANY element has no BRD evidence:
  - REMOVE it
  - OR mark as [ASSUMPTION]

---

## STEP 5.6 — MINIMAL FALLBACK (ONLY IF FORCED)

If BRD is incomplete BUT user insists:

Generate:

* 1 start event
* 1 service task (generic)
* 1 end event

Ensure valid XML.

---

## STEP 6 — OUTPUT (STRICT FORMAT)

Return EXACTLY:

---

# BPMN XML

```xml id="gen3"
<valid camunda 8 bpmn xml>