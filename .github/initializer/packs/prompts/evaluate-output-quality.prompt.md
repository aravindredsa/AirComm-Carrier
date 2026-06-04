---
agent: 'agent'
description: Consolidated output-quality evaluation prompt for frontend, backend, and DB artifacts.
---

# Evaluate Output Quality

## Purpose
Evaluate generated output against workspace standards and domain requirements using one normalized workflow.

## Domain Routing
Determine the output domain from the artifact and context:
- `ui-workflow`: implementation or test artifacts aligned to resolver-selected framework and language capabilities
- `service-workflow`: implementation or API artifacts aligned to resolver-selected framework and language capabilities
- `db`: SQL/data dictionary/ERD/stored-procedure/gap-analysis artifacts

Optional override: user may explicitly provide `domain=frontend|backend|db` to force routing.

## Conditional Skill Dependency
- If domain is `db`, apply `.github/skills/skill-db-audit-and-quality/SKILL.md` before evaluation.
- For `frontend` and `backend`, standards-driven evaluation is sufficient unless user requests a specific skill chain.

## Inputs
Specify artifact path(s), for example:
- frontend/backend outputs under `artifacts/`, `reports/`, or implementation files
- db outputs under:
  - `artifacts/data-dictionary/`
  - `artifacts/schemas/`
  - `artifacts/er-diagrams/`
  - `artifacts/stored-procedures/`
  - `artifacts/gap-analysis/`

## Standards Baseline
- Resolve active standards through `config/standards-resolution-policy.json`, `config/client-profiles.json`, and `config/standards-catalog.json`.
- Apply shared standards first, then the resolved domain standards, then resolved capability standards, then any client overlay standards required for the evaluated workflow.

## Template Mapping (Mandatory)
Use the domain-specific quality evaluation template when available:
- `frontend`: no dedicated evaluation matrix template exists; use this prompt's output format
- `backend`: `templates/backend/evaluation-matrix-template.md`
- `db`: inline DB report format in this prompt, plus domain rules from `templates/db/` where applicable

If the mapped template is missing, use the output format section in this prompt as fallback and note the fallback in the report.

## Evaluation Dimensions
Score each dimension 1-5 and provide evidence:
- Completeness
- Correctness
- Standards Compliance
- Naming/Consistency
- Documentation Quality

For DB outputs, include weighted scoring if required by artifact type.

## Output Format
```md
## Quality Evaluation Report
Artifact: <filename>
Domain: <domain>
Evaluator: GitHub Copilot
Date: <date>

### Dimension Scores
| Dimension | Score | Max | Notes |
|---|---|---|---|
| Completeness | N | 5 | ... |

### Findings
| Severity | Finding | Recommendation |

### Overall Assessment
PASS / NEEDS REVISION / FAIL
```

## Output Location
Save to:
- `reports/evaluations/QualityEval_<ArtifactName>_<Date>.md`

After saving, output only:
```md
Saved to: reports/evaluations/QualityEval_<ArtifactName>_<Date>.md
```

## Prompt Usage Logging (Required)

After successful completion of this workflow, run:

```bash
node .github/initializer/tools/log-prompt-usage.js --prompt-path=.github/prompts/evaluate-output-quality.prompt.md
```
