// server.js - Express server for invoice API
const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
const dotenv = require('dotenv');
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');

// Import route files
const invoiceRoutes = require('./invoice.routes');
const sweetRoutes = require('./sweets.routes');
const pdfRoutes = require('./pdf.routes');

dotenv.config();
const app = express();
const upload = multer({ storage: multer.memoryStorage() });

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
app.use('/api/invoices', pdfRoutes); // PDF upload/view/delete endpoints

// WhatsApp Cloud API: send media and message
// Requires env vars: WHATSAPP_TOKEN, WHATSAPP_FROM_NUMBER_ID
app.post('/api/whatsapp/send-pdf', upload.single('file'), async (req, res, next) => {
  try {
    const whatsappToken = process.env.WHATSAPP_TOKEN;
    const fromNumberId = process.env.WHATSAPP_FROM_NUMBER_ID;
    const to = req.body.to; // E.164 format without +, e.g., 918489597443
    const caption = req.body.caption || '';

    if (!whatsappToken || !fromNumberId) {
      return res.status(500).json({ error: 'WhatsApp credentials not configured' });
    }
    if (!to) {
      return res.status(400).json({ error: 'Missing recipient number' });
    }
    if (!req.file) {
      return res.status(400).json({ error: 'Missing PDF file' });
    }

    // 1) Upload media to WhatsApp Cloud API
    const form = new FormData();
    form.append('messaging_product', 'whatsapp');
    form.append('type', 'application/pdf');
    form.append('file', req.file.buffer, {
      filename: req.file.originalname || 'invoice.pdf',
      contentType: 'application/pdf'
    });

    const mediaUploadUrl = `https://graph.facebook.com/v21.0/${fromNumberId}/media`;
    const mediaResp = await axios.post(mediaUploadUrl, form, {
      headers: {
        Authorization: `Bearer ${whatsappToken}`,
        ...form.getHeaders(),
      },
    });

    const mediaId = mediaResp.data && mediaResp.data.id;
    if (!mediaId) {
      return res.status(500).json({ error: 'Failed to upload media to WhatsApp' });
    }

    // 2) Send document message referencing uploaded media
    const messagesUrl = `https://graph.facebook.com/v21.0/${fromNumberId}/messages`;
    const msgBody = {
      messaging_product: 'whatsapp',
      to,
      type: 'document',
      document: {
        id: mediaId,
        caption,
        filename: req.file.originalname || 'invoice.pdf',
      },
    };

    const sendResp = await axios.post(messagesUrl, msgBody, {
      headers: {
        Authorization: `Bearer ${whatsappToken}`,
        'Content-Type': 'application/json',
      },
    });

    return res.json({ success: true, messageId: sendResp.data && sendResp.data.messages && sendResp.data.messages[0] && sendResp.data.messages[0].id });
  } catch (err) {
    return next(err);
  }
});

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
