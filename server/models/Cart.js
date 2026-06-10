const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
  },
  size: String,
  color: String,
});

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  items: [cartItemSchema],
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

cartSchema.methods.getTotalItems = function () {
  return this.items.reduce((total, item) => total + item.quantity, 0);
};

cartSchema.methods.getSubtotal = async function () {
  const Product = mongoose.model('Product');
  let subtotal = 0;
  for (const item of this.items) {
    const product = await Product.findById(item.product);
    if (product) {
      subtotal += product.price * item.quantity;
    }
  }
  return subtotal;
};

module.exports = mongoose.model('Cart', cartSchema);
