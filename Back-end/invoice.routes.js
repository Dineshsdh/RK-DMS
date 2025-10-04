// invoice.routes.js - Routes for invoice management
const express = require('express');
const Invoice = require('./invoice.model');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// Helper: Generate A4 PDF for an invoice and store on disk
async function generateInvoicePdf(invoice) {
  return new Promise((resolve, reject) => {
    try {
      // Corrected path to be relative to the project's root `uploads` directory
      const uploadsDir = path.join(__dirname, '..', 'uploads', 'invoices');
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      const fileName = `invoice_${invoice._id}.pdf`;
      const filePath = path.join(uploadsDir, fileName);

      const doc = new PDFDocument({ size: 'A4', margin: 36 });
      const stream = fs.createWriteStream(filePath);
      doc.pipe(stream);

      // Header
      doc
        .fontSize(20)
        .fillColor('#b91c1c')
        .font('Helvetica-Bold')
        .text('RK PALKHOVA & SWEETS', { align: 'center' })
        .moveDown(0.2);
      doc
        .fontSize(14)
        .fillColor('#eab308')
        .text('INVOICE', { align: 'center' })
        .moveDown(1);

      // Customer and order info
      doc.font('Helvetica').fillColor('black').fontSize(11);
      const leftX = doc.x;
      const topY = doc.y;
      const colWidth = 250;
      doc.text(`Customer Name: ${invoice.customerName || ''}`, leftX, topY, { width: colWidth });
      doc.text(`Mobile No: ${invoice.mobileNo || ''}`, leftX, doc.y);
      const rightX = leftX + colWidth + 20;
      doc.text(`Order No: ${invoice.orderNo || ''}`, rightX, topY, { width: colWidth });
      doc.text(`Date & Time: ${invoice.dateTime ? new Date(invoice.dateTime).toLocaleString('en-IN') : ''}`, rightX, doc.y);
      doc.text(`Delivery Date: ${invoice.deliveryDate || 'N/A'}`, rightX, doc.y + 15);
      doc.text(`Delivery Time: ${invoice.deliveryTime || 'N/A'}`);
      doc.moveDown(1);

      // Items table header
      const tableTop = doc.y;
      const columnPositions = [36, 150, 220, 300, 370, 450];
      doc.fontSize(11).fillColor('#b91c1c').font('Helvetica-Bold')
        .text('Sweet', columnPositions[0], tableTop)
        .text('Type', columnPositions[1], tableTop)
        .text('No', columnPositions[2], tableTop)
        .text('Quantity', columnPositions[3], tableTop)
        .text('Rate', columnPositions[4], tableTop)
        .text('Total', columnPositions[5], tableTop);
      doc.moveTo(36, tableTop + 15).lineTo(559, tableTop + 15).stroke('#eab308');

      // Items rows
      doc.font('Helvetica').fillColor('black');
      let y = tableTop + 22;
      (invoice.items || []).forEach((it) => {
        doc.text(it.sweet || '', columnPositions[0], y, { width: 100 });
        doc.text(it.type || '', columnPositions[1], y, { width: 60 });
        doc.text(it.no || '', columnPositions[2], y, { width: 60 });
        doc.text(String(Number(it.quantity) || 0), columnPositions[3], y);
        doc.text(String(Number(it.rate) || 0), columnPositions[4], y);
        doc.text(String(Number(it.total) || 0), columnPositions[5], y);
        y += 20;
        if (y > 700) { doc.addPage(); y = 60; }
      });

      // Totals box
      const totalAmount = Number(invoice.totalAmount || 0);
      const advanceAmount = Number(invoice.advanceAmount || 0);
      const discountAmount = Number(invoice.discountAmount || 0);
      const packageHandlingAmount = Number(invoice.packageHandlingAmount || 0);
      const roundedGrandTotal = Math.round(totalAmount + packageHandlingAmount - advanceAmount - discountAmount);

      const boxX = 320;
      const boxY = y < 600 ? y + 20 : 600;
      doc.roundedRect(boxX, boxY, 240, 120, 8).stroke('#eab308');

      let currentY = boxY + 10;
      const writeTotalRow = (label, value) => {
        doc.text(label, boxX + 10, currentY)
           .text(`₹${value.toFixed(2)}`, boxX + 150, currentY, { width: 80, align: 'right' });
        currentY += 20;
      };

      doc.fontSize(11).font('Helvetica').fillColor('black');
      writeTotalRow('Total Amount', totalAmount);
      writeTotalRow('Package Handling', packageHandlingAmount);
      writeTotalRow('Discount', discountAmount);
      writeTotalRow('Advance Amount', advanceAmount);
      
      doc.fillColor('#16a34a').fontSize(12).font('Helvetica-Bold');
      doc.text('Grand Total', boxX + 10, currentY + 5)
         .text(`₹${roundedGrandTotal.toFixed(2)}`, boxX + 150, currentY + 5, { width: 80, align: 'right' });

      doc.end();
      stream.on('finish', () => resolve(filePath));
      stream.on('error', (err) => reject(err));
    } catch (err) {
      reject(err);
    }
  });
}

const router = express.Router();

// Get invoices by status (with optional pagination)
router.get('/status/:status', async (req, res) => {
  try {
    const validStatuses = ['pending', 'delivered', 'cancelled'];
    const { status } = req.params;
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [invoices, total] = await Promise.all([
      Invoice.find({ status }).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Invoice.countDocuments({ status })
    ]);

    res.json({
      invoices,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalInvoices: total
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all invoices
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const invoices = await Invoice.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Invoice.countDocuments();
    
    res.json({
      invoices,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalInvoices: total
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get invoice by ID
router.get('/:id', async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    res.json(invoice);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create new invoice
router.post('/', async (req, res) => {
  try {
    const invoiceData = req.body;
    
    if (!invoiceData.customerName) {
      return res.status(400).json({ error: 'Customer name is required' });
    }
    if (!invoiceData.items || invoiceData.items.length === 0) {
      return res.status(400).json({ error: 'At least one item is required' });
    }

    const invoice = new Invoice(invoiceData);
    await invoice.save();

    try {
      const pdfPath = await generateInvoicePdf(invoice);
      invoice.pdfPath = path.basename(pdfPath); // Store only the filename
      await invoice.save();
    } catch (pdfErr) {
      console.error('PDF Generation Error:', pdfErr);
      return res.status(201).json({ ...invoice.toObject(), pdfError: pdfErr.message || 'Failed to generate PDF' });
    }

    res.status(201).json(invoice);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Update invoice
router.put('/:id', async (req, res) => {
  try {
    const invoice = await Invoice.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );
    
    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    
    res.json(invoice);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete invoice
router.delete('/:id', async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);
    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    if (invoice.pdfPath) {
      try {
        const fullPath = path.join(__dirname, '..', 'uploads', 'invoices', invoice.pdfPath);
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
        }
      } catch (e) {
        console.error('Error deleting PDF file:', e);
      }
    }
    await Invoice.findByIdAndDelete(req.params.id);
    res.json({ message: 'Invoice and PDF deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Search invoices by customer name, order number, or mobile
router.get('/search/:query', async (req, res) => {
  try {
    const query = req.params.query;
    const invoices = await Invoice.find({
      $or: [
        { customerName: { $regex: query, $options: 'i' } },
        { orderNo: { $regex: query, $options: 'i' } },
        { mobileNo: { $regex: query, $options: 'i' } }
      ]
    }).sort({ createdAt: -1 });
    
    res.json(invoices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get invoices by date range
router.get('/date-range/:startDate/:endDate', async (req, res) => {
  try {
    const { startDate, endDate } = req.params;
    const invoices = await Invoice.find({
      createdAt: {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      }
    }).sort({ createdAt: -1 });
    
    res.json(invoices);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;