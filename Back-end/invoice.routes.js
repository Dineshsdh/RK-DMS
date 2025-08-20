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
      const uploadsDir = path.join(__dirname, 'uploads', 'invoices');
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
        .text('RK PALKHOVA & SWEETS', { align: 'center' })
        .moveDown(0.2);
      doc
        .fontSize(14)
        .fillColor('#eab308')
        .text('INVOICE', { align: 'center' })
        .moveDown(1);

      // Customer and order info
      doc.fillColor('black').fontSize(11);
      const leftX = doc.x;
      const topY = doc.y;
      const colWidth = 250;
      doc.text(`Customer Name: ${invoice.customerName || ''}`, leftX, topY, { width: colWidth });
      doc.text(`Mobile No: ${invoice.mobileNo || ''}`, leftX, doc.y);
      const rightX = leftX + colWidth + 20;
      doc.text(`Order No: ${invoice.orderNo || ''}`, rightX, topY, { width: colWidth });
      doc.text(`Date & Time: ${invoice.dateTime || ''}`, rightX, doc.y);
      const rightX2 = rightX + colWidth + 20;
      doc.text(`Employee: ${invoice.employee || ''}`, rightX2, topY, { width: colWidth });
      doc.text(`Delivery Date: ${invoice.deliveryDate || ''}`, rightX2, doc.y);
      doc.text(`Delivery Day: ${invoice.deliveryDay || ''}`, rightX2, doc.y);
      doc.moveDown(1);

      // Items table header
      const tableTop = doc.y;
      const rowHeight = 20;
      const columnPositions = [36, 220, 340, 430];
      doc
        .fontSize(11)
        .fillColor('#b91c1c')
        .text('Sweet', columnPositions[0], tableTop)
        .text('Quantity', columnPositions[1], tableTop)
        .text('Rate', columnPositions[2], tableTop)
        .text('Total', columnPositions[3], tableTop);

      doc.moveTo(36, tableTop + 15).lineTo(559, tableTop + 15).stroke('#eab308');

      // Items rows
      doc.fillColor('black');
      let y = tableTop + 22;
      const items = (invoice.items || []).map(it => ({
        sweet: it.sweet || '',
        quantity: Number(it.quantity) || 0,
        rate: Number(it.rate) || 0,
        total: Number(it.total) || 0,
      }));
      items.forEach((it) => {
        doc.text(it.sweet, columnPositions[0], y, { width: 170 });
        doc.text(String(it.quantity), columnPositions[1], y);
        doc.text(String(it.rate), columnPositions[2], y);
        doc.text(String(it.total), columnPositions[3], y);
        y += rowHeight;
        if (y > 700) {
          doc.addPage();
          y = 60;
        }
      });

      // Totals box
      const totalAmount = Number(invoice.totalAmount || 0);
      const advanceAmount = Number(invoice.advanceAmount || 0);
      const discountAmount = Number(invoice.discountAmount || 0);
      const roundedGrandTotal = Number(invoice.roundedGrandTotal || 0);

      const boxX = 320;
      const boxY = y + 20;
      doc.roundedRect(boxX, boxY, 240, 100, 8).stroke('#eab308');
      doc
        .fontSize(11)
        .text('Total Amount', boxX + 10, boxY + 10)
        .text(`₹${totalAmount}`, boxX + 150, boxY + 10, { width: 80, align: 'right' })
        .text('Advance Amount', boxX + 10, boxY + 30)
        .text(`₹${advanceAmount}`, boxX + 150, boxY + 30, { width: 80, align: 'right' })
        .text('Discount', boxX + 10, boxY + 50)
        .text(`₹${discountAmount.toFixed ? discountAmount.toFixed(2) : discountAmount}`, boxX + 150, boxY + 50, { width: 80, align: 'right' })
        .fillColor('#16a34a').fontSize(12)
        .text('Grand Total (Rounded)', boxX + 10, boxY + 70)
        .text(`₹${roundedGrandTotal}`, boxX + 150, boxY + 70, { width: 80, align: 'right' })
        .fillColor('black');

      // Footer
      doc.moveDown(2);
      doc.fontSize(10).fillColor('#666').text('Thank you for your order!', { align: 'center' });

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
    
    // Validation
    if (!invoiceData.customerName) {
      return res.status(400).json({ error: 'Customer name is required' });
    }
    
    if (!invoiceData.items || invoiceData.items.length === 0) {
      return res.status(400).json({ error: 'At least one item is required' });
    }

    // Generate order number if not provided
    if (!invoiceData.orderNo) {
      const count = await Invoice.countDocuments();
      invoiceData.orderNo = `ORD${String(count + 1).padStart(4, '0')}`;
    }

    if (!invoiceData.status) {
      invoiceData.status = 'pending';
    }
    const invoice = new Invoice(invoiceData);
    await invoice.save();

    // Generate PDF and store path
    try {
      const pdfPath = await generateInvoicePdf(invoice);
      invoice.pdfPath = pdfPath;
      await invoice.save();
    } catch (pdfErr) {
      // If PDF generation fails, keep invoice saved but return warning
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
    // Delete PDF from disk if exists
    if (invoice.pdfPath) {
      try {
        if (fs.existsSync(invoice.pdfPath)) {
          fs.unlinkSync(invoice.pdfPath);
        }
      } catch (e) {
        // ignore file delete errors
      }
    }
    await Invoice.findByIdAndDelete(req.params.id);
    res.json({ message: 'Invoice and PDF deleted successfully', deletedInvoice: invoice });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Search invoices by customer name or order number
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