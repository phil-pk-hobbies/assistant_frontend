import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';

interface VectorFile {
  id: string;
  filename: string;
  [key: string]: any;
}

export default function VectorStoreFilesPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [files, setFiles] = useState<VectorFile[]>([]);
  const [status, setStatus] = useState<string | null>(null);

  useEffect(() => {
    const fetchFiles = async () => {
      if (!id) return;
      try {
        const res = await api.get(`/api/assistants/${id}/vector-store/files/`);
        const data = res.data;
        const items = Array.isArray(data)
            ? data.map((f: any) => ({
                ...f,
                // Support older API responses that may not include a filename
                filename:
                  f.filename ??
                  f.name ??
                  f.file_name ??
                  f.file_id ??
                  '',
                id: f.id ?? f.file_id,
              }))
            : [];
        setFiles(items);
      } catch (err: any) {
        if (err.response?.status === 404) {
          setStatus(err.response.data || 'No vector store for this assistant.');
        } else {
          setStatus(`Error: ${err.message}`);
        }
      }
    };

    void fetchFiles();
  }, [id]);

  return (
    <div className="p-4 space-y-4 max-w-md mx-auto">
      <button
        className="bg-gray-200 text-gray-700 px-3 py-1 rounded"
        onClick={() => navigate(-1)}
      >
        Back
      </button>
      <h1 className="text-xl font-bold">Vector Store Files</h1>
      {status && <p>{status}</p>}
      {files.length > 0 && (
        <ul className="list-disc list-inside space-y-1">
          {files.map((f) => (
            <li key={f.id}>{f.filename}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
