import React from 'react';

export const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyle = {
    padding: '0.625rem 1.25rem',
    fontWeight: '500',
    fontSize: '0.875rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0.5rem',
    borderRadius: 'var(--radius-md)',
    border: '1px solid transparent',
  };

  const variants = {
    primary: {
      backgroundColor: 'var(--primary)',
      color: '#ffffff',
    },
    secondary: {
      backgroundColor: 'var(--surface)',
      color: 'var(--text-main)',
      border: '1px solid var(--surface-border)',
      boxShadow: 'var(--shadow-sm)',
    },
    danger: {
      backgroundColor: 'var(--danger-text)',
      color: '#ffffff',
    },
    success: {
      backgroundColor: 'var(--success-text)',
      color: '#ffffff',
    },
    outline: {
      backgroundColor: 'transparent',
      border: '1px solid var(--surface-border)',
      color: 'var(--text-main)',
    }
  };

  const variantStyle = variants[variant] || variants.primary;

  return (
    <button 
      style={{ ...baseStyle, ...variantStyle }}
      className={className}
      onMouseEnter={(e) => {
        if(variant === 'primary' || variant === 'danger' || variant === 'success') {
          e.target.style.opacity = '0.9';
        } else {
          e.target.style.backgroundColor = 'var(--bg-color)';
        }
      }}
      onMouseLeave={(e) => {
        e.target.style.opacity = '1';
        e.target.style.backgroundColor = variantStyle.backgroundColor;
      }}
      {...props}
    >
      {children}
    </button>
  );
};
