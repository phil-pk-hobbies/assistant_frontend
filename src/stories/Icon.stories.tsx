import React from 'react';
import * as Icons from 'lucide-react';
import Icon from '../components/ui/Icon';

export default {
  title: 'Components/Icon',
};

export const All = () => {
  const names = Object.keys(Icons).slice(0, 120) as Array<keyof typeof Icons>;
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
