import React from 'react';
import { render } from '@testing-library/react';
import Icon from '../components/ui/Icon';

test('renders trash icon', () => {
  const { container } = render(<Icon name="Trash2" size="sm" />);
  expect(container.firstChild).toMatchSnapshot();
});
