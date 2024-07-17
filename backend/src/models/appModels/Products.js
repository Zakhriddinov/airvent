const mongoose = require('mongoose');

const schema = mongoose.Schema({
  removed: {
    type: Boolean,
    default: false,
  },
  enabled: {
    type: Boolean,
    default: true,
  },
  code: {
    type: String,
    unique: true,
    required: true,
  },
  productCategory: {
    type: mongoose.Schema.ObjectId,
    ref: 'ProductCategory',
    required: true,
    autopopulate: true,
  },
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: String,
  quantity: {
    type: Number,
  },
  price: {
    type: Number,
    required: true,
  },
  length: {
    type: Number,
  },
  wight: {
    type: Number,
  },
  priceReceived: {
    type: Number,
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
});

schema.plugin(require('mongoose-autopopulate'));
module.exports = mongoose.model('Products', schema);
