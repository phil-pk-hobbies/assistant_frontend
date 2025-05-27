import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Button from '../components/Button';
import Input from '../components/Input';

const MODEL_OPTIONS = ['gpt-4', 'gpt-4o', 'o3-mini'];

export default function CreateAssistantPage() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [instructions, setInstructions] = useState('');
  const [fileSearch, setFileSearch] = useState(false);
  const [model, setModel] = useState('');
  const [files, setFiles] = useState<{ id: string; file: File | null }[]>([
    { id: crypto.randomUUID(), file: null },
  ]);
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
      files.forEach(({ file }) => {
        if (file) {
          form.append('files', file);
        }
      });

      const res = await api.post('/api/assistants/', form);
      setStatus('Assistant created successfully');
      navigate('/assistants');
    } catch (err: any) {
      setStatus(`Error: ${err.message}`);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="p-4 space-y-4 max-w-md mx-auto">
      <Button className="bg-neutral2 text-text-primary" onClick={() => navigate(-1)}>
        Back
      </Button>
      <h1 className="text-xl font-bold">Create Assistant</h1>
      <div className="space-y-2">
        <div className="space-y-1">
          <span>Name</span>
          <Input
            className="w-full focus:outline focus:outline-2 focus:outline-primary"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
          />
        </div>
        <div className="space-y-1">
          <span>Description</span>
          <textarea
            className="border border-neutral3 p-2 w-full rounded-lg focus:outline focus:outline-2 focus:outline-primary"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
          />
        </div>
        <div className="space-y-1">
          <span>Instructions</span>
          <textarea
            className="border border-neutral3 p-2 w-full rounded-lg focus:outline focus:outline-2 focus:outline-primary"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="Instructions"
          />
        </div>
        <div className="space-y-1">
          <span>Model</span>
          <select
            className="border border-neutral3 p-2 w-full rounded-lg focus:outline focus:outline-2 focus:outline-primary"
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
        </div>
        <div className="flex items-center space-x-2">
          <Input
            type="checkbox"
            checked={fileSearch}
            onChange={(e) => setFileSearch(e.target.checked)}
          />
          <span>Enable file search</span>
        </div>

        {files.map((f) => (
          <div key={f.id} className="flex items-center space-x-2">
            <div className="flex-1 space-y-1">
              <span>File</span>
              <Input
                className="w-full focus:outline focus:outline-2 focus:outline-primary"
                type="file"
                onChange={(e) =>
                  setFiles((cur) =>
                    cur.map((obj) =>
                      obj.id === f.id
                        ? { ...obj, file: e.target.files?.[0] ?? null }
                        : obj,
                    ),
                  )
                }
              />
            </div>
            <Button
              type="button"
              className="text-red-600 text-xl leading-none px-2 focus:outline focus:outline-2 focus:outline-primary bg-transparent"
              onClick={() =>
                setFiles((cur) => cur.filter((obj) => obj.id !== f.id))
              }
            >
              &times;
            </Button>
            Remove
          </div>
        ))}
        {files.length < 20 && (
          <Button
            type="button"
            className="bg-neutral2 text-text-primary px-2 py-1"
            onClick={() =>
              setFiles((cur) => [
                ...cur,
                { id: crypto.randomUUID(), file: null },
              ])
            }
          >
            Add File
          </Button>
        )}
        <Button
          className={`px-4 py-2 rounded-lg ${creating ? 'bg-neutral5' : 'bg-primary'} disabled:cursor-not-allowed`}
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
        </Button>
        {status && <p>{status}</p>}
      </div>
    </div>
  );
}
