import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MODEL_OPTIONS = ['gpt-4', 'gpt-4o', 'o3-mini'];

export default function CreateAssistantPage() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [instructions, setInstructions] = useState('');
  const [fileSearch, setFileSearch] = useState(false);
  const [model, setModel] = useState('');
  const [files, setFiles] = useState<(File | null)[]>([null]);
  const [status, setStatus] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const navigate = useNavigate();

  const createAssistant = async () => {
    if (creating) {
      return;
    }
    setCreating(true);
    try {
      const form = new FormData();
      form.append('name', name);
      if (description.trim() !== '') form.append('description', description);
      if (instructions.trim() !== '') form.append('instructions', instructions);
      if (model) form.append('model', model);
      if (fileSearch) {
        form.append('tools', 'file_search');
      }
      files.forEach((f) => {
        if (f) {
          form.append('files', f);
        }
      });

      const res = await fetch('/api/assistants/', {
        method: 'POST',
        body: form,
      });
      if (!res.ok) {
        const data = await res.text();
        throw new Error(data || res.statusText);
      }
      setStatus('Assistant created successfully');
      navigate('/');
    } catch (err: any) {
      setStatus(`Error: ${err.message}`);
    } finally {
      setCreating(false);
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
      <h1 className="text-xl font-bold">Create Assistant</h1>
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
        {files.map((_, i) => (
          <input
            key={i}
            className="border p-2 w-full rounded-lg focus:outline focus:outline-2 focus:outline-accent"
            type="file"
            onChange={(e) =>
              setFiles((cur) => {
                const next = [...cur];
                next[i] = e.target.files?.[0] ?? null;
                return next;
              })
            }
          />
        ))}
        {files.length < 20 && (
          <button
            type="button"
            className="bg-gray-200 text-gray-700 px-2 py-1 rounded"
            onClick={() => setFiles((cur) => [...cur, null])}
          >
            Add File
          </button>
        )}
        <button
          className={`px-4 py-2 rounded-lg text-white ${creating ? 'bg-grey60' : 'bg-accent'} disabled:cursor-not-allowed`}
          disabled={creating}
          onClick={createAssistant}
        >
          {creating ? (
            <span className="loading-dots">
              <span></span>
              <span></span>
              <span></span>
            </span>
          ) : (
            'Create'
          )}
        </button>
        {status && <p>{status}</p>}
      </div>
    </div>
  );
}
