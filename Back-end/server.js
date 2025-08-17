// server.js - Express server for invoice API
const express = require('express');
const cors = require('cors');
const connectDB = require('./db');

// Import route files
const invoiceRoutes = require('./invoice.routes');
const sweetRoutes = require('./sweets.routes');

const app = express();

// Middleware
app.use(cors({
  origin: 'http://localhost:5173', // Vite default port
  credentials: true
}));
app.use(express.json());

// Connect to MongoDB
connectDB();

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Use route files
app.use('/api/invoices', invoiceRoutes);
app.use('/api/sweets', sweetRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Handle undefined routes
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
