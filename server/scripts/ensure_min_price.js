const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product');

dotenv.config({ path: '.env' });

const MIN_PRICE = 899;

async function ensureMinPrice() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');

    const products = await Product.find({});
    let updated = 0;

    for (const p of products) {
      if (!p.price || p.price < MIN_PRICE) {
        const old = p.price || 0;
        p.price = MIN_PRICE;
        if (p.originalPrice && p.originalPrice < p.price) p.originalPrice = p.price;
        await p.save();
        console.log(`Updated product ${p._id} (${p.name}): ${old} -> ${p.price}`);
        updated++;
      }
    }

    console.log(`Finished. ${updated} product(s) updated to minimum price ${MIN_PRICE}.`);
    process.exit(0);
  } catch (err) {
    console.error('Error updating product prices:', err);
    process.exit(1);
  }
}

ensureMinPrice();
