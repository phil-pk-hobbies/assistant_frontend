import React, { useState } from 'react';
import api from '../api/axios';
import { useForm } from '../lib/form';

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
        <input
          className="border p-2 rounded"
          {...register('name', { required: 'Name is required' })}
        />
        <button className="bg-blue-600 text-white px-3 py-1 rounded" type="submit">
          Add
        </button>
      </form>
      {errors.name && <p className="text-red-600">{errors.name.message}</p>}
      {error && <p className="text-red-600">{error}</p>}
    </div>
  );
}
