import React from 'react';
import { useTheme } from '../context/ThemeContext';
import Icon from './ui/Icon';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      aria-label="Toggle dark mode"
      onClick={toggleTheme}
      className="fixed top-4 right-4 p-2 bg-surface border border-neutral4 rounded-full"
    >
      <Icon name={theme === 'dark' ? 'Sun' : 'Moon'} />
    </button>
  );
}
