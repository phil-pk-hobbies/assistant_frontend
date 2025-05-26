import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export default function EditAssistantPage() {
  const { id } = useParams<{ id: string }>();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [instructions, setInstructions] = useState('');
  const [tools, setTools] = useState('');
  const [model, setModel] = useState('');
  const [models, setModels] = useState<string[]>([]);
  const [status, setStatus] = useState<string | null>(null);
  const [waiting, setWaiting] = useState(false);
  const navigate = useNavigate();

  const fetchModels = async () => {
    try {
      const key = import.meta.env.VITE_OPENAI_API_KEY;
      const res = await fetch('https://api.openai.com/v1/models', {
        headers: { Authorization: `Bearer ${key}` },
      });
      if (res.ok) {
        const data = await res.json();
        const list = Array.isArray(data.data) ? data.data : data;
        setModels(list.map((m: any) => m.id ?? m));
      }
    } catch {
      // ignore errors
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
          setTools(data.tools.join(', '));
        }
      }
    } catch {
      // ignore errors
    }
  };

  useEffect(() => {
    void fetchAssistant();
    void fetchModels();
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
        tools: tools
          .split(',')
          .map((t) => t.trim())
          .filter((t) => t.length > 0),
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
          className="border p-2 w-full"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
        />
        <textarea
          className="border p-2 w-full"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
        />
        <textarea
          className="border p-2 w-full"
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          placeholder="Instructions"
        />
        <select
          className="border p-2 w-full"
          value={model}
          onChange={(e) => setModel(e.target.value)}
        >
          <option value="">Select Model</option>
          {models.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
        <input
          className="border p-2 w-full"
          type="text"
          value={tools}
          onChange={(e) => setTools(e.target.value)}
          placeholder="Tools (comma separated)"
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
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
