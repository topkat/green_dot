import React from 'react';

interface TerminalDisplayProps {
  children: React.ReactNode;
}

export default function TerminalDisplay({ children }: TerminalDisplayProps) {
  return (
    <div className="relative term flex flex-col p-8 py-5 text-accent-100 overflow-hidden bg-black/80 rounded-lg shadow-[inset_0_0_20px_rgba(0,0,0,0.5)] scanlines">
      {/* Scanlines overlay */}
      <div
        className="overlay pointer-events-none"
        style={{
          background: `repeating-linear-gradient(to bottom, rgba(0, 0, 0, 0.1) 0, rgba(0, 0, 0, 0.1) 2px, transparent 2px, transparent 4px)`,
          zIndex: 1,
        }}
      />
      <div
        className="overlay pointer-events-none"
        style={{
          background: `repeating-linear-gradient(to bottom, rgba(0, 0, 0, 0.3) 0, rgba(0, 0, 0, 0.3) 2px, transparent 2px, transparent 4px)`,
        }}
      />
      <div className="text-accent-200/80 relative terminal-content p-0 m-0" style={{ pointerEvents: 'auto' }}>
        {children}
      </div>
    </div>
  );
} 