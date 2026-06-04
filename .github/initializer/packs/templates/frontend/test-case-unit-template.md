# Unit Test File Template

Use this starter structure when generating unit test files.

```jsx
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { <ComponentOrFunction> } from './<filename>';

// Mock external dependencies
vi.mock('../services/apiService', () => ({
	fetchData: vi.fn(),
}));

describe('<ComponentOrFunction>', () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	describe('rendering', () => {
		it('renders correctly with default props', () => {
			render(<ComponentOrFunction />);
			expect(screen.getByRole('...')).toBeInTheDocument();
		});
	});

	describe('interactions', () => {
		it('handles user click correctly', async () => {
			const user = userEvent.setup();
			render(<ComponentOrFunction />);
			await user.click(screen.getByRole('button', { name: /submit/i }));
			expect(screen.getByText(/success/i)).toBeInTheDocument();
		});
	});

	describe('edge cases', () => {
		it('handles null/undefined input gracefully', () => {
			// ...
		});
	});

	describe('error states', () => {
		it('shows error message when API fails', async () => {
			// ...
		});
	});
});
```
