// invoice.model.js - Mongoose schema for invoice details
const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  sweet: String,
  quantity: Number,
  rate: Number,
  total: Number,
  type: String,
  no: String,
});

const InvoiceSchema = new mongoose.Schema({
  customerName: String,
  mobileNo: String,
  orderNo: String,
  dateTime: String,
  employee: String,
  items: [ItemSchema],
  advanceAmount: Number,
  discount: Number,
  discountAmount: Number,
  totalAmount: Number,
  grandTotal: Number,
  roundedGrandTotal: Number,
  deliveryDate: String,
  deliveryDay: String,
  
  // --- ADDED FIELDS ---
  deliveryTime: { type: String, default: '' },
  packageHandlingAmount: { type: Number, default: 0 },
  // --- END ADDED FIELDS ---

  pdfPath: String,

  // Invoice status lifecycle
  status: { type: String, enum: ['pending', 'delivered', 'cancelled'], default: 'pending' },

}, { timestamps: true });

module.exports = mongoose.model('Invoice', InvoiceSchema);