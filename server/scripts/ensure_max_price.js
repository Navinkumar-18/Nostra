const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product');

dotenv.config({ path: '.env' });

const MAX_PRICE = 8999;

async function ensureMaxPrice() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const products = await Product.find({});
    let updated = 0;

    for (const p of products) {
      if (p.price > MAX_PRICE) {
        const old = p.price;
        p.price = MAX_PRICE;
        if (p.originalPrice && p.originalPrice < p.price) p.originalPrice = p.price;
        await p.save();
        console.log(`Capped product ${p._id} (${p.name}): ${old} -> ${p.price}`);
        updated++;
      }
    }

    console.log(`Finished. ${updated} product(s) capped to maximum price ${MAX_PRICE}.`);
    process.exit(0);
  } catch (err) {
    console.error('Error capping product prices:', err);
    process.exit(1);
  }
}

ensureMaxPrice();
