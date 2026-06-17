import React from 'react';

export const Input = ({ label, id, ...props }) => {
  return (
    <div className="flex flex-col gap-2 mt-4">
      {label && <label htmlFor={id} style={{ fontWeight: '500', color: 'var(--text-muted)', fontSize: '0.875rem' }}>{label}</label>}
      <input
        id={id}
        style={{
          padding: '0.75rem 1rem',
          border: '1px solid var(--surface-border)',
          backgroundColor: 'var(--surface)',
          borderRadius: 'var(--radius-md)',
          outline: 'none',
          fontSize: '1rem',
          transition: 'all 0.2s ease',
          color: 'var(--text-main)',
          boxShadow: 'var(--shadow-sm)',
        }}
        onFocus={(e) => {
          e.target.style.border = '1px solid var(--primary)';
          e.target.style.boxShadow = '0 0 0 1px var(--primary)';
        }}
        onBlur={(e) => {
          e.target.style.border = '1px solid var(--surface-border)';
          e.target.style.boxShadow = 'var(--shadow-sm)';
        }}
        {...props}
      />
    </div>
  );
};
