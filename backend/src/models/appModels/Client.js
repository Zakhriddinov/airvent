const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  removed: {
    type: Boolean,
    default: false,
  },
  enabled: {
    type: Boolean,
    default: true,
  },
  code: { type: Number, required: true },
  name: {
    type: String,
    trim: true,
    required: true,
  },
  turnover: { type: Number, default: 0 },
  cash: { type: Number, default: 0 },
  click: { type: Number, default: 0 },
  transfers: { type: Number, default: 0 },
  debt: { type: Number, default: 0 },
  currency: {
    type: String,
    enum: ['UZS', 'USD'],
    default: 'UZS',
    required: true,
    uppercase: true,
  },
  phone: {
    type: String,
    trim: true,
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

schema.plugin(require('mongoose-autopopulate'));
module.exports = mongoose.model('Client', schema);
