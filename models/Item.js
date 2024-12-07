const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },      // Item name
  quantity: { type: Number, default: 0 },      // Quantity in stock
  category: { type: String, required: true },  // Item category
  createdAt: { type: Date, default: Date.now } // Timestamp
});

module.exports = mongoose.model('Item', itemSchema);
