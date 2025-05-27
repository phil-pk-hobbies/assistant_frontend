import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../api/axios';

export function useUsers() {
  return useQuery(['users'], async () => {
    const { data } = await api.get('/api/users/');
    return data;
  });
}

export function useCreateUser() {
  const qc = useQueryClient();
  return useMutation((payload) => api.post('/api/users/', payload), {
    onSuccess: () => qc.invalidateQueries(['users']),
  });
}

export function useUpdateUser() {
  const qc = useQueryClient();
  return useMutation(({ id, data }) => api.patch(`/api/users/${id}/`, data), {
    onSuccess: () => qc.invalidateQueries(['users']),
  });
}

export function useToggleActive() {
  const qc = useQueryClient();
  return useMutation(
    ({ id, active }) => api.patch(`/api/users/${id}/`, { is_active: active }),
    { onSuccess: () => qc.invalidateQueries(['users']) },
  );
}

export function useResetPassword() {
  const qc = useQueryClient();
  return useMutation(({ id, body = {} }) => api.post(`/api/users/${id}/reset_password/`, body), {
    onSuccess: () => qc.invalidateQueries(['users']),
  });
}
