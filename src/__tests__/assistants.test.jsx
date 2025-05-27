import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';
import { AuthProvider } from '../context/AuthContext';
import api from '../api/axios';

jest.mock('../api/axios');

function renderWithProviders(route = '/assistants') {
  api.post.mockResolvedValue({});
  api.get.mockResolvedValue({ data: { username: 'user' } });
  return render(
    <MemoryRouter initialEntries={[route]}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </MemoryRouter>,
  );
}

test('assistants list shows items from API', async () => {
  api.get
    .mockResolvedValueOnce({ data: [{ id: '1', name: 'A', description: '', model: 'gpt-4o', permission: 'edit', owner: false }] })
    .mockResolvedValue({ data: { username: 'u' } });
  renderWithProviders('/assistants');
  await waitFor(() => screen.getByText('A'));
  expect(screen.getByText('A')).toBeInTheDocument();
});

test('use permission shows Use badge', async () => {
  api.get
    .mockResolvedValueOnce({ data: [{ id: '1', name: 'A', description: '', model: 'gpt-4o', permission: 'use', owner: false }] })
    .mockResolvedValue({ data: { username: 'u' } });
  renderWithProviders('/assistants');
  await waitFor(() => screen.getByText('A'));
  expect(screen.getByText('Use')).toBeInTheDocument();
});
