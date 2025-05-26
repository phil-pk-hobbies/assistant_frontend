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
  const navigate = useNavigate();

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
          setFileSearch(data.tools.includes('file_search'));
        }
      }
    } catch {
      // ignore errors
    }
  };

  useEffect(() => {
    void fetchAssistant();
  }, [id]);

  const updateAssistant = async () => {
    if (waiting) {
      return;
    }
    setStatus(null);
    setWaiting(true);
    try {
      const payload = {
        name,
        description,
        instructions,
        model,
        tools: fileSearch ? ['file_search'] : [],
      };
      const res = await fetch(`/api/assistants/${id}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
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
