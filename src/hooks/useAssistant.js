import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';

export class NotAllowedError extends Error {}

export function useAssistant(id) {
  return useQuery({
    queryKey: ['assistant', id],
    queryFn: async () => {
      try {
        const { data } = await api.get(`/api/assistants/${id}/`);
        return data;
      } catch (err) {
        if (err.response?.status === 403 || err.response?.status === 404) {
          throw new NotAllowedError('Not allowed');
        }
        throw err;
      }
    },
    retry: false,
  });
}
