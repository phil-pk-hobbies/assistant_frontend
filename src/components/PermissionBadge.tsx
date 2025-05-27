import React from 'react';
import classNames from 'classnames';

interface Props {
  owner?: boolean;
  permission?: 'use' | 'edit';
}

export default function PermissionBadge({ owner, permission }: Props) {
  let label = 'Use';
  let color = 'bg-gray-500';

  if (owner) {
    label = 'Owner';
    color = 'bg-purple-600';
  } else if (permission === 'edit') {
    label = 'Edit';
    color = 'bg-green-600';
  }

  return (
    <span className={classNames('text-xs text-white px-2 py-0.5 rounded', color)}>
      {label}
    </span>
  );
}
