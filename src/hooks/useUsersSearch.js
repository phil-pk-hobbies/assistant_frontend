import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';

export function useUsersSearch(query) {
  return useQuery({
    queryKey: ['users', 'search', query],
    queryFn: async () => {
      if (!query) return [];
      const { data } = await api.get(`/api/users/?search=${encodeURIComponent(query)}`);
      return data;
    },
    enabled: !!query,
  });
}
