import React from 'react';
import { useNavigate } from 'react-router-dom';
import PermissionBadge from './PermissionBadge';
import Button from './ui/Button';
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
      className="border border-neutral3 p-4 rounded-lg cursor-pointer hover:bg-neutral1 flex items-start"
      onClick={() => navigate(`/assistants/${assistant.id}`)}
    >
      <div className="flex-grow">
        <h2 className="text-lg font-semibold">{assistant.name}</h2>
        <p className="text-sm text-neutral7 whitespace-pre-line">
          {assistant.description}
        </p>
        <p className="text-sm text-neutral6">Model: {assistant.model}</p>
      </div>
      <div className="flex flex-col items-end ml-2 gap-1">
        <PermissionBadge owner={assistant.owner} permission={assistant.permission} />
        {canEdit && (
          <div className="flex gap-1">
            <Button
              aria-label="Edit"
              title="Edit"
              className="bg-transparent text-neutral7 px-2 py-1"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/assistants/${assistant.id}/edit`);
              }}
            >
              ✏️
            </Button>
            <Button
              aria-label="Delete"
              title="Delete"
              className="bg-transparent text-danger px-2 py-1"
              onClick={(e) => {
                e.stopPropagation();
                onDelete && onDelete(assistant.id);
              }}
            >
              🗑
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
