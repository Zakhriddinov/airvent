const mongoose = require('mongoose');

const supplierSchema = new mongoose.Schema({
  removed: {
    type: Boolean,
    default: false,
  },
  enabled: {
    type: Boolean,
    default: true,
  },
  code: { type: Number, required: true },
  name: { type: String, required: true },
  turnover: { type: Number, default: 0 },
  cash: { type: Number, default: 0 },
  click: { type: Number, default: 0 },
  transfers: { type: Number, default: 0 },
  debt: { type: Number, default: 0 },
  credit: { type: Number, default: 0 },
  phone: { type: String },
  currency: {
    type: String,
    enum: ['UZS', 'USD'],
    default: 'UZS',
    required: true,
    uppercase: true,
  },
  created: {
    type: Date,
    default: Date.now,
  },
  updated: {
    type: Date,
    default: function () {
      return Date.now();
    },
  },
});

module.exports = mongoose.model('Supplier', supplierSchema);
