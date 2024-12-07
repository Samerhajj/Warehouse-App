const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  action: { type: String, required: true },
  items: [{
    name: String,
    quantity: Number,
    action: String // 'added', 'removed', 'updated', etc.
  }],
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const Log = mongoose.model('Log', logSchema);
module.exports = Log;