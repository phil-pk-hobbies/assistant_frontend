import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';

function matches(u, q) {
  const term = q.toLowerCase();
  return (
    u.username?.toLowerCase().includes(term) ||
    `${u.first_name ?? ''} ${u.last_name ?? ''}`.toLowerCase().includes(term) ||
    (u.department_name ?? '').toLowerCase().includes(term)
  );
}

export function useUsersSearch(query) {
  const { data: users = [] } = useQuery({
    queryKey: ['users', 'all'],
    queryFn: async () => {
      const { data } = await api.get('/api/users/');
      return data;
    },
  });

  if (!query) {
    return { data: [] };
  }

  const filtered = users.filter((u) => matches(u, query));

  return { data: filtered };
}
