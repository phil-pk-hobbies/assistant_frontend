import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from '../App';
import { AuthProvider } from '../context/AuthContext';
import api from '../api/axios';

jest.mock('../api/axios');

function renderEdit(assistantData, vectorResponse) {
  api.post.mockResolvedValue({});
  api.get.mockImplementation((url) => {
    if (url === '/api/assistants/1/') {
      return Promise.resolve({ data: assistantData });
    }
    if (url === '/api/assistants/1/vector-store/files/') {
      if (vectorResponse === '404') {
        return Promise.reject({ response: { status: 404, data: 'missing' } });
      }
      return Promise.resolve({ data: vectorResponse });
    }
    return Promise.resolve({ data: { username: 'u' } });
  });

  return render(
    <MemoryRouter initialEntries={["/assistants/1/edit"]}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </MemoryRouter>,
  );
}

test('edit page loads without vector store request when file_search disabled', async () => {
  renderEdit({ id: '1', name: 'A', tools: [], files: [], model: 'gpt-4', owner: true }, []);
  await waitFor(() => screen.getByText(/edit assistant/i));
  expect(api.get).not.toHaveBeenCalledWith(
    '/api/assistants/1/vector-store/files/',
  );
});

test('shows message when vector store missing', async () => {
  renderEdit({ id: '1', name: 'A', tools: ['file_search'], files: [], model: 'gpt-4', owner: true }, '404');
  await waitFor(() => screen.getByText('No vector store for this assistant.'));
});
