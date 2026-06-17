require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// POST /api/auth/login
app.post('/api/auth/login', async (req, res) => {
  const { role, username, password } = req.body;

  try {
    if (role === 'admin') {
      const { data, error } = await supabase
        .from('admins')
        .select('*')
        .eq('username', username)
        .eq('password', password)
        .single();
      
      if (error || !data) return res.status(401).json({ error: 'Invalid admin credentials' });
      return res.json(data);
    } else {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .ilike('first_name', username)
        .single();

      if (error || !data) return res.status(401).json({ error: 'Customer not found' });
      return res.json(data);
    }
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/customers
app.get('/api/customers', async (req, res) => {
  const { data, error } = await supabase.from('customers').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// GET /api/customers/:id
app.get('/api/customers/:id', async (req, res) => {
  const { data, error } = await supabase.from('customers').select('*').eq('id', req.params.id).single();
  if (error) return res.status(404).json({ error: 'Customer not found' });
  res.json(data);
});

// DELETE /api/customers/:id
app.delete('/api/customers/:id', async (req, res) => {
  const { error } = await supabase.from('customers').delete().eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: 'Customer deleted successfully' });
});

// POST /api/customers
app.post('/api/customers', async (req, res) => {
  const { first_name } = req.body;
  if (!first_name) return res.status(400).json({ error: 'First name is required' });
  
  const { data, error } = await supabase.from('customers').insert([
    { first_name, role: 'customer' }
  ]).select();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data[0]);
});

// GET /api/debts
app.get('/api/debts', async (req, res) => {
  const { data, error } = await supabase.from('debts').select('*').order('date', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// GET /api/debts/customer/:id
app.get('/api/debts/customer/:id', async (req, res) => {
  const { data, error } = await supabase.from('debts').select('*').eq('customer_id', req.params.id).order('date', { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// POST /api/debts
app.post('/api/debts', async (req, res) => {
  const { customer_id, item_name, amount } = req.body;
  const { data, error } = await supabase.from('debts').insert([
    { customer_id, item_name, amount, status: 'unpaid' }
  ]).select();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data[0]);
});

// PUT /api/debts/:id/pay
app.put('/api/debts/:id/pay', async (req, res) => {
  const { error } = await supabase.from('debts').update({ status: 'paid' }).eq('id', req.params.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: 'Debt marked as paid' });
});

if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`Backend service listening on port ${port}`);
  });
}

module.exports = app;
