import React from 'react';

export const Loading = () => {
  return (
    <div 
      style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '80vh',
        width: '100%',
        backgroundColor: '#ffffff'
      }}
    >
      <div 
        style={{
          width: '40px',
          height: '40px',
          border: '2px dashed #eaeaea',
          borderTop: '2px solid #000000',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          marginBottom: '1.5rem'
        }}
      />
      <p style={{ fontFamily: 'Playfair Display, Georgia, serif', fontSize: '1.05rem', color: '#888888', fontStyle: 'italic', letterSpacing: '0.02em', margin: 0 }}>
        Loading...
      </p>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
