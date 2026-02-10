/**
 * Basic accessibility smoke test using jest-axe.
 * Requires `@testing-library/react` and `jest-axe` to be installed in the client.
 */
import React from 'react';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';

expect.extend(toHaveNoViolations);

function SampleComponent() {
  return (
    <main>
      <h1>HireReady</h1>
      <button aria-label="Open">Open</button>
    </main>
  );
}

test('basic accessibility checks', async () => {
  const { container } = render(<SampleComponent />);
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
