import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CreateAssistantPage() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [instructions, setInstructions] = useState('');
  const [tools, setTools] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const navigate = useNavigate();

  const createAssistant = async () => {
    try {
      const payload = {
        name,
        description,
        instructions,
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
        <input
          className="border p-2 w-full"
          type="text"
          value={tools}
          onChange={(e) => setTools(e.target.value)}
          placeholder="Tools (comma separated)"
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={createAssistant}
        >
          Create
        </button>
        {status && <p>{status}</p>}
      </div>
    </div>
  );
}
