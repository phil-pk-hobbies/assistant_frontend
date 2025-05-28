import React from 'react';
import { Pencil, Trash2, X } from 'lucide-react';
const icons = { Pencil, Trash2, X } as const;
import Icon from '../components/ui/Icon';

export default {
  title: 'Components/Icon',
};

export const All = () => {
  const names = Object.keys(icons) as Array<keyof typeof icons>;
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, 80px)', gap: 16 }}>
      {names.map((name) => (
        <div key={name} style={{ textAlign: 'center', fontSize: 12 }}>
          <Icon name={name} />
          <div>{name}</div>
        </div>
      ))}
    </div>
  );
};
