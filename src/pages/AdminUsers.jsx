import React, { useState } from 'react';
import { useForm } from '../lib/form';
import { useUsers, useCreateUser, useToggleActive, useResetPassword } from '../hooks/useUsers';
import { useDepartments } from '../hooks/useDepartments';

export default function AdminUsers() {
  const { data: users } = useUsers();
  const { data: departments } = useDepartments();
  const createUser = useCreateUser();
  const toggleActive = useToggleActive();
  const resetPassword = useResetPassword();

  const [adding, setAdding] = useState(false);
  const addForm = useForm({ defaultValues: { username: '', first_name: '', last_name: '', department: '', password: '', password2: '', is_active: true } });

  const submitAdd = async (values) => {
    if (values.password.length < 8) {
      return;
    }
    if (values.password !== values.password2) {
      return;
    }
    await createUser.mutateAsync({
      username: values.username,
      first_name: values.first_name,
      last_name: values.last_name,
      department: values.department,
      password: values.password,
      is_active: values.is_active,
    }).then(() => {
      addForm.reset();
      setAdding(false);
    });
  };

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-xl font-bold">Users</h1>
      <button className="bg-accent text-white px-3 py-1 rounded" onClick={() => setAdding(true)}>Add User</button>
      {adding && (
        <dialog open className="border p-4 rounded">
          <form onSubmit={addForm.handleSubmit(submitAdd)} className="space-y-2">
            <input placeholder="Username" className="border p-1 w-full" {...addForm.register('username', { required: true })} />
            <input placeholder="First name" className="border p-1 w-full" {...addForm.register('first_name')} />
            <input placeholder="Last name" className="border p-1 w-full" {...addForm.register('last_name')} />
            <select className="border p-1 w-full" {...addForm.register('department')}>
              <option value="">--</option>
              {departments?.map((d) => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
            <input type="password" placeholder="Password" className="border p-1 w-full" {...addForm.register('password', { minLength: 8 })} />
            <input type="password" placeholder="Confirm" className="border p-1 w-full" {...addForm.register('password2')} />
            <label className="flex items-center gap-1">
              <input type="checkbox" {...addForm.register('is_active')} /> Active
            </label>
            <div className="space-x-2">
              <button type="submit" className="bg-accent text-white px-3 py-1 rounded">Save</button>
              <button type="button" onClick={() => { setAdding(false); }}>Cancel</button>
            </div>
          </form>
        </dialog>
      )}
      <table className="w-full text-left border">
        <thead>
          <tr>
            <th className="border p-1">Username</th>
            <th className="border p-1">Name</th>
            <th className="border p-1">Department</th>
            <th className="border p-1">Active</th>
            <th className="border p-1">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users?.map((u) => (
            <tr key={u.id} className="border-t">
              <td className="p-1">{u.username}</td>
              <td className="p-1">{u.first_name} {u.last_name}</td>
              <td className="p-1">{u.department_name}</td>
              <td className="p-1">
                <input
                  type="checkbox"
                  checked={u.is_active}
                  onChange={(e) => toggleActive.mutate({ id: u.id, active: e.target.checked })}
                />
              </td>
              <td className="p-1">
                <button
                  onClick={() => resetPassword.mutate({ id: u.id })}
                  className="underline text-accentBlue"
                >
                  Reset Pwd
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
