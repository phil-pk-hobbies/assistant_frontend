import { useQuery } from '@tanstack/react-query';
import api from '../api/axios';

export function useAssistantUserShares(aid) {
  return useQuery({
    queryKey: ['assistant', 'shares', aid, 'users'],
    queryFn: async () => {
      const { data } = await api.get(`/api/assistants/${aid}/shares/users/`);
      return data;
    },
  });
}

export function useAssistantDeptShares(aid) {
  return useQuery({
    queryKey: ['assistant', 'shares', aid, 'depts'],
    queryFn: async () => {
      const { data } = await api.get(`/api/assistants/${aid}/shares/departments/`);
      return data;
    },
  });
}

export const addUserShare = (aid, payload) =>
  api.post(`/api/assistants/${aid}/shares/users/`, payload);

export const addDeptShare = (aid, payload) =>
  api.post(`/api/assistants/${aid}/shares/departments/`, payload);

export const removeUserShare = (aid, uid) =>
  api.delete(`/api/assistants/${aid}/shares/users/${uid}/`);

export const removeDeptShare = (aid, did) =>
  api.delete(`/api/assistants/${aid}/shares/departments/${did}/`);
