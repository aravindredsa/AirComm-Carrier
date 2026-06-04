# React + Vitest Test Coverage Analyst & Generator

## Skill Dependency (Mandatory)
- Apply `.github/skills/skill-frontend-generate-tests/SKILL.md` before executing this workflow.
- Keep this prompt's specific output and coverage requirements as final authority when more specific.

## Role
You are an expert React testing engineer. Your job is to:
1. Scan the project, run tests, analyze coverage gaps
2. Suggest missing unit tests
3. Write and add those tests automatically in Phase 3 without waiting for extra confirmation

---

## PHASE 1 — Scan & Run Tests

### Step 1: Discover the project structure
Scan the entire project directory and identify:
- All source files under `src/` with extensions `.js`, `.jsx`, `.ts`, `.tsx`
- All existing test files matching `*.test.{js,jsx,ts,tsx}` or `*.spec.{js,jsx,ts,tsx}`
- The test framework config (`vite.config.js`, `vitest.config.js`, or `vitest` section in `package.json`)

### Step 2: Verify Vitest setup
Check that the following are installed and configured. If anything is missing, install and configure it before proceeding:

```bash
npm install -D vitest @vitest/coverage-v8 @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

Ensure `vite.config.js` (or `vitest.config.js`) has this test block:

```js
test: {
  environment: "jsdom",
  globals: true,
  setupFiles: "./src/test/setup.js",
  coverage: {
    provider: "v8",
    reporter: ["text", "html", "lcov"],
    include: ["src/**/*.{js,jsx,ts,tsx}"],
    exclude: [
      "src/main.{js,jsx,ts,tsx}",
      "src/**/*.test.{js,jsx,ts,tsx}",
      "src/**/*.spec.{js,jsx,ts,tsx}",
      "src/test/**",
    ],
    thresholds: {
      lines: 80,
      functions: 80,
      branches: 75,
      statements: 80,
    },
  },
}
```

Ensure `src/test/setup.js` exists with:
```js
import "@testing-library/jest-dom";
```

### Step 3: Run the full test suite with coverage
```bash
npx vitest run --coverage --reporter=verbose 2>&1 | tee test-report.txt
```

---

## PHASE 2 — Analyze & Report

After running the tests, produce a structured report in this exact format:

---

### 📊 TEST COVERAGE REPORT
**Date:** <current date>
**Framework:** Vitest + @vitest/coverage-v8

#### ✅ Overall Summary
| Metric      | Coverage |
|-------------|----------|
| Statements  | XX%      |
| Branches    | XX%      |
| Functions   | XX%      |
| Lines       | XX%      |

---

#### 📁 File-by-File Breakdown
For EVERY source file in `src/`, list:

| File | Statements | Branches | Functions | Lines | Has Test File? | Status |
|------|-----------|----------|-----------|-------|----------------|--------|
| `src/components/Button.jsx` | 100% | 100% | 100% | 100% | ✅ Yes | ✅ Covered |
| `src/pages/LoginPage.jsx`   |  60% |  50% |  70% |  60% | ✅ Yes | ⚠️ Partial |
| `src/utils/formatDate.js`   |   0% |   0% |   0% |   0% | ❌ No  | 🔴 Missing |

**Status legend:**
- ✅ Covered — has tests, meets thresholds
- ⚠️ Partial — has tests but below threshold (< 80%)
- 🔴 Missing — no test file exists at all

---

#### 🔴 Files With Missing Tests
List every source file that has NO corresponding test file:

```
src/utils/formatDate.js        → missing: src/utils/formatDate.test.js
src/hooks/useAuth.js           → missing: src/hooks/useAuth.test.js
src/services/apiService.js     → missing: src/services/apiService.test.js
```

---

#### ⚠️ Files With Incomplete Coverage
List files that have tests but are below the 80% threshold:

```
src/pages/LoginPage.jsx
  - Statements: 60%  (need +20%)
  - Branches:   50%  (need +30%)
  - Uncovered:  handleOAuthLogin(), resetPasswordFlow()

src/components/Modal.jsx
  - Functions:  70%  (need +10%)
  - Uncovered:  onBackdropClick(), trapFocus()
```

---

#### 💡 Suggested Tests

For each file flagged 🔴 or ⚠️, list specific test cases to write:

**`src/utils/formatDate.js`**
- [ ] `formatDate()` — returns correct format for valid date
- [ ] `formatDate()` — returns fallback string for null/undefined input
- [ ] `formatDate()` — handles leap year dates correctly
- [ ] `formatDate()` — handles timezone edge cases

**`src/pages/LoginPage.jsx`**
- [ ] renders email and password fields
- [ ] shows validation error when fields are empty
- [ ] calls login API with correct credentials on submit
- [ ] redirects to dashboard on successful login
- [ ] displays server error message on failed login
- [ ] `handleOAuthLogin()` — triggers OAuth redirect
- [ ] `resetPasswordFlow()` — shows reset password modal

**`src/hooks/useAuth.js`**
- [ ] returns `isAuthenticated: false` when no token in storage
- [ ] returns `isAuthenticated: true` when valid token exists
- [ ] `login()` — sets token and updates state
- [ ] `logout()` — clears token and redirects

---

#### 🎯 Priority Order
Write tests in this order (highest impact first):
1. 🔴 Files with 0% coverage and used in critical flows
2. ⚠️ Files with < 50% branch coverage
3. ⚠️ Files with untested error/edge case branches

---

## PHASE 3 — Generate Tests (automatic)

After completing Phase 2, automatically execute Phase 3 without waiting for additional user confirmation.

### For EACH file flagged 🔴 or ⚠️:

1. **Read the source file** fully before writing any test
2. **Identify** all exported functions, components, hooks, and branches
3. **Write** a complete test file covering:
   - Happy path (expected behavior)
   - Edge cases (empty, null, boundary values)
   - Error states (API failures, invalid input)
   - All branches visible in coverage report

4. **Follow these conventions:**
   - Use `describe` blocks per component/function
   - Use `it` / `test` with plain-English descriptions
   - Use `@testing-library/react` for component tests
   - Use `@testing-library/user-event` for interactions (preferred over `fireEvent`)
   - Use `vi.fn()` and `vi.mock()` for mocking
   - Use `msw` for API mocking if the project already uses it

5. **Place** the test file next to the source file:
   ```
   src/utils/formatDate.js      → src/utils/formatDate.test.js
   src/hooks/useAuth.js         → src/hooks/useAuth.test.js
   src/pages/LoginPage.jsx      → src/pages/LoginPage.test.jsx
   ```

### Test file template to follow:

Use `templates/frontend/test-case-unit-template.md` as the canonical starter structure for generated unit test files.

### After writing all tests, run coverage again:
```bash
npx vitest run --coverage --reporter=verbose
```

Then show an **updated coverage report** using the same table format from Phase 2, highlighting improvements:
```
src/utils/formatDate.js   0% → 100% ✅  (+100%)
src/pages/LoginPage.jsx  60% →  95% ✅  (+35%)
src/hooks/useAuth.js      0% →  88% ✅  (+88%)
```

---

## Usage

Run this prompt against your project by pointing an AI coding agent (Claude, Cursor, GitHub Copilot Workspace, etc.) at your project root:

```
"Follow the instructions in prompt.md starting with Phase 1"
```

Or step by step:
```
"Run Phase 1 and Phase 2 only — show me the report first"
"Run all phases end-to-end and write the missing tests automatically"
```

---

## Notes
- This prompt works best with Claude Code, Cursor, or any agentic AI with file system access
- Always review generated tests before committing — ensure mocks reflect real API contracts
- Re-run coverage after each batch of new tests to track progress
- For large projects, ask the agent to process one directory at a time

## Prompt Usage Logging (Required)

After successful completion of this workflow, run:

```bash
node .github/initializer/tools/log-prompt-usage.js --prompt-path=.github/prompts/frontend-generate-unit-test-cases.prompt.md
```
