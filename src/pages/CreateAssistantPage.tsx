import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import TextArea from '../components/ui/TextArea';
import Select from '../components/ui/Select';

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
      <Button variant="secondary" onClick={() => navigate(-1)}>
        Back
      </Button>
      <h1 className="text-xl font-bold">Create Assistant</h1>
      <div className="space-y-2">
        <div className="space-y-1">
          <span>Name</span>
          <Input
            className="w-full"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
          />
        </div>
        <div className="space-y-1">
          <span>Description</span>
          <TextArea
            className="w-full"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
          />
        </div>
        <div className="space-y-1">
          <span>Instructions</span>
          <TextArea
            className="w-full"
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="Instructions"
          />
        </div>
        <div className="space-y-1">
          <span>Model</span>
          <Select
            className="w-full"
            value={model}
            onChange={(e) => setModel(e.target.value)}
          >
            <option value="">Select Model</option>
            {MODEL_OPTIONS.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </Select>
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
                className="w-full"
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
              variant="ghost"
              className="text-red-600 text-xl leading-none px-2"
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
            variant="secondary"
            size="sm"
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
          className={creating ? 'bg-neutral5' : ''}
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
