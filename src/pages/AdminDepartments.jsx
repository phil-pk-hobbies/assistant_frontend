import React, { useState } from 'react';
import api from '../api/axios';
import { useForm } from '../lib/form';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

export default function AdminDepartments() {
  const [error, setError] = useState(null);
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: { name: '' },
  });

  const onSubmit = async ({ name }) => {
    try {
      await api.post('/api/departments/', { name });
      reset();
      setError(null);
    } catch (err) {
      const msg = err?.response?.data?.name?.[0] || 'Error';
      setError(msg);
    }
  };

  return (
    <div className="p-4 space-y-2">
      <h1 className="text-xl font-bold">Departments</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex space-x-2">
        <Input className="flex-grow" {...register('name', { required: 'Name is required' })} />
        <Button type="submit" size="sm">Add</Button>
      </form>
      {errors.name && <p className="text-red-600">{errors.name.message}</p>}
      {error && <p className="text-red-600">{error}</p>}
    </div>
  );
}
