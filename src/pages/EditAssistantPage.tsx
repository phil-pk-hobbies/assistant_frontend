import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';
import { useAssistant, NotAllowedError } from '../hooks/useAssistant';
import TextArea from '../components/ui/TextArea';

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
  const [newFiles, setNewFiles] = useState<{ id: string; file: File | null }[]>([]);
  const [removeFiles, setRemoveFiles] = useState<Set<string>>(new Set());
  const [vectorFiles, setVectorFiles] = useState<{ id: string; filename: string }[]>([]);
  const [vectorStatus, setVectorStatus] = useState<string | null>(null);
  const navigate = useNavigate();
  const { data: assistant, error } = useAssistant(id || '');
  const readonly = !!assistant && assistant.permission === 'use' && !assistant.owner;

  useEffect(() => {
    if (error instanceof NotAllowedError) {
      alert('Assistant not available');
      navigate('/assistants');
    }
  }, [error, navigate]);

  const deleteVectorFile = async (fileId: string) => {
    if (!id) return;
    if (!confirm('Remove this file from the vector store?')) {
      return;
    }
    try {
      await api.delete(`/api/assistants/${id}/vector-store/files/${fileId}/`);
      setVectorFiles((list) => list.filter((f) => f.id !== fileId));
    } catch (err: any) {
      setVectorStatus(`Error: ${err.message}`);
    }
  };


  useEffect(() => {
    const fetchVectorFiles = async () => {
      if (!id) return;
      try {
        const res = await api.get(`/api/assistants/${id}/vector-store/files/`);
        const data = res.data;
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
      } catch (err: any) {
        if (err.response?.status === 404) {
          setVectorFiles([]);
          setVectorStatus(err.response.data || 'No vector store for this assistant.');
        } else {
          setVectorStatus(`Error: ${err.message}`);
        }
      }
    };
    if (assistant) {
      setName(assistant.name || '');
      setDescription(assistant.description || '');
      setInstructions(assistant.instructions || '');
      setModel(assistant.model || '');

      const hasFileSearch = Array.isArray(assistant.tools)
        ? assistant.tools.some((t: any) =>
            typeof t === 'string'
              ? t === 'file_search'
              : t && t.type === 'file_search',
          )
        : false;
      setFileSearch(hasFileSearch);

      if (Array.isArray(assistant.files)) {
        setExistingFiles(assistant.files);
      }

      if (hasFileSearch) {
        void fetchVectorFiles();
      } else {
        setVectorFiles([]);
        setVectorStatus('No vector store for this assistant.');
      }
    }
  }, [assistant, id]);

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
      newFiles.forEach(({ file }) => {
        if (file) {
          form.append('files', file);
        }
      });
      removeFiles.forEach((id) => form.append('remove_files', id));

      await api.patch(`/api/assistants/${id}/`, form);
      navigate('/assistants');
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
      {readonly && (
        <div className="bg-blue-100 text-blue-800 p-2 rounded">Read-only access</div>
      )}
      <div className="space-y-2">
        <div className="space-y-1">
          <span>Name</span>
          <input
            className="border p-2 w-full rounded-lg focus:outline focus:outline-2 focus:outline-accent"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            disabled={readonly}
          />
        </div>
        <div className="space-y-1">
          <span>Description</span>
          <textarea
            rows={4}
            className="border p-2 w-full rounded-lg focus:outline focus:outline-2 focus:outline-accent"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
            disabled={readonly}
          />
        </div>
        <div className="space-y-1">
          <span>Instructions</span>
          <TextArea
            rows={4}
            className="w-full"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="Instructions"
            disabled={readonly}
            autoResize
          />
        </div>
        <div className="space-y-1">
          <span>Model</span>
          <select
            className="border p-2 w-full rounded-lg focus:outline focus:outline-2 focus:outline-accent"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            disabled={readonly}
          >
            <option value="">Select Model</option>
            {MODEL_OPTIONS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            checked={fileSearch}
            onChange={(e) => setFileSearch(e.target.checked)}
            disabled={readonly}
          />
          <span>Enable file search</span>
        </div>
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
              <div key={f.id} className="flex items-center space-x-2">
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
              </div>
            ))}
          </div>
        )}

        {newFiles.map((f) => (
          <div key={f.id} className="flex items-center space-x-2">
            <div className="flex-1 space-y-1">
              <span>File</span>
              <input
                className="border p-2 w-full rounded-lg focus:outline focus:outline-2 focus:outline-accent"
                type="file"
                onChange={(e) =>
                  setNewFiles((cur) =>
                    cur.map((obj) =>
                      obj.id === f.id
                        ? { ...obj, file: e.target.files?.[0] ?? null }
                        : obj,
                    ),
                  )
                }
              />
            </div>
            <button
              type="button"
              className="text-red-600 text-xl leading-none px-2 focus:outline focus:outline-2 focus:outline-accent"
              onClick={() =>
                setNewFiles((cur) => cur.filter((obj) => obj.id !== f.id))
              }
            >
              &times;
            </button>
            Remove
          </div>
        ))}
        {newFiles.length < 20 && !readonly && (
          <button
            type="button"
            className="bg-gray-200 text-gray-700 px-2 py-1 rounded"
            onClick={() =>
              setNewFiles((cur) => [
                ...cur,
                { id: crypto.randomUUID(), file: null },
              ])
            }
          >
            Add File
          </button>
        )}
        <button
          className="bg-accent text-white px-4 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={waiting || readonly}
          onClick={updateAssistant}
        >
          Update
        </button>
        {status && <p>{status}</p>}
      </div>
    </div>
  );
}
