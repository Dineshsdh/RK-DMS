// sweet.model.js - Mongoose schema for sweet items
const mongoose = require('mongoose');

const SweetSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  rate: { type: Number, required: true }
});

module.exports = mongoose.model('Sweet', SweetSchema);
