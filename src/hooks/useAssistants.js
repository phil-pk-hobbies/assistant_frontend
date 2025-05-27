import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';

export function useAssistants() {
  return useQuery({
    queryKey: ['assistants'],
    queryFn: async () => {
      const { data } = await api.get('/api/assistants/');
      return data;
    },
  });
}
