const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
  removed: {
    type: Boolean,
    default: false,
  },
  enabled: {
    type: Boolean,
    default: true,
  },
  firstname: {
    type: String,
    trim: true,
    required: true,
  },
  lastname: {
    type: String,
    trim: true,
    required: true,
  },
  dailyWage: {
    required: true,
    type: Number,
  },
  images: [
    {
      id: String,
      name: String,
      path: String,
      description: String,
      isPublic: {
        type: Boolean,
        default: false,
      },
    },
  ],
  photo: {
    type: String,
    trim: true,
  },
  position: {
    type: mongoose.Schema.ObjectId,
    ref: 'Position',
    required: true,
    autopopulate: true,
  },
  files: [
    {
      id: String,
      name: String,
      path: String,
      description: String,
      isPublic: {
        type: Boolean,
        default: false,
      },
    },
  ],
  notes: String,
  address: String,
  phone: {
    type: String,
    trim: true,
  },
  tags: [
    {
      type: String,
      trim: true,
      lowercase: true,
    },
  ],
  created: {
    type: Date,
    default: Date.now,
  },
  updated: {
    type: Date,
    default: Date.now,
  },
});

employeeSchema.plugin(require('mongoose-autopopulate'));
module.exports = mongoose.model('Employee', employeeSchema);
