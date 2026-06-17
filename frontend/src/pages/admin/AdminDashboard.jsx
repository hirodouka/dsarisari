import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { LogOut, ArrowRight, Wallet, Plus } from 'lucide-react';
import { Input } from '../../components/Input';
import { Loading } from '../../components/Loading';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const AdminDashboard = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [debts, setDebts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCustomerName, setNewCustomerName] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [customersRes, debtsRes] = await Promise.all([
          fetch(`${API_URL}/customers`),
          fetch(`${API_URL}/debts`)
        ]);
        
        if (customersRes.ok) setCustomers(await customersRes.json());
        if (debtsRes.ok) setDebts(await debtsRes.json());
      } catch (err) {
        console.error('Failed to fetch from backend', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalReceivables = debts
    .filter(d => d.status === 'unpaid')
    .reduce((sum, debt) => sum + Number(debt.amount), 0);

  const handleLogout = () => {
    navigate('/');
  };

  const handleAddCustomer = async (e) => {
    e.preventDefault();
    if (!newCustomerName) return;
    
    try {
      const res = await fetch(`${API_URL}/customers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ first_name: newCustomerName })
      });
      if (res.ok) {
        const newCustomer = await res.json();
        setCustomers([...customers, newCustomer]);
        setShowAddForm(false);
        setNewCustomerName('');
      } else {
        alert('Error adding customer');
      }
    } catch (err) {
      alert('Connection error');
    }
  };

  if (loading) {
    return <div style={{ minHeight: '100vh', backgroundColor: '#ffffff' }} />;
  }

  return (
    <div className="container fade-in">
      <div className="flex justify-between items-center mb-8" style={{ flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2 style={{ margin: 0, fontWeight: '500' }}>Admin Dashboard</h2>
          <p style={{ fontSize: '0.875rem' }}>Store Overview</p>
        </div>
        <Button variant="secondary" onClick={handleLogout}>
          <LogOut size={16} strokeWidth={1.5} /> Logout
        </Button>
      </div>

      <Card className="mb-8" style={{ backgroundColor: 'var(--primary)', color: '#ffffff', border: 'none' }}>
        <div className="flex items-center gap-4">
          <div style={{ padding: '1rem', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 'var(--radius-md)' }}>
            <Wallet size={28} color="#ffffff" strokeWidth={1.5} />
          </div>
          <div>
            <p style={{ color: 'rgba(255,255,255,0.7)', margin: 0, fontSize: '0.875rem', fontWeight: '400' }}>Total Receivables (Unpaid)</p>
            <h1 style={{ color: '#ffffff', margin: 0, fontSize: '2.5rem', fontWeight: '400', letterSpacing: '-0.02em' }}>₱{totalReceivables.toLocaleString()}</h1>
          </div>
        </div>
      </Card>

      <div className="flex justify-between items-center mb-4">
        <h3 style={{ fontWeight: '500', margin: 0 }}>Customers</h3>
        <Button onClick={() => setShowAddForm(!showAddForm)}>
          <Plus size={16} strokeWidth={1.5} /> Add Customer
        </Button>
      </div>

      {showAddForm && (
        <Card className="mb-6" style={{ backgroundColor: '#ffffff', border: '1px solid var(--surface-border)' }}>
          <h4 style={{ fontWeight: '500', marginBottom: '1rem' }}>New Customer</h4>
          <form onSubmit={handleAddCustomer} className="flex flex-col gap-4">
            <Input 
              label="First Name" 
              value={newCustomerName} 
              onChange={(e) => setNewCustomerName(e.target.value)} 
              placeholder="e.g. Juan" 
              required 
            />
            <div className="flex gap-2 justify-end mt-4">
              <Button variant="secondary" type="button" onClick={() => setShowAddForm(false)}>Cancel</Button>
              <Button type="submit">Save Customer</Button>
            </div>
          </form>
        </Card>
      )}

      <div className="flex flex-col gap-4">
        {customers.map(customer => {
          const customerDebts = debts.filter(d => d.customer_id === customer.id);
          const totalDebt = customerDebts
            .filter(d => d.status === 'unpaid')
            .reduce((sum, d) => sum + Number(d.amount), 0);
          
          return (
            <Card key={customer.id} className="flex justify-between items-center" style={{ padding: '1.25rem 1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h4 style={{ margin: 0, fontSize: '1.125rem', fontWeight: '500' }}>{customer.first_name}</h4>
                <p style={{ margin: 0, fontSize: '0.875rem' }}>{customerDebts.filter(d => d.status === 'unpaid').length} unpaid items</p>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total Debt</p>
                  <strong style={{ fontSize: '1.125rem', fontWeight: '500' }}>₱{totalDebt.toLocaleString()}</strong>
                </div>
                <Button variant="secondary" onClick={() => navigate(`/admin/customer/${customer.id}`)}>
                  View <ArrowRight size={16} strokeWidth={1.5} />
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
