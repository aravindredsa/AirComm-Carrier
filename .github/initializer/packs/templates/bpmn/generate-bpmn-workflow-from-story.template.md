# BPMN Generation Template (Requirements -> Camunda 8)

Use this template while converting requirement/FRD/LLD content into BPMN.

## 1) Requirement Extraction

- Primary task name:
- Requirement source document(s):
- Priority section used: Post Action / Tasks Triggered / Trigger Logic
- Secondary section used: Preconditions / Task Characteristics
- LLD or FRD details used for payload/event naming:

## 2) Trigger Mapping Table

| Trigger Id | Source Condition Text | Condition Expression Draft | Triggered Downstream Task | Event Name | Message Name |
|---|---|---|---|---|---|
| T1 |  |  |  |  |  |
| T2 |  |  |  |  |  |

Note:
- Set Event Name to business label only (for example Review Repair Work), without "Trigger" prefix.

## 3) BPMN Construction Pattern

1. Start Event -> Primary User Task.
2. Add decision gateway after the user task.
3. For each trigger mapping row:
   - Add conditional sequence flow from gateway.
   - Add intermediate throw event with message publisher extension.
   - Add messageEventDefinition.
   - Route to end event (or join gateway when needed).
4. Add default flow only when requirements imply a fallback path.
5. Add loop-back only when requirement text explicitly says re-trigger/repeat.

## 4) XML Skeleton

```xml
<?xml version="1.0" encoding="UTF-8"?>
<bpmn:definitions xmlns:bpmn="http://www.omg.org/spec/BPMN/20100524/MODEL"
                  xmlns:bpmndi="http://www.omg.org/spec/BPMN/20100524/DI"
                  xmlns:dc="http://www.omg.org/spec/DD/20100524/DC"
                  xmlns:di="http://www.omg.org/spec/DD/20100524/DI"
                  xmlns:zeebe="http://camunda.org/schema/zeebe/1.0"
                  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
                  id="Definitions_<id>"
                  targetNamespace="http://bpmn.io/schema/bpmn">
  <bpmn:process id="<process_id>" name="<process_name>" isExecutable="true">
    <bpmn:startEvent id="StartEvent_1" name="Start">
      <bpmn:outgoing>Flow_start_to_task</bpmn:outgoing>
    </bpmn:startEvent>

    <bpmn:userTask id="<primary_task_id>" name="<primary_task_name>">
      <bpmn:extensionElements>
        <zeebe:userTask />
        <zeebe:executionListeners>
          <zeebe:executionListener eventType="start" type="userTaskCreation" />
        </zeebe:executionListeners>
      </bpmn:extensionElements>
      <bpmn:incoming>Flow_start_to_task</bpmn:incoming>
      <bpmn:outgoing>Flow_task_to_gateway</bpmn:outgoing>
    </bpmn:userTask>

    <bpmn:inclusiveGateway id="Gateway_Fork" name="Evaluate triggers" default="Flow_default" />

    <!-- Repeat per trigger mapping -->
    <bpmn:sequenceFlow id="Flow_trigger_1" sourceRef="Gateway_Fork" targetRef="Event_Trigger_1">
      <bpmn:conditionExpression xsi:type="bpmn:tFormalExpression">=<condition_expression></bpmn:conditionExpression>
    </bpmn:sequenceFlow>

    <bpmn:intermediateThrowEvent id="Event_Trigger_1" name="Trigger <Task Name>">
      <bpmn:extensionElements>
        <zeebe:taskDefinition type="messagePublisher" />
        <zeebe:ioMapping>
          <zeebe:input source="=\"<message_name>\"" target="message" />
          <zeebe:input source="=payload.assetId" target="assetId" />
        </zeebe:ioMapping>
      </bpmn:extensionElements>
      <bpmn:messageEventDefinition id="MessageEventDefinition_1" />
    </bpmn:intermediateThrowEvent>

    <bpmn:endEvent id="EndEvent_1" name="End" />
  </bpmn:process>

  <bpmndi:BPMNDiagram id="BPMNDiagram_1">
    <bpmndi:BPMNPlane id="BPMNPlane_1" bpmnElement="<process_id>">
      <!-- include BPMNShape and BPMNEdge for all elements -->
    </bpmndi:BPMNPlane>
  </bpmndi:BPMNDiagram>
</bpmn:definitions>
```

## 5) Validation Checklist

- Process has one primary user task representing the modeled requirement task.
- Branching logic originates from requirement Post Action / Trigger statements.
- Downstream triggers are modeled as intermediate throw events with message publisher extension.
- Message name and assetId mapping are present when inferable.
- BPMN includes diagram section (BPMNDiagram/BPMNPlane with shapes/edges).
- BPMN includes BPMNLabel nodes for start/end/events/gateway and flow labels (Yes/No) with readable padding.
- Gateway decision label is positioned to the right of the gateway, slightly above midpoint for visual centering, and wide enough to avoid unnecessary 3-line wrapping.
- Gateway decision label has visible left padding from the diamond and does not appear to touch the shape.
- Yes and No labels use matching offsets from their respective lines so they appear equidistant from the top and bottom paths.
- File name is derived from the dropped/attached requirement file name (normalized to lowercase snake_case) and output path is artifacts/bpmn/<name>.bpmn.
