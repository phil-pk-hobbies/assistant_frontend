import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Button from '../components/ui/Button';

describe('Button', () => {
  it('renders primary button', () => {
    const { container } = render(<Button>Save</Button>);
    expect(container.firstChild).toMatchSnapshot();
  });

  it('disabled button prevents click', () => {
    const onClick = jest.fn();
    const { getByText } = render(
      <Button disabled onClick={onClick}>Submit</Button>,
    );
    fireEvent.click(getByText('Submit'));
    expect(onClick).not.toHaveBeenCalled();
  });
});
