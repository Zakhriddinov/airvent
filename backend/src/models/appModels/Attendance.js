const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  employee: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: 'Employee',
    autopopulate: true,
  },
  date: {
    type: Date,
    required: true,
  },
  enabled: {
    type: Boolean,
    default: true,
  },
  status: {
    type: String,
    required: true,
    enum: ['half-day', 'absent', 'present', 'not-started'],
  },
  earnedAmount: {
    type: Number,
    default: 0,
  },
  dailyWage: {
    type: Number,
  },
  created: {
    type: Date,
    default: Date.now,
  },
  updated: {
    type: Date,
    default: Date.now,
  },
});

schema.plugin(require('mongoose-autopopulate'));
module.exports = mongoose.model('Attendance', schema);
