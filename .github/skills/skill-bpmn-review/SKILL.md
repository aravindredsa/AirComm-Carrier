---

name: bpmn-review
description: Review and correct Camunda 8 BPMN XML for structural validity, correctness, and defaultClientId compliance.
argument-hint: Use when reviewing or fixing BPMN XML for correctness and modeler compatibility
context: Camunda 8 schema validation, Zeebe workflows, defaultClientId standards
user-invocable: true

---

# EXECUTION

## STEP 1 — PARSE

* Read BPMN XML
* Load standards_pdf

---

## STEP 1.5 — GROUNDING CHECK (MANDATORY — run before any FIX step)

This step is NOT optional and NOT a summary. You must literally walk
every element listed below and produce a per-element citation. A review
that says "no fixes needed" without this walk is invalid.

For each gateway, join, end event, default flow, timer, error boundary,
retry, message, intermediate throw/catch event, sequence-flow condition:

* State the element id.
* Quote (or paraphrase + cite) the BRD sentence that requires it.
* If none → flag as HALLUCINATION.
* Action: REMOVE the element, OR (if removal would break the model —
  e.g. an engine-required `default` flow on an inclusive gateway)
  record it under GROUNDING NOTES in STEP 10 output as
  `kept-pending-confirmation` with the engine reason.

Output of this step (the per-element table) MUST appear in the chat
reply. Reviews that omit it are rejected.

---

## STEP 2 — STRUCTURE FIX

Ensure:

* XML well-formed
* `<bpmn:definitions>` present
* namespaces valid (bpmn, zeebe, xsi)

IF FAIL → FIX immediately

---

## STEP 3 — ID FIX

* All elements must have IDs
* IDs must be unique

IF FAIL → FIX

---

## STEP 4 — PROCESS FIX

* Ensure:

  * start event exists
  * end event exists
  * no orphan nodes

IF FAIL → FIX

---

## STEP 5 — TASK FIX

For each service task:

* ensure `<zeebe:taskDefinition>` exists
* enforce:

  * type = capability-based
  * no service coupling

IF FAIL → FIX

---

## STEP 6 — FLOW FIX

* all sequence flows connected
* no dead paths
* gateways valid

IF FAIL → FIX

---

## STEP 7 — MESSAGE FIX

* messages defined globally if used
* messageRef valid

IF FAIL → FIX

---

## STEP 8 — defaultClientId RULE FIX

* remove service-implementation details from tasks (no SP names, SQL, URLs, secrets)
* routing conditions on sequence flows ARE permitted (and required when the BRD states conditions)
* enforce async-safe orchestration
* ensure external worker pattern

IF FAIL → FIX

---

## STEP 9 — MODELER SIMULATION

Assume BPMN opened in Camunda Modeler:

* no schema errors
* diagram renders
* no missing references

IF FAIL → FIX

---

## STEP 10 — OUTPUT

Return EXACTLY these sections, in order:

# BPMN XML

```xml id="rev2"
<corrected camunda 8 bpmn xml>
```

# FIXES APPLIED

* Bullet list of structural / ID / flow / task / message / defaultClientId fixes.
* Empty list allowed if no fixes were needed.

# GROUNDING NOTES

* List every element flagged by STEP 1.5 as HALLUCINATION.
* For each: element id, BRD evidence missing, action taken (removed / kept-pending-confirmation).
* Empty list allowed if all elements are BRD-grounded.
