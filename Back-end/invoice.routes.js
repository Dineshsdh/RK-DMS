// invoice.routes.js - Routes for invoice management
const express = require('express');
const Invoice = require('./invoice.model');
const router = express.Router();

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

    const invoice = new Invoice(invoiceData);
    await invoice.save();
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
    const invoice = await Invoice.findByIdAndDelete(req.params.id);
    if (!invoice) {
      return res.status(404).json({ error: 'Invoice not found' });
    }
    res.json({ message: 'Invoice deleted successfully', deletedInvoice: invoice });
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