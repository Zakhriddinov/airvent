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
  code: { autopopulate: true, type: Number, required: true },
  productCategory: {
    type: mongoose.Schema.ObjectId,
    ref: 'ProductCategory',
    required: true,
    autopopulate: true,
  },
  supplier: {
    type: mongoose.Schema.ObjectId,
    ref: 'Supplier',
    autopopulate: true,
  },
  name: {
    type: String,
    required: true,
  },
  description: String,
  quantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantityUnit: {
    type: String,
    required: true,
  },
  photo: String,
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
  created: {
    type: Date,
    default: Date.now,
  },
  updated: {
    type: Date,
    default: Date.now,
  },
  isPublic: {
    type: Boolean,
    default: true,
  },
  totalPrice: {
    type: Number,
  },
  currency: {
    type: String,
    enum: ['UZS', 'USD'],
    default: 'UZS',
    required: true,
    uppercase: true,
  },
});

schema.plugin(require('mongoose-autopopulate'));
module.exports = mongoose.model('Products', schema);
