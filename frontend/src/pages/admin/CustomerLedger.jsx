import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { ArrowLeft, Plus, Check, Store, Trash2 } from 'lucide-react';
import { Loading } from '../../components/Loading';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const CustomerLedger = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [debts, setDebts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newAmount, setNewAmount] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [customerRes, debtsRes] = await Promise.all([
          fetch(`${API_URL}/customers/${id}`),
          fetch(`${API_URL}/debts/customer/${id}`)
        ]);
        
        if (customerRes.ok) setCustomer(await customerRes.json());
        if (debtsRes.ok) setDebts(await debtsRes.json());
      } catch (err) {
        console.error('Failed to fetch from backend', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <div style={{ minHeight: '100vh', backgroundColor: '#ffffff' }} />;
  if (!customer) return <div className="container mt-8 text-center">Customer not found</div>;

  const handleAddDebt = async (e) => {
    e.preventDefault();
    if (!newItemName || !newAmount) return;
    
    try {
      const res = await fetch(`${API_URL}/debts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_id: customer.id,
          item_name: newItemName,
          amount: parseFloat(newAmount)
        })
      });

      if (res.ok) {
        const newDebt = await res.json();
        setDebts([newDebt, ...debts]);
        setShowAddForm(false);
        setNewItemName('');
        setNewAmount('');
      } else {
        alert('Error adding debt');
      }
    } catch (err) {
      alert('Connection error');
    }
  };

  const handleMarkAsPaid = async (debtId) => {
    try {
      const res = await fetch(`${API_URL}/debts/${debtId}/pay`, { method: 'PUT' });
      if (res.ok) {
        setDebts(debts.map(d => d.id === debtId ? { ...d, status: 'paid' } : d));
      } else {
        alert('Error updating debt');
      }
    } catch (err) {
      alert('Connection error');
    }
  };

  const handleDeleteCustomer = async () => {
    if (!window.confirm(`Are you sure you want to delete ${customer.first_name} and all their transaction history?`)) {
      return;
    }
    try {
      const res = await fetch(`${API_URL}/customers/${customer.id}`, { method: 'DELETE' });
      if (res.ok) {
        navigate('/admin');
      } else {
        alert('Error deleting customer');
      }
    } catch (err) {
      alert('Connection error');
    }
  };

  const totalPurchases = debts
    .reduce((sum, d) => sum + Number(d.amount), 0);

  const totalPaid = debts
    .filter(d => d.status === 'paid')
    .reduce((sum, d) => sum + Number(d.amount), 0);

  const totalUnpaid = debts
    .filter(d => d.status === 'unpaid')
    .reduce((sum, d) => sum + Number(d.amount), 0);

  return (
    <div className="container fade-in">
      <div className="flex justify-between items-center mb-8" style={{ flexWrap: 'wrap', gap: '1rem' }}>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/admin')} 
            style={{ 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
              color: '#000000',
              padding: 0
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f1f3f5'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <ArrowLeft size={20} strokeWidth={2} />
          </button>
          <h2 style={{ margin: 0, fontWeight: '700', fontSize: '1.875rem', color: '#000000', letterSpacing: '-0.02em', display: 'flex', alignItems: 'center' }}>
            {customer.first_name}'s Ledger
          </h2>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button 
            onClick={handleDeleteCustomer}
            style={{
              backgroundColor: '#ffffff',
              color: '#dc2626',
              padding: '0.625rem 1.25rem',
              fontSize: '0.875rem',
              fontWeight: '600',
              borderRadius: '9999px',
              border: '1px solid #fee2e2',
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#fef2f2';
              e.currentTarget.style.borderColor = '#fca5a5';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#ffffff';
              e.currentTarget.style.borderColor = '#fee2e2';
            }}
          >
            <Trash2 size={16} strokeWidth={2} /> Delete Customer
          </button>
          <button 
            onClick={() => setShowAddForm(!showAddForm)}
            style={{
              backgroundColor: '#000000',
              color: '#ffffff',
              padding: '0.625rem 1.25rem',
              fontSize: '0.875rem',
              fontWeight: '600',
              borderRadius: '9999px',
              border: 'none',
              cursor: 'pointer',
              transition: 'background-color 0.2s',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#222222'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#000000'}
          >
            <Plus size={16} strokeWidth={2} /> Add Debt
          </button>
        </div>
      </div>

      <Card className="mb-8" style={{ backgroundColor: '#111111', color: '#ffffff', border: 'none', padding: '1.75rem 2rem' }}>
        <div className="stats-card-inner">
          <div style={{ padding: '1.1rem', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Store size={28} color="#ffffff" strokeWidth={1.5} />
          </div>
          <div className="stats-grid">
            <div className="stats-col">
              <p style={{ color: 'rgba(255,255,255,0.5)', margin: 0, fontSize: '0.7rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Total Purchases</p>
              <h2 style={{ color: '#ffffff', margin: '0.3rem 0 0 0', fontSize: '1.75rem', fontWeight: '700', letterSpacing: '-0.02em' }}>₱{totalPurchases.toLocaleString()}</h2>
            </div>
            <div className="stats-col" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <p style={{ color: 'rgba(255,255,255,0.5)', margin: 0, fontSize: '0.7rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Total Paid</p>
              <h2 style={{ color: '#ffffff', margin: '0.3rem 0 0 0', fontSize: '1.75rem', fontWeight: '700', letterSpacing: '-0.02em' }}>₱{totalPaid.toLocaleString()}</h2>
            </div>
            <div className="stats-col" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <p style={{ color: 'rgba(255,255,255,0.5)', margin: 0, fontSize: '0.7rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Total Unpaid Balance</p>
              <h2 style={{ color: '#ffffff', margin: '0.3rem 0 0 0', fontSize: '1.75rem', fontWeight: '700', letterSpacing: '-0.02em' }}>₱{totalUnpaid.toLocaleString()}</h2>
            </div>
          </div>
        </div>
      </Card>

      {showAddForm && (
        <Card className="mb-8" style={{ backgroundColor: '#ffffff', border: '1px solid var(--surface-border)' }}>
          <h4 style={{ fontWeight: '500', marginBottom: '1rem' }}>New Debt Entry</h4>
          <form onSubmit={handleAddDebt} className="flex flex-col gap-4">
            <Input 
              label="Item Name" 
              value={newItemName} 
              onChange={(e) => setNewItemName(e.target.value)} 
              placeholder="e.g. 1 Kilo Rice" 
              required 
            />
            <Input 
              label="Amount (₱)" 
              type="number" 
              value={newAmount} 
              onChange={(e) => setNewAmount(e.target.value)} 
              placeholder="0.00" 
              required 
            />
            <div className="flex gap-2 justify-end mt-4">
              <Button variant="secondary" type="button" onClick={() => setShowAddForm(false)}>Cancel</Button>
              <Button type="submit">Save Debt</Button>
            </div>
          </form>
        </Card>
      )}

      <hr style={{ border: 'none', borderTop: '1px solid #eaeaea', margin: '0.5rem 0 1.5rem 0' }} />

      <h3 className="mb-4" style={{ fontWeight: '600', fontSize: '1rem', color: '#000000', letterSpacing: '0.01em' }}>Transactions</h3>

      <div className="flex flex-col gap-3">
        {debts.length === 0 ? (
          <p className="text-center mt-8">No debts recorded for this customer.</p>
        ) : (
          debts.map(debt => (
            <Card key={debt.id} className="flex justify-between items-center" style={{ padding: '1.25rem 1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <strong style={{ display: 'block', fontWeight: '500', fontSize: '1rem' }}>{debt.item_name}</strong>
                <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{debt.date}</span>
                <div style={{ marginTop: '0.5rem' }}>
                  <span className={`badge ${debt.status === 'paid' ? 'badge-success' : 'badge-danger'}`}>
                    {debt.status}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <strong style={{ fontSize: '1.25rem', fontWeight: '500' }}>₱{Number(debt.amount).toLocaleString()}</strong>
                {debt.status === 'unpaid' && (
                  <Button variant="outline" onClick={() => handleMarkAsPaid(debt.id)} style={{ padding: '0.5rem 1rem' }}>
                    <Check size={16} strokeWidth={1.5} /> Set Paid
                  </Button>
                )}
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
