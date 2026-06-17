import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { LogOut, Receipt } from 'lucide-react';
import { Loading } from '../../components/Loading';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

export const CustomerDashboard = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [debts, setDebts] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const handleLogout = () => {
    navigate('/');
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
        <div>
          <h2 style={{ margin: 0, fontWeight: '500' }}>Hello, {customer.first_name}!</h2>
          <p style={{ fontSize: '0.875rem' }}>Your Debt Summary</p>
        </div>
        <Button variant="secondary" onClick={handleLogout}>
          <LogOut size={16} strokeWidth={1.5} /> Logout
        </Button>
      </div>

      <Card className="mb-8" style={{ backgroundColor: '#111111', color: '#ffffff', border: 'none', padding: '1.75rem 2rem' }}>
        <div className="stats-card-inner">
          <div style={{ padding: '1.1rem', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <Receipt size={28} color="#ffffff" strokeWidth={1.5} />
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

      <h3 className="mb-4" style={{ fontWeight: '500' }}>Transaction History</h3>
      <div className="flex flex-col gap-3">
        {debts.length === 0 ? (
          <p className="text-center mt-8">You have no recorded debts. Thank you!</p>
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
              <div>
                <strong style={{ fontSize: '1.25rem', fontWeight: '500' }}>₱{Number(debt.amount).toLocaleString()}</strong>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
