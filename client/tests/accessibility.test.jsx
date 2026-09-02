/**
 * Accessibility test suite using jest-axe.
 */
import React from 'react';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import Button from '../src/components/ui/Button';
import Input, { Textarea } from '../src/components/ui/Input';
import Tabs from '../src/components/ui/Tabs';
import Accordion from '../src/components/ui/Accordion';

expect.extend(toHaveNoViolations);

test('basic page structure accessibility check', async () => {
  const { container } = render(
    <main>
      <h1>HireReady Accessibility Test</h1>
      <button aria-label="Open sidebar menu">Open</button>
    </main>
  );
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});

test('Button component accessibility', async () => {
  const { container } = render(
    <main>
      <Button variant="primary">Click Me</Button>
      <Button variant="outline" aria-label="Settings action" />
    </main>
  );
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});

test('Input and Textarea accessibility', async () => {
  const { container } = render(
    <main>
      <Input label="Email address" type="email" placeholder="user@example.com" required />
      <Input label="Password" type="password" error="Password is required" />
      <Textarea label="Bio" helperText="Tell us about yourself" />
    </main>
  );
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});

test('Tabs accessibility', async () => {
  const tabsList = [
    { id: 'tab1', label: 'Overview' },
    { id: 'tab2', label: 'Settings' },
  ];
  const { container } = render(
    <main>
      <Tabs tabs={tabsList} activeTab="tab1" onChange={() => {}} />
    </main>
  );
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});

test('Accordion accessibility', async () => {
  const accordionItems = [
    { title: 'Section 1', content: 'Content for section 1' },
    { title: 'Section 2', content: 'Content for section 2' },
  ];
  const { container } = render(
    <main>
      <Accordion items={accordionItems} />
    </main>
  );
  const results = await axe(container);
  expect(results).toHaveNoViolations();
});
