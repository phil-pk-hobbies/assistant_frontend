import React from 'react';
import { TOKENS } from '../tokens';

export default {
  title: 'Design System/Colors',
};

export const Colors = () => {
  const colors = Object.keys(TOKENS).filter(k => k.startsWith('color-'));
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
      {colors.map(name => (
        <div key={name} style={{ textAlign: 'center' }}>
          <div style={{ background: `var(--${name})`, width: 40, height: 40, borderRadius: '50%' }} />
          <div style={{ fontSize: 12 }}>{name}</div>
        </div>
      ))}
    </div>
  );
};
