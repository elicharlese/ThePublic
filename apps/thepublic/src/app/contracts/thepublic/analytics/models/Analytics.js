const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  data: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Analytics', analyticsSchema);