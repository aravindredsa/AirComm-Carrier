---

name: flow-deriver
description: Convert structured BRD analysis into BPMN-ready workflow design aligned with Camunda 8 and defaultClientId architecture principles.

---

# Flow Deriver Skill

## Purpose
Convert structured BRD analysis output into a BPMN-ready workflow design aligned to Camunda 8 and microservice-based architecture (defaultClientId).

---

## When to Use
Use this skill when input contains:
- Output from BRD Analyzer Skill
- Structured business process model
- Need for BPMN workflow generation or orchestration design

---

## Core Responsibilities
- Derive end-to-end workflow structure
- Define BPMN elements (events, tasks, gateways, subprocesses)
- Map service boundaries (microservices alignment)
- Define async messaging interactions (Camunda Job Workers / Service Bus events)
- Identify Camunda-specific constructs (user tasks, service tasks, message events, timers)
- Define orchestration vs choreography boundaries
- Ensure Clean Architecture + DDD alignment (defaultClientId style)

---

## Output Format

Return structured BPMN DESIGN JSON ONLY:

```json
{
  "workflow_name": "",
  "bpmn_process_type": "orchestration | collaboration",
  "start_event": {},
  "end_events": [],
  "tasks": [
    {
      "type": "user_task | service_task | script_task | receive_task",
      "name": "",
      "service": "",
      "input": {},
      "output": {},
      "async": true
    }
  ],
  "gateways": [
    {
      "type": "exclusive | parallel | event_based",
      "condition": ""
    }
  ],
  "sub_processes": [],
  "message_flows": [
    {
      "from": "",
      "to": "",
      "channel": "service_bus | zeebe | api"
    }
  ],
  "data_objects": [],
  "external_services": [],
  "camunda_mapping": {
    "job_workers": [],
    "topics": [],
    "message_correlations": []
  },
  "defaultClientId_alignment": {
    "bounded_contexts": [],
    "microservices": [],
    "integration_points": []
  }
}