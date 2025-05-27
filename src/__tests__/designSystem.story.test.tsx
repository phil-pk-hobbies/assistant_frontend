import React from 'react';
import { render } from '@testing-library/react';
import { Colors } from '../stories/DesignSystem.stories';

it('Design System/Colors renders 12+ swatches', () => {
  const { container } = render(<Colors />);
  const swatches = container.querySelectorAll('div > div > div');
  expect(swatches.length).toBeGreaterThanOrEqual(12);
});
