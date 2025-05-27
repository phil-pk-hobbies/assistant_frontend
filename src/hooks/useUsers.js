import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';

export function useUsers() {
  return useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const { data } = await api.get('/api/users/');
      return data;
    },
  });
}

export function useCreateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) => api.post('/api/users/', payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  });
}

export function useUpdateUser() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => api.patch(`/api/users/${id}/`, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  });
}

export function useToggleActive() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, active }) =>
      api.patch(`/api/users/${id}/`, { is_active: active }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  });
}

export function useResetPassword() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, body = {} }) =>
      api.post(`/api/users/${id}/reset_password/`, body),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  });
}
