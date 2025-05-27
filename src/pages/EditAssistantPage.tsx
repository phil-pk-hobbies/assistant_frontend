import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const MODEL_OPTIONS = ['gpt-4', 'gpt-4o', 'o3-mini'];

export default function EditAssistantPage() {
  const { id } = useParams<{ id: string }>();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [instructions, setInstructions] = useState('');
  const [fileSearch, setFileSearch] = useState(false);
  const [model, setModel] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [waiting, setWaiting] = useState(false);
  const [existingFiles, setExistingFiles] = useState<{ id: string; name: string }[]>([]);
  const [newFiles, setNewFiles] = useState<(File | null)[]>([]);
  const [removeFiles, setRemoveFiles] = useState<Set<string>>(new Set());
  const [vectorFiles, setVectorFiles] = useState<{ id: string; filename: string }[]>([]);
  const [vectorStatus, setVectorStatus] = useState<string | null>(null);
  const navigate = useNavigate();

  const deleteVectorFile = async (fileId: string) => {
    if (!id) return;
    if (!confirm('Remove this file from the vector store?')) {
      return;
    }
    try {
      const res = await fetch(
        `/api/assistants/${id}/vector-store/files/${fileId}/`,
        {
          method: 'DELETE',
        },
      );
      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || res.statusText);
      }
      setVectorFiles((list) => list.filter((f) => f.id !== fileId));
    } catch (err: any) {
      setVectorStatus(`Error: ${err.message}`);
    }
  };

  const fetchAssistant = async () => {
    try {
      const res = await fetch(`/api/assistants/${id}/`);
      if (res.ok) {
        const data = await res.json();
        setName(data.name || '');
        setDescription(data.description || '');
        setInstructions(data.instructions || '');
        setModel(data.model || '');
        if (Array.isArray(data.tools)) {
          setFileSearch(
            data.tools.some((t: any) =>
              typeof t === 'string'
                ? t === 'file_search'
                : t && t.type === 'file_search'
            )
          );
        }
        if (Array.isArray(data.files)) {
          setExistingFiles(data.files);
        }
      }
    } catch {
      // ignore errors
    }
  };

  useEffect(() => {
    void fetchAssistant();
    const fetchVectorFiles = async () => {
      if (!id) return;
      try {
        const res = await fetch(`/api/assistants/${id}/vector-store/files/`);
        if (res.ok) {
          const data = await res.json();
          const items = Array.isArray(data)
            ? data.map((f: any) => ({
                ...f,
                filename:
                  f.filename ??
                  f.name ??
                  f.file_name ??
                  f.file_id ??
                  '',
                id: f.id ?? f.file_id,
              }))
            : [];
          setVectorFiles(items);
        } else if (res.status === 404) {
          const msg = await res.text();
          setVectorStatus(msg || 'No vector store for this assistant.');
        } else {
          const msg = await res.text();
          throw new Error(msg || res.statusText);
        }
      } catch (err: any) {
        setVectorStatus(`Error: ${err.message}`);
      }
    };

    void fetchVectorFiles();
  }, [id]);

  const updateAssistant = async () => {
    if (waiting) {
      return;
    }
    setStatus(null);
    setWaiting(true);
    try {
      const form = new FormData();
      form.append('name', name);
      if (description.trim() !== '') form.append('description', description);
      if (instructions.trim() !== '') form.append('instructions', instructions);
      if (model) form.append('model', model);
      if (fileSearch) {
        form.append('tools', 'file_search');
      } else {
        // clear existing tools by sending an empty value
        form.append('tools', '[]');
      }
      newFiles.forEach((f) => {
        if (f) {
          form.append('files', f);
        }
      });
      removeFiles.forEach((id) => form.append('remove_files', id));

      const res = await fetch(`/api/assistants/${id}/`, {
        method: 'PATCH',
        body: form,
      });
      if (!res.ok) {
        const data = await res.text();
        throw new Error(data || res.statusText);
      }
      navigate('/');
    } catch (err: any) {
      setStatus(`Error: ${err.message}`);
    } finally {
      setWaiting(false);
    }
  };

  return (
    <div className="p-4 space-y-4 max-w-md mx-auto">
      <button
        className="bg-gray-200 text-gray-700 px-3 py-1 rounded"
        onClick={() => navigate(-1)}
      >
        Back
      </button>
      <h1 className="text-xl font-bold">Edit Assistant</h1>
      <div className="space-y-2">
        <input
          className="border p-2 w-full rounded-lg focus:outline focus:outline-2 focus:outline-accent"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
        />
        <textarea
          className="border p-2 w-full rounded-lg focus:outline focus:outline-2 focus:outline-accent"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
        />
        <textarea
          className="border p-2 w-full rounded-lg focus:outline focus:outline-2 focus:outline-accent"
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          placeholder="Instructions"
        />
        <select
          className="border p-2 w-full rounded-lg focus:outline focus:outline-2 focus:outline-accent"
          value={model}
          onChange={(e) => setModel(e.target.value)}
        >
          <option value="">Select Model</option>
          {MODEL_OPTIONS.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={fileSearch}
            onChange={(e) => setFileSearch(e.target.checked)}
          />
          <span>Enable file search</span>
        </label>
        {vectorStatus && <p>{vectorStatus}</p>}
        {vectorFiles.length > 0 && (
          <div className="space-y-1">
            <p className="font-semibold">Vector store files</p>
            <ul className="list-disc list-inside space-y-1">
              {vectorFiles.map((vf) => (
                <li key={vf.id} className="flex items-center justify-between">
                  <span>{vf.filename}</span>
                  <button
                    type="button"
                    className="ml-2 text-red-600 px-2 py-1 rounded focus:outline focus:outline-2 focus:outline-accent"
                    onClick={() => void deleteVectorFile(vf.id)}
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
        {existingFiles.length > 0 && (
          <div className="space-y-1">
            <p className="font-semibold">Remove files</p>
            {existingFiles.map((f) => (
              <label key={f.id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={removeFiles.has(f.id)}
                  onChange={(e) => {
                    setRemoveFiles((cur) => {
                      const next = new Set(cur);
                      if (e.target.checked) {
                        next.add(f.id);
                      } else {
                        next.delete(f.id);
                      }
                      return next;
                    });
                  }}
                />
                <span>{f.name}</span>
              </label>
            ))}
          </div>
        )}
        {newFiles.map((_, i) => (
          <input
            key={i}
            className="border p-2 w-full rounded-lg focus:outline focus:outline-2 focus:outline-accent"
            type="file"
            onChange={(e) =>
              setNewFiles((cur) => {
                const next = [...cur];
                next[i] = e.target.files?.[0] ?? null;
                return next;
              })
            }
          />
        ))}
        {newFiles.length < 20 && (
          <button
            type="button"
            className="bg-gray-200 text-gray-700 px-2 py-1 rounded"
            onClick={() => setNewFiles((cur) => [...cur, null])}
          >
            Add File
          </button>
        )}
        <button
          className="bg-accent text-white px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={waiting}
          onClick={updateAssistant}
        >
          Update
        </button>
        {status && <p>{status}</p>}
      </div>
    </div>
  );
}
