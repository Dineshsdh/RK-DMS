// pdf.routes.js - Routes for PDF upload, serve, and delete for invoices
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Invoice = require('./invoice.model');

const router = express.Router();
// Ensure uploads directory exists under uploads/invoices
const uploadsDir = path.join(__dirname, 'uploads', 'invoices');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const upload = multer({ dest: uploadsDir });

// Upload PDF for invoice
router.post('/:id/upload-pdf', upload.single('pdf'), async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) return res.status(404).json({ error: 'Invoice not found' });
    invoice.pdfPath = req.file.path;
    await invoice.save();
    res.json({ message: 'PDF uploaded', pdfPath: invoice.pdfPath });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Serve PDF for invoice
router.get('/:id/pdf', async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice || !invoice.pdfPath) return res.status(404).json({ error: 'PDF not found' });
    res.sendFile(path.resolve(invoice.pdfPath));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete PDF for invoice
router.delete('/:id/pdf', async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice || !invoice.pdfPath) return res.status(404).json({ error: 'PDF not found' });
    fs.unlinkSync(invoice.pdfPath);
    invoice.pdfPath = undefined;
    await invoice.save();
    res.json({ message: 'PDF deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
