import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MODEL_OPTIONS = ['gpt-4', 'gpt-4o', 'o1-mini', 'o3-mini'];

export default function CreateAssistantPage() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [instructions, setInstructions] = useState('');
  const [tools, setTools] = useState('');
  const [model, setModel] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const navigate = useNavigate();

  const createAssistant = async () => {
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
      const res = await fetch('/api/assistants/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.text();
        throw new Error(data || res.statusText);
      }
      setStatus('Assistant created successfully');
      navigate('/');
    } catch (err: any) {
      setStatus(`Error: ${err.message}`);
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
        <input
          className="border p-2 w-full rounded-lg focus:outline focus:outline-2 focus:outline-accent"
          type="text"
          value={tools}
          onChange={(e) => setTools(e.target.value)}
          placeholder="Tools (comma separated)"
        />
        <button
          className="bg-accent text-white px-4 py-2 rounded-lg"
          onClick={createAssistant}
        >
          Create
        </button>
        {status && <p>{status}</p>}
      </div>
    </div>
  );
}
