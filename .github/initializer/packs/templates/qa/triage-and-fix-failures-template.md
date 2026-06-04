# Failure Triage And Fix Package - [Run Or Feature Name]

## Mode
- analyze-only | analyze-and-fix | fix-from-analysis

## Inputs Summary
- Report file:
- Failure-analysis file:
- Affected page class:
- Affected test class:
- DOM or HTML evidence:

## Report Selection
- Selected report path:
- Selection basis:
- Run timestamp:

## Quick Snapshot
- Total failed:
- Total passed:
- Pass rate:

## Failure Mix
- Locator failure:
- Timeout / sync:
- Stale element:
- Assertion mismatch:
- Null pointer:
- Driver / environment:
- Other:

## Immediate Starting Points
1. 
2. 
3. 

## Failure Details

### test-id [n] - [Test display name]
- Report test-id:
- TC ID:
- Failure type:
- Where failed:
- Error summary:
- Stack trace first line:

## Diagnosis
- Test:
- TCs:
- Type:
- Root cause:

## Fix Plan

### Will Fix
- [file] -> [method] -> [change]

### Will Not Touch
- [specific unaffected areas]

## Applied Changes

### Change [n]
- File:
- Method:
- Before:
- After:
- Reason:

## Validation Summary
- Thread.sleep introduced:
- Assert in page class:
- Inline locator in test method:
- WaitUtil used correctly:
- Logging complete:
- Critical violations remaining:
- Major violations remaining:

## Output Summary
- Analysis report path:
- Fix-summary report path:
- Files changed:
- Remaining blockers:
- Recommended rerun scope: