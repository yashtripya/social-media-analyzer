import React from 'react';

export default function Toast({ message }) {
  if (!message) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '2rem',
      right: '2rem',
      background: 'rgba(15, 23, 42, 0.95)',
      border: '1px solid var(--accent-purple)',
      color: '#fff',
      padding: '0.75rem 1.25rem',
      borderRadius: 'var(--radius-md)',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)',
      backdropFilter: 'blur(10px)',
      zIndex: 1000,
      fontSize: '0.9rem',
      fontWeight: 600,
      animation: 'fadeIn 0.2s ease-in-out'
    }}>
      ✨ {message}
    </div>
  );
}
