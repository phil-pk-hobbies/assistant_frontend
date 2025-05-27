import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';
import { AuthProvider } from '../context/AuthContext';
import api from '../api/axios';

jest.mock('../api/axios');

function renderChat(owner = true) {
  api.post.mockResolvedValue({});
  api.get.mockImplementation((url) => {
    if (url === '/api/assistants/1/') {
      return Promise.resolve({ data: { id: '1', name: 'A', owner } });
    }
    if (url.startsWith('/api/messages/')) {
      return Promise.resolve({ data: [] });
    }
    return Promise.resolve({ data: { username: 'u' } });
  });
  return render(
    <MemoryRouter initialEntries={["/assistants/1"]}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </MemoryRouter>,
  );
}

test('owner sees Share button', async () => {
  renderChat(true);
  await waitFor(() => screen.getByText(/chat with/i));
  expect(screen.getByText('Share')).toBeInTheDocument();
});

test('non-owner hides Share button', async () => {
  renderChat(false);
  await waitFor(() => screen.getByText(/chat with/i));
  expect(screen.queryByText('Share')).toBeNull();
});

test('non-owner does not fetch share data', async () => {
  renderChat(false);
  await waitFor(() => screen.getByText(/chat with/i));
  expect(api.get).not.toHaveBeenCalledWith(
    expect.stringContaining('/shares/users/'),
  );
  expect(api.get).not.toHaveBeenCalledWith(
    expect.stringContaining('/shares/departments/'),
  );
});

test('modal lists current shares', async () => {
  api.get.mockImplementation((url) => {
    if (url === '/api/assistants/1/') {
      return Promise.resolve({ data: { id: '1', name: 'A', owner: true } });
    }
    if (url.startsWith('/api/messages/')) {
      return Promise.resolve({ data: [] });
    }
    if (url.endsWith('/shares/users/')) {
      return Promise.resolve({ data: [{ id: '2', name: 'Bob', permission: 'use' }] });
    }
    if (url.endsWith('/shares/departments/')) {
      return Promise.resolve({ data: [] });
    }
    return Promise.resolve({ data: { username: 'u' } });
  });
  renderChat(true);
  await waitFor(() => screen.getByText('Share'));
  await userEvent.click(screen.getByText('Share'));
  await waitFor(() => screen.getByText('Bob'));
  expect(screen.getByText('Bob')).toBeInTheDocument();
});
