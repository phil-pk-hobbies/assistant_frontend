import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useQueryClient } from '@tanstack/react-query';
import Button from './ui/Button';
import Input from './ui/Input';
import Select from './ui/Select';
import {
  useAssistantUserShares,
  useAssistantDeptShares,
  addUserShare,
  addDeptShare,
  removeUserShare,
  removeDeptShare,
} from '../hooks/useAssistantShares';
import { useUsersSearch } from '../hooks/useUsersSearch';
import useDebounce from '../hooks/useDebounce';
import { useDepartments } from '../hooks/useDepartments';

export default function ShareAssistantModal({ id, open, onClose, owner }) {
  const { data: userShares = [] } = useAssistantUserShares(id, { enabled: open && owner });
  const { data: deptShares = [] } = useAssistantDeptShares(id, { enabled: open && owner });
  const [tab, setTab] = useState('users');
  const [searchInput, setSearchInput] = useState('');
  const debounced = useDebounce(searchInput, 300);
  const { data: users = [] } = useUsersSearch(debounced);
  const { data: departments = [] } = useDepartments();
  const [perm, setPerm] = useState('use');
  const [selUser, setSelUser] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selDept, setSelDept] = useState('');
  const [status, setStatus] = useState(null);
  const qc = useQueryClient();

  useEffect(() => {
    if (!open) {
      setSearchInput('');
      setSelUser('');
      setShowSuggestions(false);
      setSelDept('');
      setPerm('use');
      setStatus(null);
    }
  }, [open]);

  if (!open || !owner) return null;

  const addUser = async () => {
    if (!selUser) return;
    try {
      await addUserShare(id, { user: selUser, permission: perm });
      qc.invalidateQueries(['assistant', 'shares', id, 'users']);
      qc.invalidateQueries(['assistants']);
      setSelUser('');
      setSearchInput('');
      setStatus('Access granted');
    } catch (err) {
      setStatus(err.response?.data || 'Error');
    }
  };

  const addDept = async () => {
    if (!selDept) return;
    try {
      await addDeptShare(id, { department: selDept, permission: perm });
      qc.invalidateQueries(['assistant', 'shares', id, 'depts']);
      qc.invalidateQueries(['assistants']);
      setSelDept('');
      setStatus('Access granted');
    } catch (err) {
      setStatus(err.response?.data || 'Error');
    }
  };

  const changeUserPerm = async (uid, p) => {
    try {
      await addUserShare(id, { user: uid, permission: p });
      qc.invalidateQueries(['assistant', 'shares', id, 'users']);
      qc.invalidateQueries(['assistants']);
    } catch (err) {
      setStatus(err.response?.data || 'Error');
    }
  };

  const changeDeptPerm = async (did, p) => {
    try {
      await addDeptShare(id, { department: did, permission: p });
      qc.invalidateQueries(['assistant', 'shares', id, 'depts']);
      qc.invalidateQueries(['assistants']);
    } catch (err) {
      setStatus(err.response?.data || 'Error');
    }
  };

  const removeUser = async (uid) => {
    if (!confirm('Remove user?')) return;
    try {
      await removeUserShare(id, uid);
      qc.invalidateQueries(['assistant', 'shares', id, 'users']);
      qc.invalidateQueries(['assistants']);
    } catch (err) {
      setStatus(err.response?.data || 'Error');
    }
  };

  const removeDept = async (did) => {
    if (!confirm('Remove department?')) return;
    try {
      await removeDeptShare(id, did);
      qc.invalidateQueries(['assistant', 'shares', id, 'depts']);
      qc.invalidateQueries(['assistants']);
    } catch (err) {
      setStatus(err.response?.data || 'Error');
    }
  };

  const body = (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded max-h-[90vh] overflow-y-auto w-full max-w-lg">
        <h2 className="text-lg font-bold mb-2">Share Assistant</h2>
        <div className="flex gap-2 mb-4">
          <Button size="sm" variant={tab==='users'?'primary':'secondary'} onClick={()=>setTab('users')}>Users</Button>
          <Button size="sm" variant={tab==='depts'?'primary':'secondary'} onClick={()=>setTab('depts')}>Departments</Button>
          <Button size="sm" variant="ghost" className="ml-auto" onClick={onClose}>✖️</Button>
        </div>
        {tab==='users' && (
          <div className="space-y-2">
            <table className="w-full text-sm">
              <tbody>
                {userShares.map((u)=> (
                  <tr key={u.id} className="border-b">
                    <td className="py-1">{u.name}</td>
                    <td>
                      <Select value={u.permission} onChange={e=>changeUserPerm(u.id,e.target.value)} className="text-sm">
                        <option value="use">Use</option>
                        <option value="edit">Edit</option>
                      </Select>
                    </td>
                    <td>
                      <Button variant="ghost" aria-label={`remove ${u.name}`} onClick={()=>removeUser(u.id)}>🗑</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex gap-2 items-start mt-2">
              <div className="relative flex-grow">
                <Input
                  value={searchInput}
                  onChange={e => { setSearchInput(e.target.value); setSelUser(''); setShowSuggestions(true); }}
                  onFocus={() => searchInput && setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
                  placeholder="Search users"
                  className="w-full"
                  aria-label="Search users"
                />
                {showSuggestions && searchInput && (
                  <ul className="absolute left-0 right-0 mt-1 border bg-white max-h-40 overflow-y-auto z-10 text-sm">
                    {users.filter(u=>!userShares.some(s=>s.id===u.id)).map(u=> (
                      <li key={u.id}>
                        <Button
                          type="button"
                          variant="ghost"
                          className="block w-full text-left px-2 py-1 hover:bg-grey90"
                          onMouseDown={e=>e.preventDefault()}
                          onClick={() => { setSelUser(u.id); setSearchInput(`${u.username} - ${u.first_name} ${u.last_name} (${u.department_name})`); setShowSuggestions(false); }}
                        >
                          {u.username} - {u.first_name} {u.last_name} ({u.department_name})
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <Select value={perm} onChange={e=>setPerm(e.target.value)} className="w-auto">
                <option value="use">Use</option>
                <option value="edit">Edit</option>
              </Select>
              <Button size="sm" onClick={addUser}>Add</Button>
            </div>
          </div>
        )}
        {tab==='depts' && (
          <div className="space-y-2">
            <table className="w-full text-sm">
              <tbody>
                {deptShares.map((d)=> (
                  <tr key={d.id} className="border-b">
                    <td className="py-1">{d.name}</td>
                    <td>
                      <Select value={d.permission} onChange={e=>changeDeptPerm(d.id,e.target.value)} className="text-sm">
                        <option value="use">Use</option>
                        <option value="edit">Edit</option>
                      </Select>
                    </td>
                    <td>
                      <Button variant="ghost" aria-label={`remove ${d.name}`} onClick={()=>removeDept(d.id)}>🗑</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="flex gap-2 items-center mt-2">
              <Select value={selDept} onChange={e=>setSelDept(e.target.value)} className="flex-grow">
                <option value="">Select department</option>
                {departments.filter(dep=>!deptShares.some(s=>s.id===dep.id)).map(dep=>(
                  <option key={dep.id} value={dep.id}>{dep.name}</option>
                ))}
              </Select>
              <Select value={perm} onChange={e=>setPerm(e.target.value)} className="w-auto">
                <option value="use">Use</option>
                <option value="edit">Edit</option>
              </Select>
              <Button size="sm" onClick={addDept}>Add</Button>
            </div>
          </div>
        )}
        {status && <p className="mt-2 text-sm text-gray-700">{status}</p>}
      </div>
    </div>
  );
  return createPortal(body, document.body);
}
