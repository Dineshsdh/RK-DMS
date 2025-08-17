// server.js - Express server for invoice API
const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
const Invoice = require('./invoice.model');
const Sweet = require('./sweet.model');
const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/rk_dms').then(() => {
  console.log('MongoDB connected');
}).catch(err => {
  console.error('MongoDB connection error:', err);  
});

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

// Create invoice
app.post('/api/invoices', async (req, res) => {
  try {
    const invoice = new Invoice(req.body);
    await invoice.save();
    res.status(201).json(invoice);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all invoices
app.get('/api/invoices', async (req, res) => {
  try {
    const invoices = await Invoice.find().sort({ createdAt: -1 });
    res.json(invoices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all sweets
app.get('/api/sweets', async (req, res) => {
  try {
    const sweets = await Sweet.find();
    res.json(sweets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
