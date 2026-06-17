import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { ArrowLeft, Store, User, CreditCard } from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL || '/api';

export const Login = () => {
  const [view, setView] = useState('home'); // 'home' or 'login'
  const [role, setRole] = useState('customer'); // 'customer' or 'admin'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRoleSelection = (selectedRole) => {
    setRole(selectedRole);
    setUsername('');
    setPassword('');
    setError('');
    setView('login');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role, username, password })
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Login failed');
      } else {
        if (role === 'admin') navigate('/admin');
        else navigate(`/customer/${data.id}`);
      }
    } catch (err) {
      setError('Connection error. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  if (view === 'home') {
    return (
      <div 
        style={{ 
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          height: '100%',
          backgroundColor: '#ffffff', 
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '5rem 2rem 4rem 2rem',
          boxSizing: 'border-box',
          zIndex: 9999,
          fontFamily: 'Playfair Display, Lora, Georgia, serif'
        }}
      >
        {/* Top Spacing */}
        <div style={{ flex: 1.2 }} />

        {/* Hello & Icon Wrapper */}
        <div 
          style={{ 
            width: '100%', 
            maxWidth: '360px', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <h1 
            style={{ 
              fontFamily: 'Playfair Display, Lora, Georgia, serif', 
              fontSize: '2.5rem', 
              fontWeight: '700', 
              color: '#000000',
              marginBottom: '1rem',
              letterSpacing: '-0.02em',
              textAlign: 'center',
              lineHeight: '1.2'
            }}
          >
            Welcome to Diana's Sari Sari
          </h1>
        </div>

        {/* Bottom Spacing */}
        <div style={{ flex: 1 }} />

        {/* Action Buttons */}
        <div 
          style={{ 
            width: '100%', 
            maxWidth: '340px', 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '0.875rem'
          }}
        >
          <button 
            onClick={() => handleRoleSelection('admin')}
            style={{
              width: '100%',
              backgroundColor: '#000000',
              color: '#ffffff',
              height: '54px',
              fontSize: '0.95rem',
              fontWeight: '600',
              borderRadius: '9999px',
              border: 'none',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#222222'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#000000'}
          >
            Continue as an Admin
          </button>

          <button 
            onClick={() => handleRoleSelection('customer')}
            style={{
              width: '100%',
              backgroundColor: '#eaeaea',
              color: '#000000',
              height: '54px',
              fontSize: '0.95rem',
              fontWeight: '600',
              borderRadius: '9999px',
              border: 'none',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#dcdcdc'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#eaeaea'}
          >
            Continue as a Customer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div 
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '100%',
        backgroundColor: '#ffffff', 
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        boxSizing: 'border-box',
        zIndex: 9999,
        overflowY: 'auto',
        fontFamily: 'Playfair Display, Lora, Georgia, serif'
      }}
    >
      <div style={{ width: '100%', maxWidth: '360px', display: 'flex', flexDirection: 'column' }}>
        <button 
          onClick={() => setView('home')} 
          style={{ 
            background: 'none', 
            border: 'none', 
            cursor: 'pointer', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.35rem', 
            color: '#666666', 
            fontSize: '0.875rem',
            marginBottom: '2rem',
            padding: 0,
            width: 'fit-content'
          }}
        >
          <ArrowLeft size={16} /> Back
        </button>

        <div className="text-center mb-8" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ display: 'inline-flex', padding: '1.25rem', backgroundColor: '#f8f9fa', borderRadius: '24px', border: '1.5px solid #eaeaea', marginBottom: '1.5rem' }}>
            {role === 'admin' ? (
              <Store size={36} color="#cccccc" strokeWidth={1.2} />
            ) : (
              <User size={36} color="#cccccc" strokeWidth={1.2} />
            )}
          </div>
          <h2 style={{ margin: 0, fontWeight: '700', fontSize: '1.875rem', letterSpacing: '-0.03em', color: '#000000' }}>
            {role === 'admin' ? 'Admin Login' : 'Customer Access'}
          </h2>
          <p style={{ fontSize: '0.875rem', color: '#666666', marginTop: '0.5rem' }}>
            {role === 'admin' ? 'Enter credentials to manage store' : 'Enter your name to view your ledger'}
          </p>
        </div>

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {role === 'admin' ? (
            <>
              <Input 
                label="Username" 
                id="username" 
                type="text" 
                placeholder="Admin username" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <Input 
                label="Password" 
                id="password" 
                type="password" 
                placeholder="Password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </>
          ) : (
            <Input 
              label="First Name" 
              id="firstname" 
              type="text" 
              placeholder="e.g. Juan" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          )}

          {error && <p className="text-center" style={{ fontSize: '0.875rem', color: 'var(--danger-text)', margin: '0.5rem 0 0 0' }}>{error}</p>}

          <button 
            type="submit" 
            disabled={loading} 
            style={{ 
              width: '100%',
              backgroundColor: '#000000',
              color: '#ffffff',
              height: '54px',
              fontSize: '0.95rem',
              fontWeight: '600',
              borderRadius: '9999px',
              border: 'none',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
              marginTop: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#222222'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#000000'}
          >
            {loading ? 'Processing...' : 'Continue'}
          </button>
        </form>
      </div>
    </div>
  );
};

