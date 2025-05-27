import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';
import { AuthProvider, useAuth } from '../context/AuthContext';
import api, { setTokens, registerAuthHooks } from '../api/axios';

jest.mock('../api/axios');

function renderWithProviders(route = '/login') {
  return render(
    <MemoryRouter initialEntries={[route]}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </MemoryRouter>,
  );
}

test('successful login sets auth & redirects', async () => {
  api.post.mockResolvedValueOnce({ data: { access: 'acc', refresh: 'ref' } });
  api.get.mockResolvedValueOnce({ data: { username: 'bob' } });
  renderWithProviders('/login');
  await userEvent.type(screen.getByLabelText(/username/i), 'bob');
  await userEvent.type(screen.getByLabelText(/password/i), 'pw');
  await userEvent.click(screen.getByRole('button', { name: /login/i }));
  await waitFor(() => expect(api.post).toHaveBeenCalled());
  expect(screen.getByText(/assistants/i)).toBeInTheDocument();
});

test('wrong creds shows error', async () => {
  api.post.mockRejectedValueOnce({ response: { status: 401 } });
  renderWithProviders('/login');
  await userEvent.type(screen.getByLabelText(/username/i), 'bob');
  await userEvent.type(screen.getByLabelText(/password/i), 'bad');
  await userEvent.click(screen.getByRole('button', { name: /login/i }));
  await waitFor(() => screen.getByText(/invalid username or password/i));
});

test('un-authed visit to protected URL redirects to login', async () => {
  renderWithProviders('/assistants');
  expect(screen.getByText(/login/i)).toBeInTheDocument();
});

test('expired access triggers refresh & retries original request', async () => {
  registerAuthHooks({ updateAccess: jest.fn(), logout: jest.fn() });
  setTokens('old', 'refresh');
  api.get
    .mockRejectedValueOnce({ response: { status: 401 }, config: {} })
    .mockResolvedValueOnce({ data: 'ok' });
  api.post.mockResolvedValueOnce({ data: { access: 'new' } });
  const res = await api.get('/assistants');
  expect(res.data).toBe('ok');
  expect(api.post).toHaveBeenCalledWith(
    '/api/token/refresh/',
    { refresh: 'refresh' },
    expect.anything(),
  );
});

function Dummy() {
  const { login, logout, user } = useAuth();
  return (
    <div>
      <button onClick={() => login('u', 'p')}>Login</button>
      <button onClick={logout}>Logout</button>
      <span>{user ? 'in' : 'out'}</span>
    </div>
  );
}

test('logout clears state', async () => {
  api.post.mockResolvedValueOnce({ data: { access: 'a', refresh: 'r' } });
  api.get.mockResolvedValueOnce({ data: { username: 'u' } });
  render(
    <AuthProvider>
      <Dummy />
    </AuthProvider>,
  );
  await userEvent.click(screen.getByText('Login'));
  await waitFor(() => expect(screen.getByText('in')).toBeInTheDocument());
  expect(localStorage.getItem('refresh')).toBe('r');
  await userEvent.click(screen.getByText('Logout'));
  expect(localStorage.getItem('refresh')).toBeNull();
  expect(screen.getByText('out')).toBeInTheDocument();
});
