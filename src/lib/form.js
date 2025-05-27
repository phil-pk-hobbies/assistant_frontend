import { useForm as useRHFForm } from 'react-hook-form';

export const useForm = (options = {}) => useRHFForm({ criteriaMode: 'all', ...options });

export * from 'react-hook-form';
