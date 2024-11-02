const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  removed: {
    type: Boolean,
    default: false,
  },
  createdBy: { type: mongoose.Schema.ObjectId, ref: 'User', autopopulate: true, required: true },
  number: {
    type: Number,
    required: true,
  },
  client: {
    type: mongoose.Schema.ObjectId,
    ref: 'Client',
    autopopulate: true,
    required: true,
  },
  invoice: {
    type: mongoose.Schema.ObjectId,
    ref: 'ClientInvoice',
    required: true,
    autopopulate: true,
  },
  date: {
    type: Date,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    enum: ['UZS', 'USD'],
    default: 'UZS',
    required: true,
    uppercase: true,
  },
  paymentMode: {
    type: String,
    enum: ['cash', 'transfer', 'click'],
    default: 'cash',
  },
  updated: {
    type: Date,
    default: Date.now,
  },
  created: {
    type: Date,
    default: Date.now,
  },
  description: String,
});

paymentSchema.plugin(require('mongoose-autopopulate'));
module.exports = mongoose.model('ClientPayment', paymentSchema);
