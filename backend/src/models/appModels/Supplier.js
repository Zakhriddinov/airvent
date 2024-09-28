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
  debtStart: { type: Number, default: 0 },
  turnover: { type: Number, default: 0 },
  cash: { type: Number, default: 0 },
  click: { type: Number, default: 0 },
  transfers: { type: Number, default: 0 },
  debtEnd: { type: Number, default: 0 },
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

// supplierSchema.virtual('debtEnd').get(function () {
//   return this.debtStart + this.turnover - this.cash - this.transfers;
// });

module.exports = mongoose.model('Supplier', supplierSchema);
