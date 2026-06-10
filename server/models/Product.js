const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a product name'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please provide a description'],
  },
  price: {
    type: Number,
    required: [true, 'Please provide a price'],
    min: [501, 'Product price must be above 500'],
  },
  originalPrice: {
    type: Number,
    min: 0,
  },
  image: {
    type: String,
    required: [true, 'Please provide an image URL'],
  },
  images: [String],
  category: {
    type: String,
    required: [true, 'Please provide a category'],
    enum: ['shirts', 'pants', 'dresses', 'jackets', 'shoes', 'accessories', 'hoodies', 'other'],
  },
  sizes: [String],
  colors: [String],
  inStock: {
    type: Boolean,
    default: true,
  },
  stockQuantity: {
    type: Number,
    default: 0,
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  reviewsCount: {
    type: Number,
    default: 0,
  },
  tags: [String],
  isNewArrival: {
    type: Boolean,
    default: false,
  },
  isMostWanted: {
    type: Boolean,
    default: false,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

productSchema.index({ name: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Product', productSchema);
