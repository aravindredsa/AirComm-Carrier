# Model Routing Policy Guide

Hi Team,

This guide explains how model selection is optimized in this workspace, where policy is defined, and how it is enforced through Copilot instructions.

## Purpose

The policy routes tasks to different Claude models based on complexity and task type:
- **Opus (claude-opus-4-1)** for complex analysis, code generation, full-codebase audits
- **Sonnet (claude-sonnet-4-20250514)** for single-file refactoring, migration fixes, medium complexity
- **Haiku (claude-haiku-3-5)** for search, validation, quick checks

**Benefits:**
- Reduces token usage and costs by routing simple tasks to faster models
- Preserves Opus for high-complexity reasoning where it matters
- User manual selection always overrides (no forced model assignment)

**Important:**
- This policy is advisory and automatic
- User manual model selection in Copilot chat UI always wins
- If you need Opus for a search task, select it manually—policy won't block you

## Policy File Location

Policy file:
- `config/model-routing-policy.json`

## Enforcement Path

Enforcement is instruction-driven (not script-driven):
- `.github/copilot-instructions.md`
- `.github/initializer/packs/root/copilot-instructions.md`

These instruction files contain a mandatory section that tells the agent to:
1. check user manual selection first (always overrides)
2. match prompt name against task category triggers
3. detect complexity from prompt content
4. apply auto-routing based on signals
5. fall back to default model if no match

So the JSON is the source of truth, and Copilot instructions are the enforcement contract.

## Model Selection Hierarchy

When a prompt executes automatically (no manual user selection):

1. **User Manual Selection** (if made in chat UI)
   - Highest priority
   - Overrides all policy rules
   
2. **Task Category Matching**
   - Prompt name checked against `taskCategories.*.triggers`
   - Example: "audit-fullcodebase" contains "audit" → routes to `taskCategories.analysis` → Opus
   
3. **Complexity Detection**
   - If no category match, scans prompt content for keywords
   - "full codebase" / "architecture" → Opus
   - "single file" / "targeted" → Sonnet
   - "search" / "find pattern" → Haiku
   
4. **Default Model**
   - Fallback if no signals detected
   - Current: `claude-opus-4-1` (safe default)

## Current Policy Structure

Top-level fields:
- `routingVersion`: Policy version (informational)
- `defaultModel`: Fallback when no routing match (Opus)
- `autoRouting`: Enable/disable auto-routing system
- `taskCategories`: Named categories with model + triggers
- `complexitySignals`: Keywords for fallback complexity detection
- `tokenBudgets`: Advisory token limits per category

### Task Categories

```json
{
  "analysis": {
    "model": "claude-opus-4-1",
    "triggers": ["audit", "assessment", "analyze", "reverse-engineer", "gap-analysis"]
  },
  "synthesis": {
    "model": "claude-opus-4-1",
    "triggers": ["generate", "implement", "create", "design", "build"]
  },
  "refactoring": {
    "model": "claude-sonnet-4-20250514",
    "triggers": ["refactor", "migrate", "fix", "update", "patch"]
  },
  "search-discovery": {
    "model": "claude-haiku-3-5",
    "triggers": ["search", "find", "locate", "explore", "discover"]
  },
  "validation": {
    "model": "claude-haiku-3-5",
    "triggers": ["validate", "check", "verify", "lint"]
  }
}
```

**How it works:**
- Prompt name contains any trigger? → Use that category's model
- Multiple matches? First match wins
- No matches? Fall through to complexity detection

### Complexity Signals

For prompts without category matches, keywords are scanned:

**High Complexity → Opus:**
- "full codebase"
- "all files"
- "multi-layer"
- "architecture"
- "comprehensive"

**Medium Complexity → Sonnet:**
- "single file"
- "specific method"
- "targeted"
- "isolated"

**Low Complexity → Haiku:**
- "search"
- "find"
- "pattern"
- "lookup"
- "validation"

## Examples

### Example 1: Prompt Matches Task Category

User runs: `audit-fullcodebase.prompt.md`

Resolution:
1. Name contains "audit" ✓
2. Category match: `analysis`
3. Model: Opus
4. Result: Uses Opus for full-codebase audit (correct—complex reasoning needed)

### Example 2: Prompt Without Category Match (Content Scan)

User runs a custom prompt with content: "Search for all imports across the repository"

Resolution:
1. Prompt name doesn't match any category
2. Content scanned for keywords
3. Found: "search" (low complexity signal)
4. Model: Haiku
5. Result: Uses Haiku for search task (appropriate—fast, cheap, correct)

### Example 3: User Manual Override

User opens Copilot chat, manually selects "Opus", runs a validation prompt

Resolution:
1. User selected Opus in chat UI ✓
2. All policy rules bypassed
3. Model: Opus (as selected)
4. Result: Uses Opus even though policy would route to Haiku

**Why this matters:** If you know you need deeper reasoning for a specific run, you can override policy without modifying files.

## Token Optimization Strategy

**Baseline Costs (relative):**
- Opus: ∼15x (use for complex reasoning)
- Sonnet: ∼1x (use for medium tasks)
- Haiku: ∼0.1x (use for simple tasks)

**Policy Goal:**
- Route "audit-fullcodebase" → Opus (15x but worth it—complex analysis)
- Route "refactor" → Sonnet (1x—good balance for single-file work)
- Route "search" → Haiku (0.1x—fast lookup, save 99% of token cost)

**Result:**
- Routine automation gets cheaper models automatically
- Complex reasoning preserves Opus when needed
- Users retain full control via manual selection

## How Auto-Routing Works

Auto-routing `enabled: true` means:

- When prompt runs automatically (not user-selected), policy applies
- When user manually selects model in chat, policy is bypassed
- Enables cost optimization without restricting user choice

Set `enabled: false` if you want to disable routing entirely and always use default model.

## How To Update Safely

When changing policy:

1. Edit `config/model-routing-policy.json`
2. Add/modify task categories or triggers as needed
3. Example: Add a new trigger to `analysis` category:
   ```json
   "triggers": ["audit", "assessment", "analyze", "reverse-engineer", "gap-analysis", "evaluate"]
   ```
4. No sync or restart needed—policy is read fresh on next prompt execution

## Token Budgets (Advisory)

The policy includes suggested token limits per category:

```json
{
  "analysis": 150000,
  "synthesis": 120000,
  "refactoring": 80000,
  "search-discovery": 30000,
  "validation": 20000
}
```

**These are recommendations, not enforced limits.** They guide reasonable expectations for token usage per task type.

## Quick Checklist

- **Want auto model routing?** Check that `autoRouting.enabled: true` ✓
- **Want all tasks on Opus?** Set `defaultModel: "claude-opus-4-1"` and remove or clear `taskCategories` ✓
- **Want to disable routing for one task?** Manually select model in Copilot chat UI ✓
- **Want to add a new task category?** Add entry to `taskCategories` with model + triggers ✓
- **Want to optimize for token cost?** Task categories are already optimized; no changes needed ✓

## Not Recommended

- **Modifying default model frequently:** Changes apply to all future prompts; make once and leave stable
- **Adding conflicting triggers:** Keep triggers non-overlapping or accept first-match behavior
- **Mixing manual + policy:** If team prefers manual control, disable autoRouting and rely on manual selection

---

If you follow this guide, model routing will optimize token usage automatically while preserving user control through manual selection.
