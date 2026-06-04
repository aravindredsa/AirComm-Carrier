---
description: "Use when: generate a Camunda 8 BPMN workflow from business requirements (primarily Post Action / Tasks Triggered), FRD, and LLD documents. Trigger phrases: generate BPMN from requirement doc, build workflow from post action, convert BRD/FRD/LLD to Camunda BPMN."
---

## Skill Dependency (Mandatory)
- Apply `.github/skills/skill-bpmn-workflow-generation/SKILL.md` before executing this workflow.
- Keep this prompt's XML, naming, and diagram-layout rules as final authority when more specific.

Generate a Camunda 8 BPMN workflow from requirement context.

Attachment-first input handling:
- If the user attached one or more requirement files in chat, treat attachments as the primary input source.
- Prefer this order when multiple attachments exist: BRD/Requirement document -> FRD -> LLD.
- Extract workflow logic primarily from sections named Post Action, Tasks Triggered, Trigger Logic, Preconditions, and Task Characteristics.
- If an attachment is binary (for example .docx or .pdf), extract readable text from it first and continue.
- If extraction is partial, continue with available text and list gaps explicitly in assumptions.
- If both attachment content and typed prompt text are provided, use attachments as source of truth and typed text as supplemental context.

Requirement input:
- Primary source: business requirement document (especially Post Action / Tasks Triggered)
- Secondary sources: FRD and LLD for trigger conditions, payload fields, and message names
- Fallback source: user story text if requirement documents are incomplete

Workspace references:
- samples/requirements
- samples/bpmn
- templates/bpmn/generate-bpmn-workflow-from-story.template.md
- Correlate sample requirement and BPMN files by shared names/keywords (for example Accept Property Assignment -> reo_accept_property_assignment_process 2.bpmn)

Requirements:
1. Use Camunda 8 BPMN 2.0 XML output.
2. Follow sample BPMN style from samples/bpmn:
   - Model one primary User Task for the current business task.
   - Model downstream task triggers using Intermediate Throw Events with message publisher semantics.
   - Route to downstream triggers through a gateway after the primary user task.
3. Extraction precedence:
   - First: Post Action, Tasks Triggered, Trigger Logic sections.
   - Second: Preconditions and Task Characteristics.
   - Third: FRD and LLD details for condition/payload/message refinement.
4. Gateway usage:
   - Inclusive Gateway for parallel independent triggers.
   - Exclusive Gateway for mutually exclusive decisions.
5. Add loop-back only when requirement text explicitly indicates re-trigger/repeat behavior.
6. Keep workflow variables lightweight (routing/correlation only).
7. Keep expressions deterministic and derived from requirement conditions.
8. Avoid embedding implementation/business logic beyond routing conditions.

Execution extension conventions:
- On primary user task include zeebe:userTask and userTaskCreation listener.
- On trigger throw events include:
  - zeebe:taskDefinition type="messagePublisher"
  - zeebe:ioMapping with message and assetId when inferable
  - bpmn:messageEventDefinition

Naming conventions for generated BPMN:
- Process id: lower_snake_case, prefer suffix _process
- Process name: business-readable title case
- Primary user task id/name based on requirement task title
- Trigger throw event names should match business task labels directly (for example Review Repair Work, Post-Repair Inspection); do not prefix with "Trigger"
- Output file name: derive from the primary dropped/attached requirement file name (not from sample names)
- File name normalization: replace spaces and hyphens with underscores, remove extension, lowercase, append .bpmn
- Example: Accept Property Assignment.docx -> accept_property_assignment.bpmn
- If multiple files are attached, use the primary requirement file selected by precedence (BRD/Requirement -> FRD -> LLD)
- Collision handling in artifacts/bpmn:
   - Detect trailing numeric token in normalized stem and increment it (for example close_eviction_1.bpmn -> close_eviction_2.bpmn)
   - If no trailing numeric token exists, append _2 (for example accept_property_assignment.bpmn -> accept_property_assignment_2.bpmn)

Output location requirement:
- Final BPMN output file path must be artifacts/bpmn/<suggested-file-name>.bpmn
- Suggested file name must follow the dropped-file-derived naming rule above

Output format:
1. Requirement extraction summary (include which attached file(s) were used)
2. Explicit assumptions/gaps
3. Suggested artifacts/bpmn output file path
4. Trigger mapping table used for BPMN construction
5. Write the BPMN XML directly to artifacts/bpmn/<filename>.bpmn using the file-write tool. DO NOT echo or print the XML in the chat response — the file write IS the delivery. Confirm the file was written with a single line: "Written to artifacts/bpmn/<filename>.bpmn ✅"
6. Validation checklist (sample parity + standards parity)

XML generation rules:
- Include required namespaces: bpmn, bpmndi, dc, di, zeebe.
- Include bpmn:process, sequenceFlow, and BPMNDiagram/BPMNPlane shapes and edges.
- For user tasks, include zeebe:userTask and userTaskCreation execution listener.
- Ensure IDs are unique and deterministic.
- Set bpmn:process@name to the inferred workflow label.
- Include bpmndi:BPMNLabel blocks for all externally-visible labels: start/end events, intermediate events, gateways, and any labeled sequence flows (e.g. condition names, Yes/No).

## Universal diagram layout rules (apply to ALL generated diagrams regardless of complexity)

### Guiding principle
Every element — shape, label, and flow line — must occupy its own clear visual zone. No label may be crossed by a flow line. No two labels may overlap. Every label must be visually attached to its parent shape with obvious proximity.

### Shape sizing (fixed values)
- Start/End events: 36 × 36 px
- Intermediate throw/catch events: 36 × 36 px
- User tasks / service tasks: 160 × 80 px
- Gateways: 50 × 50 px

### Minimum spacing between shapes (edge-to-edge, not center-to-center)
- Horizontal gap between adjacent shapes on the same row: 80 px minimum; use 100 px when a labeled sequence flow runs between them.
- Vertical gap between rows: 80 px minimum; increase to 130 px when labels below shapes in one row would otherwise fall inside the next row's bounding box.
- Never place two shapes so close that their label zones touch or overlap.

### Columns (primary left-to-right layout axis)
Maintain a strict column grid. Assign each logical role a fixed x column:
- Col A — start event: x ≈ 80
- Col B — first user task: x ≈ 180
- Col C — gateway: x ≈ 430 (adjust right if task is wider than 160 px)
- Col D — intermediate throw/catch events: x = gateway_right_edge + 180 px minimum
- Col E — end event or join gateway: x = events_right_edge + 150 px minimum

All shapes in the same logical column share the same x coordinate. Never shift a shape left or right of its column just to shorten a flow line.

### Row assignment (vertical layout axis)
- Assign each parallel branch or stacked event its own row.
- Row height = shape height + vertical gap (minimum 80 px; use 130 px when events have labels below them).
- Center the entire fan (set of branching rows) vertically around the gateway's y midpoint.
- Loopback destination shapes (shapes that a flow returns to) stay on their original row; loopback flow lines must route outside the main flow band (see loopback routing below).

### Label placement rules (apply to every label in every diagram)

**Gateway labels:**
- Always place ABOVE the gateway diamond, never to the right or below.
- Label bounds: x = gateway.x - 15, y = gateway.y - 34, width = 130, height = 28.
- If the label text is longer than 130 px at ~8 px/char, increase width to fit in 2 lines max; never force 3+ lines.

**Intermediate event labels (throw/catch):**
- Always place BELOW the event circle.
- Label bounds: x = event.x - 47, y = event.y + event.height + 5, width = 130, height = 28.
- If the label needs 2 lines, increase height to 42; keep the top of the label bounds flush with event.y + event.height + 5.
- Never place the label above or to the side of the event circle.

**Start event label:**
- Always place BELOW the circle (a flow line exits to the right, so below is the only unobstructed direction).
- Label bounds: x = event.x - 7, y = event.y + event.height + 5, width = 50, height = 14.

**End event label:**
- Preferred position: BELOW the circle, using the same formula as intermediate event labels.
  - Label bounds: x = event.x - 7, y = event.y + event.height + 5, width = 50, height = 14.
- Override to RIGHT when the space below is obstructed — specifically when one or more sequence flow lines pass through (or close to) the area directly below the End event circle. This is common in fan-in patterns where flows arrive from below (e.g. a "No BPO" route that travels horizontally at a y value just below the End event, or an appraisal flow returning upward along the right edge of the diagram).
  - In that case place the label TO THE RIGHT of the circle, vertically centred.
  - Label bounds: x = event.x + event.width + 5, y = event.y + (event.height / 2) - 7, width = 30, height = 14.
- Decision rule: if any sequence flow waypoint falls within the zone (event.x - 20 to event.x + event.width + 20) × (event.y + event.height to event.y + event.height + 30), treat the space below as obstructed and place the label to the right instead.

**Task labels:**
- Tasks are wide enough (160 px) to contain their label inline. Do not add an external BPMNLabel — omit the BPMNLabel element entirely (the task name renders inside the box).

**Sequence flow labels (condition names, Yes/No, default path name):**
- Place on the longest clearly horizontal segment of the flow line.
- Offset the label 8 px above the line (label.y = segment_y - 20, label.height = 14).
- Never place a flow label inside the label zone of any shape.
- Never place a flow label where another flow line crosses it.
- If two flow labels would overlap (e.g., two branches leaving a gateway at similar angles), stagger them: move one 30 px horizontally away from the other.

### Sequence flow routing rules (apply to every edge in every diagram)

**Rule 1 — Orthogonal routing only.** All sequence flows must be drawn using only horizontal and vertical segments. Diagonal lines are never permitted. Use explicit `<di:waypoint>` elements to enforce this.

**Rule 2 — No line may cross a label zone.** Before placing a waypoint, check that the horizontal or vertical segment you are drawing does not pass through any shape's label zone (the bounding box of any BPMNLabel element). If it would, add a detour waypoint to route around the zone.

**Rule 3 — No line may cross a shape.** Route lines around shapes, not through them. If a direct orthogonal path would clip a shape, route the line either above or below with appropriate waypoints.

**Rule 4 — Gateway fan-out flows.** For each outgoing branch from a gateway:
- The flow exits the gateway on the side closest to its target row (top side for rows above the gateway y-center; bottom side for rows below; right side for the row at the same y level as the gateway).
- Each flow then travels horizontally to Col D.
- Use a step pattern: exit gateway → travel vertically to the target row's y midpoint → travel horizontally right to the event.

**Rule 5 — Default / direct-to-end flows** (flows that skip all intermediate events and go straight to End):
- NEVER draw as a diagonal.
- Route: exit the gateway at the bottom → travel vertically down to y_clear (lowest event label bottom + 60 px) → travel horizontally right to the end event x → travel vertically up to the end event.
- Place the flow label on the long horizontal bottom segment, 8 px above the line.

**Rule 6 — Merge flows** (multiple flows arriving at a join gateway or end event):
- Each arriving flow must approach from a distinct side or distinct waypoint offset so lines do not overlap.
- Flows arriving from above approach from the top; flows from the left approach from the left; flows from below approach from the bottom. Space side-entry waypoints at least 10 px apart on the same edge.

**Rule 7 — Loopback flows** (flow returning left to an earlier task or gateway):
- Route entirely OUTSIDE the main flow band.
- If looping back from above the main row: exit event top → travel up to y_above (task.y - 80) → travel left back to above the target task → enter task from the top.
- If looping back from below the main row: exit event bottom → travel down to y_below → travel left → enter task from the bottom.
- The loopback's horizontal segment must clear all shape label zones it passes over.
- Never route a loopback line through the gateway or its label zone.

**Rule 8 — Flows in linear (no-branch) diagrams:**
- All shapes on a single horizontal row; flow lines are single horizontal segments, no waypoints needed unless routing around a label.
- Minimum 100 px gap between shapes so labels below events do not extend into the next shape.

### Pre-generation checklist (verify before writing XML coordinates)
Before writing any `dc:Bounds` or `di:waypoint` value, mentally verify:
1. Every pair of labels has at least 10 px clear space between their bounding boxes.
2. No flow line segment passes through any label bounding box.
3. No flow line segment passes through any shape bounding box.
4. All gateway labels are ABOVE their gateway shape.
5. All event labels are BELOW their event shape.
6. All sequence flow edges use only horizontal and vertical segments (no diagonals).
7. Loopback flows are routed fully outside the main flow band.
8. Default/direct-to-end flows are routed below (or above) all intermediate event label zones before turning right toward the end event.

Use templates/bpmn/generate-bpmn-workflow-from-story.template.md during generation.

If the requirement is ambiguous, proceed with conservative assumptions and state them explicitly.

## Prompt Usage Logging (Required)

After successful completion of this workflow, run:

```bash
node .github/initializer/tools/log-prompt-usage.js --prompt-path=.github/prompts/bpmn-generate-bpmn-workflow-from-story.prompt.md
```
