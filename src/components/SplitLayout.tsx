import React from 'react';

interface SplitLayoutProps {
  children: React.ReactNode;
}

export default function SplitLayout({ children }: SplitLayoutProps) {
  return (
    <main className="app flex flex-col md:flex-row h-screen">
      {children}
    </main>
  );
}
