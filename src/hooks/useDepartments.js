import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';

export function useDepartments() {
  return useQuery({
    queryKey: ['departments'],
    queryFn: async () => {
      const { data } = await api.get('/api/departments/');
      return data;
    },
  });
}
