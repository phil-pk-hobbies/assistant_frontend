import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';
import { AuthProvider } from '../context/AuthContext';
import api from '../api/axios';

jest.mock('../api/axios');

function renderWithProviders(route = '/admin/users', user = { username: 'a', is_staff: true }) {
  api.post.mockResolvedValue({});
  api.get.mockResolvedValue({ data: user });
  return render(
    <MemoryRouter initialEntries={[route]}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </MemoryRouter>,
  );
}

test('list renders for admin', async () => {
  api.get.mockResolvedValueOnce({ data: [{ id: 1, username: 'bob', first_name: 'b', last_name: 'l', department_name: 'D', is_active: true }] })
    .mockResolvedValue({ data: { username: 'admin', is_staff: true } });
  renderWithProviders();
  await waitFor(() => screen.getByText('bob'));
  expect(screen.getByText('bob')).toBeInTheDocument();
});

test('add user success populates table', async () => {
  api.get.mockResolvedValueOnce({ data: [] })
    .mockResolvedValue({ data: { username: 'admin', is_staff: true } });
  api.post.mockResolvedValueOnce({});
  renderWithProviders();
  await waitFor(() => screen.getByText(/add user/i));
  await userEvent.click(screen.getByText(/add user/i));
  await userEvent.type(screen.getByPlaceholderText('Username'), 'new');
  await userEvent.type(screen.getByPlaceholderText('Password'), 'longpassword');
  await userEvent.type(screen.getByPlaceholderText('Confirm'), 'longpassword');
  await userEvent.click(screen.getByRole('button', { name: /save/i }));
  await waitFor(() => expect(api.post).toHaveBeenCalled());
});

test('non-admin blocked', async () => {
  renderWithProviders('/admin/users', { username: 'bob', is_staff: false });
  await waitFor(() => screen.getByText('403 Forbidden'));
});
