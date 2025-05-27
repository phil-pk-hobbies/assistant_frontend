import React from 'react';
import { useNavigate } from 'react-router-dom';
import PermissionBadge from './PermissionBadge';
import type { Assistant } from '../pages/HomePage';

interface Props {
  assistant: Assistant & { permission?: 'use' | 'edit'; owner?: boolean };
  onDelete?: (id: string) => void;
}

export default function AssistantCard({ assistant, onDelete }: Props) {
  const navigate = useNavigate();
  const canEdit = assistant.owner || assistant.permission === 'edit';
  return (
    <div
      className="border p-4 rounded-lg cursor-pointer hover:bg-gray-50 flex items-start"
      onClick={() => navigate(`/assistants/${assistant.id}`)}
    >
      <div className="flex-grow">
        <h2 className="text-lg font-semibold">{assistant.name}</h2>
        <p className="text-sm text-gray-700 whitespace-pre-line">
          {assistant.description}
        </p>
        <p className="text-sm text-gray-500">Model: {assistant.model}</p>
      </div>
      <div className="flex flex-col items-end ml-2 gap-1">
        <PermissionBadge owner={assistant.owner} permission={assistant.permission} />
        {canEdit && (
          <div className="flex gap-1">
            <button
              aria-label="Edit"
              title="Edit"
              className="text-gray-700 px-2 py-1 rounded focus:outline focus:outline-2 focus:outline-accent"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/assistants/${assistant.id}/edit`);
              }}
            >
              ✏️
            </button>
            <button
              aria-label="Delete"
              title="Delete"
              className="text-red-600 px-2 py-1 rounded focus:outline focus:outline-2 focus:outline-accent"
              onClick={(e) => {
                e.stopPropagation();
                onDelete && onDelete(assistant.id);
              }}
            >
              🗑
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
