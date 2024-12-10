const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true, index: true }, // Add index for faster searches
  quantity: { type: Number, default: 0 },      // Quantity in stock
  category: { type: String, required: false },  // Item category
  createdAt: { type: Date, default: Date.now }, // Timestamp
  size: { type: String, required: false }, // Add size field
});

module.exports = mongoose.model('Item', itemSchema);
