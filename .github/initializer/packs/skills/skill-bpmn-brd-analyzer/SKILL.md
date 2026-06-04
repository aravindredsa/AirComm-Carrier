---

name: brd-analyzer
description: Extract structured workflow intent, actors, systems, business rules, and integration points from BRD or requirement documents for BPMN derivation.

---

# BRD Analyzer Skill

## Purpose
Extract structured workflow intent, domain entities, business rules, and system interactions from a Business Requirement Document (BRD) or requirement text to enable BPMN workflow generation.

---

## When to Use
Use this skill when input contains:
- BRD / requirement doc / user story / process description
- Business workflows needing orchestration (Camunda, microservices, event-driven systems)

---

## Core Responsibilities
- Identify actors, systems, and external dependencies
- Extract business events and triggers
- Identify commands, actions, and outcomes
- Extract business rules and validations
- Identify async vs sync operations
- Detect integration points (APIs, messaging, DB, external systems)
- Identify workflow boundaries and sub-process candidates

---

## Output Format

Return structured JSON ONLY:

```json
{
  "process_name": "",
  "actors": [],
  "systems": [],
  "triggers": [],
  "business_events": [],
  "commands": [],
  "data_objects": [],
  "business_rules": [],
  "integrations": [],
  "sync_operations": [],
  "async_operations": [],
  "errors_and_exceptions": [],
  "workflow_candidates": [],
  "bpmn_hints": {
    "candidate_start_events": [],
    "candidate_end_events": [],
    "candidate_gateways": [],
    "candidate_user_tasks": [],
    "candidate_service_tasks": []
  }
}