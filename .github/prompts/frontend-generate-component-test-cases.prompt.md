# React Component Test Coverage Analyst & Generator

## Skill Dependency (Mandatory)
- Apply `.github/skills/skill-frontend-generate-tests/SKILL.md` before executing this workflow.
- Keep this prompt's specific output and coverage requirements as final authority when more specific.

## Role
You are an expert React component testing engineer. Your job is to:
1. Scan the project, run tests, analyze coverage gaps specifically for React components
2. Suggest missing component-level unit tests
3. Write and add those tests automatically in Phase 3 without waiting for extra confirmation

---

## PHASE 1 — Scan & Run Tests

### Step 1: Discover all React components
Scan the entire project and identify ONLY React component files:
- Files matching `**/*.{jsx,tsx}` under `src/`
- Exclude: `main.jsx`, `index.jsx`, `App.jsx` (entry points), `*.test.{jsx,tsx}`, `*.stories.{jsx,tsx}`
- For each component file found, check if a corresponding test file exists:
  - Same directory: `Button.jsx` → `Button.test.jsx`
  - Or in `__tests__/` folder: `Button.jsx` → `__tests__/Button.test.jsx`

Group components by type:
```
UI Components       → src/components/ui/
Layout Components   → src/components/layout/
Page Components     → src/pages/
Feature Components  → src/features/
Common Components   → src/components/common/
Form Components     → src/components/forms/
Hook-driven         → src/components/ (uses custom hooks)
```

### Step 2: Verify Vitest + Testing Library setup
Check that the following are installed. If anything is missing, install before proceeding:

```bash
npm install -D vitest @vitest/coverage-v8 \
  @testing-library/react \
  @testing-library/user-event \
  @testing-library/jest-dom \
  @vitest/ui \
  jsdom \
  msw
```

Ensure `vite.config.js` (or `vitest.config.js`) contains:

```js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/test/setup.js",
    coverage: {
      provider: "v8",
      reporter: ["text", "html", "lcov"],
      include: ["src/**/*.{jsx,tsx}"],       // components only
      exclude: [
        "src/main.{jsx,tsx}",
        "src/index.{jsx,tsx}",
        "src/App.{jsx,tsx}",
        "src/**/*.test.{jsx,tsx}",
        "src/**/*.spec.{jsx,tsx}",
        "src/**/*.stories.{jsx,tsx}",
        "src/test/**",
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 75,
        statements: 80,
      },
    },
  },
});
```

Ensure `src/test/setup.js` exists:
```js
import "@testing-library/jest-dom";
import { afterEach } from "vitest";
import { cleanup } from "@testing-library/react";

// Auto cleanup after each test
afterEach(() => {
  cleanup();
});
```

### Step 3: Run the full component test suite with coverage
```bash
npx vitest run --coverage --reporter=verbose 2>&1 | tee component-test-report.txt
```

---

## PHASE 2 — Analyze & Report

After running the tests, produce a structured report in this exact format:

---

### 📊 COMPONENT TEST COVERAGE REPORT
**Date:** <current date>
**Framework:** Vitest + React Testing Library + @vitest/coverage-v8

#### ✅ Overall Summary
| Metric     | Coverage |
|------------|----------|
| Statements | XX%      |
| Branches   | XX%      |
| Functions  | XX%      |
| Lines      | XX%      |

**Total Components Found:** XX
**Components With Tests:** XX
**Components Missing Tests:** XX

---

#### 📁 Component-by-Component Breakdown

For EVERY `.jsx` / `.tsx` component file in `src/`, list:

| Component | Path | Stmt % | Branch % | Func % | Lines % | Has Test? | Status |
|-----------|------|--------|----------|--------|---------|-----------|--------|
| `Button` | `components/ui/Button.jsx` | 100% | 100% | 100% | 100% | ✅ Yes | ✅ Covered |
| `Modal` | `components/ui/Modal.jsx` | 65% | 50% | 70% | 65% | ✅ Yes | ⚠️ Partial |
| `UserCard` | `components/UserCard.jsx` | 0% | 0% | 0% | 0% | ❌ No | 🔴 Missing |
| `LoginForm` | `pages/LoginPage.jsx` | 55% | 45% | 60% | 55% | ✅ Yes | ⚠️ Partial |

**Status legend:**
- ✅ Covered — has tests, all metrics ≥ 80%
- ⚠️ Partial — has tests but one or more metrics below 80%
- 🔴 Missing — no test file exists at all

---

#### 🔴 Components With No Tests

List every component file with NO test file:

```
src/components/UserCard.jsx
  → create: src/components/UserCard.test.jsx

src/components/forms/ContactForm.jsx
  → create: src/components/forms/ContactForm.test.jsx

src/features/cart/CartSummary.jsx
  → create: src/features/cart/CartSummary.test.jsx

src/components/layout/Sidebar.jsx
  → create: src/components/layout/Sidebar.test.jsx
```

---

#### ⚠️ Components With Incomplete Coverage

List components that have tests but fall below the 80% threshold:

```
src/components/ui/Modal.jsx
  - Statements: 65%  (need +15%)
  - Branches:   50%  (need +30%)
  - Uncovered:
      • onBackdropClick() — click outside to close
      • trapFocus() — keyboard focus trapping
      • onEscapeKey() — close on Escape key press
      • Conditional rendering when `isAnimating` is true

src/pages/LoginPage.jsx
  - Statements: 55%  (need +25%)
  - Branches:   45%  (need +35%)
  - Uncovered:
      • handleOAuthLogin() — Google/GitHub OAuth button click
      • resetPassword branch — "Forgot password?" link flow
      • Loading spinner display during API call
      • Error message display on failed login
```

---

#### 💡 Suggested Tests Per Component

For each component flagged 🔴 or ⚠️, list specific test cases to write:

**`UserCard.jsx`** *(missing all tests)*
- [ ] renders user name and avatar correctly
- [ ] renders fallback avatar when image URL is missing or broken
- [ ] displays "Online" badge when `isOnline` prop is true
- [ ] hides badge when `isOnline` prop is false
- [ ] calls `onViewProfile` callback when "View Profile" button is clicked
- [ ] calls `onMessage` callback when "Message" button is clicked
- [ ] renders skeleton loader when `isLoading` prop is true
- [ ] matches snapshot for default state

**`ContactForm.jsx`** *(missing all tests)*
- [ ] renders all form fields: name, email, message
- [ ] shows validation error when name field is empty on submit
- [ ] shows validation error for invalid email format
- [ ] shows validation error when message is too short
- [ ] clears errors when user starts typing in a field
- [ ] calls `onSubmit` with correct form data on valid submission
- [ ] disables submit button while form is submitting
- [ ] shows success message after successful submission
- [ ] shows server error message when API call fails
- [ ] resets form fields after successful submission

**`Modal.jsx`** *(partial coverage)*
- [ ] closes when backdrop (outside area) is clicked
- [ ] closes when Escape key is pressed
- [ ] does NOT close when clicking inside modal content
- [ ] traps focus within modal when open (Tab key cycles inside)
- [ ] renders with animation class when `isAnimating` is true
- [ ] calls `onClose` callback when close button is clicked

**`CartSummary.jsx`** *(missing all tests)*
- [ ] renders correct item count and total price
- [ ] renders "Cart is empty" message when no items
- [ ] renders each cart item with name, quantity, and price
- [ ] calls `onCheckout` when "Proceed to Checkout" is clicked
- [ ] disables checkout button when cart is empty
- [ ] applies discount display when promo code is active
- [ ] updates totals reactively when item quantity changes

**`Sidebar.jsx`** *(missing all tests)*
- [ ] renders all navigation links
- [ ] highlights active link based on current route
- [ ] collapses when toggle button is clicked
- [ ] expands when toggle button is clicked again
- [ ] renders user profile section when `user` prop is provided
- [ ] hides profile section when `user` prop is null

---

#### 🎯 Priority Order
Write tests in this order (highest impact first):
1. 🔴 Form components — complex interaction + validation logic
2. 🔴 Feature components — business-critical UI flows
3. 🔴 Shared UI components — reused across many pages
4. ⚠️ Components with uncovered conditional branches
5. ⚠️ Components with uncovered event handler callbacks
6. ⚠️ Layout/nav components — routing and active states

---

## PHASE 3 — Generate Tests (automatic)

After completing Phase 2, automatically execute Phase 3 without waiting for additional user confirmation.

### For EACH component flagged 🔴 or ⚠️:

1. **Read the component file** fully before writing any test
2. **Identify** all:
   - Props (required, optional, with defaults)
   - Rendered elements (roles, labels, text)
   - Conditional rendering branches (`isLoading`, `isError`, `isEmpty`, etc.)
   - Event handlers (`onClick`, `onChange`, `onSubmit`, etc.)
   - API calls or hook dependencies
   - Custom hooks used (`useAuth`, `useCart`, etc.)

3. **Choose the right strategy:**
   - Props-driven UI → render with different prop combinations
   - Event-driven → use `userEvent` for clicks, typing, keyboard
   - API-dependent → mock with `vi.mock()` or MSW handlers
   - Hook-dependent → mock the hook with `vi.mock()`
   - Routing-dependent → wrap with `MemoryRouter`
   - Context-dependent → wrap with the relevant Provider

4. **Write complete test files** following the templates below

5. **Place** the test file next to the component:
   ```
   src/components/UserCard.jsx       → src/components/UserCard.test.jsx
   src/features/cart/CartSummary.jsx → src/features/cart/CartSummary.test.jsx
   src/pages/LoginPage.jsx           → src/pages/LoginPage.test.jsx
   ```

---

### Component Test Templates

#### Template 1 — Pure UI / Props-Driven Component
```jsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import UserCard from "./UserCard";

const defaultProps = {
  name: "Alice Johnson",
  avatarUrl: "https://example.com/avatar.jpg",
  isOnline: true,
  onViewProfile: vi.fn(),
  onMessage: vi.fn(),
};

describe("UserCard", () => {
  describe("rendering", () => {
    it("renders user name correctly", () => {
      render(<UserCard {...defaultProps} />);
      expect(screen.getByText("Alice Johnson")).toBeInTheDocument();
    });

    it("renders avatar image with correct src and alt", () => {
      render(<UserCard {...defaultProps} />);
      const avatar = screen.getByRole("img", { name: /alice johnson/i });
      expect(avatar).toHaveAttribute("src", defaultProps.avatarUrl);
    });

    it("renders fallback avatar when avatarUrl is not provided", () => {
      render(<UserCard {...defaultProps} avatarUrl={null} />);
      expect(screen.getByTestId("avatar-fallback")).toBeInTheDocument();
    });

    it("shows online badge when isOnline is true", () => {
      render(<UserCard {...defaultProps} isOnline={true} />);
      expect(screen.getByText(/online/i)).toBeInTheDocument();
    });

    it("hides online badge when isOnline is false", () => {
      render(<UserCard {...defaultProps} isOnline={false} />);
      expect(screen.queryByText(/online/i)).not.toBeInTheDocument();
    });

    it("renders skeleton loader when isLoading is true", () => {
      render(<UserCard {...defaultProps} isLoading={true} />);
      expect(screen.getByTestId("skeleton-loader")).toBeInTheDocument();
      expect(screen.queryByText("Alice Johnson")).not.toBeInTheDocument();
    });
  });

  describe("interactions", () => {
    it("calls onViewProfile when View Profile button is clicked", async () => {
      const user = userEvent.setup();
      render(<UserCard {...defaultProps} />);
      await user.click(screen.getByRole("button", { name: /view profile/i }));
      expect(defaultProps.onViewProfile).toHaveBeenCalledTimes(1);
    });

    it("calls onMessage when Message button is clicked", async () => {
      const user = userEvent.setup();
      render(<UserCard {...defaultProps} />);
      await user.click(screen.getByRole("button", { name: /message/i }));
      expect(defaultProps.onMessage).toHaveBeenCalledTimes(1);
    });
  });
});
```

#### Template 2 — Form Component with Validation
```jsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ContactForm from "./ContactForm";

describe("ContactForm", () => {
  const mockOnSubmit = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("rendering", () => {
    it("renders all form fields", () => {
      render(<ContactForm onSubmit={mockOnSubmit} />);
      expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /send/i })).toBeInTheDocument();
    });
  });

  describe("validation", () => {
    it("shows error when name is empty on submit", async () => {
      const user = userEvent.setup();
      render(<ContactForm onSubmit={mockOnSubmit} />);
      await user.click(screen.getByRole("button", { name: /send/i }));
      expect(await screen.findByText(/name is required/i)).toBeInTheDocument();
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it("shows error for invalid email format", async () => {
      const user = userEvent.setup();
      render(<ContactForm onSubmit={mockOnSubmit} />);
      await user.type(screen.getByLabelText(/email/i), "not-an-email");
      await user.click(screen.getByRole("button", { name: /send/i }));
      expect(await screen.findByText(/invalid email/i)).toBeInTheDocument();
    });

    it("clears validation error when user starts typing", async () => {
      const user = userEvent.setup();
      render(<ContactForm onSubmit={mockOnSubmit} />);
      await user.click(screen.getByRole("button", { name: /send/i }));
      await screen.findByText(/name is required/i);
      await user.type(screen.getByLabelText(/name/i), "Bob");
      expect(screen.queryByText(/name is required/i)).not.toBeInTheDocument();
    });
  });

  describe("submission", () => {
    it("calls onSubmit with correct data when form is valid", async () => {
      const user = userEvent.setup();
      render(<ContactForm onSubmit={mockOnSubmit} />);

      await user.type(screen.getByLabelText(/name/i), "Bob Smith");
      await user.type(screen.getByLabelText(/email/i), "bob@example.com");
      await user.type(screen.getByLabelText(/message/i), "Hello there, this is a test message.");
      await user.click(screen.getByRole("button", { name: /send/i }));

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          name: "Bob Smith",
          email: "bob@example.com",
          message: "Hello there, this is a test message.",
        });
      });
    });

    it("disables submit button while submitting", async () => {
      const user = userEvent.setup();
      mockOnSubmit.mockImplementation(() => new Promise((r) => setTimeout(r, 1000)));
      render(<ContactForm onSubmit={mockOnSubmit} />);

      await user.type(screen.getByLabelText(/name/i), "Bob Smith");
      await user.type(screen.getByLabelText(/email/i), "bob@example.com");
      await user.type(screen.getByLabelText(/message/i), "Test message here.");
      await user.click(screen.getByRole("button", { name: /send/i }));

      expect(screen.getByRole("button", { name: /sending/i })).toBeDisabled();
    });

    it("shows success message after successful submission", async () => {
      const user = userEvent.setup();
      mockOnSubmit.mockResolvedValue({ success: true });
      render(<ContactForm onSubmit={mockOnSubmit} />);

      await user.type(screen.getByLabelText(/name/i), "Bob Smith");
      await user.type(screen.getByLabelText(/email/i), "bob@example.com");
      await user.type(screen.getByLabelText(/message/i), "Test message here.");
      await user.click(screen.getByRole("button", { name: /send/i }));

      expect(await screen.findByText(/message sent/i)).toBeInTheDocument();
    });
  });
});
```

#### Template 3 — Component with API Call (MSW Mock)
```jsx
import { describe, it, expect, beforeAll, afterEach, afterAll } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { setupServer } from "msw/node";
import { http, HttpResponse } from "msw";
import UserList from "./UserList";

const server = setupServer(
  http.get("/api/users", () => {
    return HttpResponse.json([
      { id: 1, name: "Alice", email: "alice@example.com" },
      { id: 2, name: "Bob", email: "bob@example.com" },
    ]);
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("UserList", () => {
  it("shows loading spinner while fetching", () => {
    render(<UserList />);
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  it("renders list of users after successful fetch", async () => {
    render(<UserList />);
    expect(await screen.findByText("Alice")).toBeInTheDocument();
    expect(screen.getByText("Bob")).toBeInTheDocument();
  });

  it("shows empty state when no users returned", async () => {
    server.use(http.get("/api/users", () => HttpResponse.json([])));
    render(<UserList />);
    expect(await screen.findByText(/no users found/i)).toBeInTheDocument();
  });

  it("shows error message when API call fails", async () => {
    server.use(http.get("/api/users", () => HttpResponse.error()));
    render(<UserList />);
    expect(await screen.findByText(/something went wrong/i)).toBeInTheDocument();
  });
});
```

#### Template 4 — Component with React Router
```jsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./Sidebar";

const renderWithRouter = (initialRoute = "/") =>
  render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <Routes>
        <Route path="/*" element={<Sidebar />} />
      </Routes>
    </MemoryRouter>
  );

describe("Sidebar", () => {
  it("renders all navigation links", () => {
    renderWithRouter();
    expect(screen.getByRole("link", { name: /dashboard/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /profile/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /settings/i })).toBeInTheDocument();
  });

  it("highlights the active link based on current route", () => {
    renderWithRouter("/dashboard");
    expect(screen.getByRole("link", { name: /dashboard/i })).toHaveClass("active");
    expect(screen.getByRole("link", { name: /profile/i })).not.toHaveClass("active");
  });

  it("collapses sidebar when toggle button is clicked", async () => {
    const user = userEvent.setup();
    renderWithRouter();
    await user.click(screen.getByRole("button", { name: /toggle sidebar/i }));
    expect(screen.getByRole("navigation")).toHaveClass("collapsed");
  });

  it("expands sidebar when toggle is clicked again", async () => {
    const user = userEvent.setup();
    renderWithRouter();
    const toggle = screen.getByRole("button", { name: /toggle sidebar/i });
    await user.click(toggle);
    await user.click(toggle);
    expect(screen.getByRole("navigation")).not.toHaveClass("collapsed");
  });
});
```

#### Template 5 — Component with Context / Custom Hook
```jsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import CartSummary from "./CartSummary";
import { CartContext } from "../../context/CartContext";

const renderWithCart = (cartValue) =>
  render(
    <CartContext.Provider value={cartValue}>
      <CartSummary />
    </CartContext.Provider>
  );

const mockCartItems = [
  { id: 1, name: "Widget", quantity: 2, price: 9.99 },
  { id: 2, name: "Gadget", quantity: 1, price: 24.99 },
];

describe("CartSummary", () => {
  it("renders empty state when cart has no items", () => {
    renderWithCart({ items: [], total: 0, onCheckout: vi.fn() });
    expect(screen.getByText(/cart is empty/i)).toBeInTheDocument();
  });

  it("renders each cart item with name, quantity and price", () => {
    renderWithCart({ items: mockCartItems, total: 44.97, onCheckout: vi.fn() });
    expect(screen.getByText("Widget")).toBeInTheDocument();
    expect(screen.getByText("Gadget")).toBeInTheDocument();
    expect(screen.getByText("x2")).toBeInTheDocument();
  });

  it("renders correct total price", () => {
    renderWithCart({ items: mockCartItems, total: 44.97, onCheckout: vi.fn() });
    expect(screen.getByText(/\$44\.97/)).toBeInTheDocument();
  });

  it("disables checkout button when cart is empty", () => {
    renderWithCart({ items: [], total: 0, onCheckout: vi.fn() });
    expect(screen.getByRole("button", { name: /checkout/i })).toBeDisabled();
  });

  it("calls onCheckout when Checkout button is clicked", async () => {
    const user = userEvent.setup();
    const mockCheckout = vi.fn();
    renderWithCart({ items: mockCartItems, total: 44.97, onCheckout: mockCheckout });
    await user.click(screen.getByRole("button", { name: /checkout/i }));
    expect(mockCheckout).toHaveBeenCalledTimes(1);
  });
});
```

#### Template 6 — Modal / Overlay Component
```jsx
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Modal from "./Modal";

describe("Modal", () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    title: "Confirm Action",
    children: <p>Are you sure?</p>,
  };

  it("renders modal content when isOpen is true", () => {
    render(<Modal {...defaultProps} />);
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Confirm Action")).toBeInTheDocument();
    expect(screen.getByText("Are you sure?")).toBeInTheDocument();
  });

  it("does not render when isOpen is false", () => {
    render(<Modal {...defaultProps} isOpen={false} />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("calls onClose when close button is clicked", async () => {
    const user = userEvent.setup();
    render(<Modal {...defaultProps} />);
    await user.click(screen.getByRole("button", { name: /close/i }));
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it("calls onClose when backdrop is clicked", async () => {
    const user = userEvent.setup();
    render(<Modal {...defaultProps} />);
    await user.click(screen.getByTestId("modal-backdrop"));
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });

  it("does NOT call onClose when clicking inside modal content", async () => {
    const user = userEvent.setup();
    render(<Modal {...defaultProps} />);
    await user.click(screen.getByRole("dialog"));
    expect(defaultProps.onClose).not.toHaveBeenCalled();
  });

  it("calls onClose when Escape key is pressed", async () => {
    const user = userEvent.setup();
    render(<Modal {...defaultProps} />);
    await user.keyboard("{Escape}");
    expect(defaultProps.onClose).toHaveBeenCalledTimes(1);
  });
});
```

---

### After writing all tests, re-run coverage:
```bash
npx vitest run --coverage --reporter=verbose
```

Then show an **updated coverage report** highlighting improvements per component:

```
components/UserCard.jsx          0% → 100% ✅  (+100%)
components/forms/ContactForm.jsx 0% →  96% ✅  (+96%)
components/ui/Modal.jsx         65% →  98% ✅  (+33%)
features/cart/CartSummary.jsx    0% →  92% ✅  (+92%)
components/layout/Sidebar.jsx    0% →  88% ✅  (+88%)
```

Open the HTML report for line-by-line highlighting:
```bash
open coverage/index.html       # macOS
start coverage/index.html      # Windows
xdg-open coverage/index.html   # Linux
```

---

## Usage

Point any AI coding agent (Claude Code, Cursor, GitHub Copilot Workspace) at your project root:

```
"Follow the instructions in prompt.md starting with Phase 1"
```

Or step by step:
```
"Run Phase 1 and Phase 2 only — show me the component report first"
"Run all phases end-to-end and write the missing component tests automatically"
"Only write tests for components in src/features/ first"
```

---

## Notes
- Only targets `.jsx` / `.tsx` component files — excludes utilities, hooks, services, and config files
- Always review generated tests before committing — prop names and test IDs must match your actual components
- Works best with **Claude Code**, **Cursor**, or any agent with file system + terminal access
- For large projects, ask the agent to process one folder at a time: `"start with src/components/ui/ only"`
- Add `data-testid` attributes to elements that are hard to query by role or label

## Prompt Usage Logging (Required)

After successful completion of this workflow, run:

```bash
node .github/initializer/tools/log-prompt-usage.js --prompt-path=.github/prompts/frontend-generate-component-test-cases.prompt.md
```
