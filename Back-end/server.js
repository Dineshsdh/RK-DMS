// server.js - Express server for invoice API
const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
const dotenv = require('dotenv');
const multer = require('multer');

// Import route files
const invoiceRoutes = require('./invoice.routes');
const sweetRoutes = require('./sweets.routes');
const pdfRoutes = require('./pdf.routes');

dotenv.config();
const app = express();
const upload = multer({ storage: multer.memoryStorage() });

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || '*', // Allow frontend domain in production
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
app.use('/api/pdf', pdfRoutes); // Separate namespace for PDF endpoints

// Handle undefined routes (must be LAST)
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
