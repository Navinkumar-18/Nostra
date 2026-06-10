const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product');

dotenv.config({ path: '.env' });

const DEFAULT_MIN = 899;
const DEFAULT_MAX = 8999;

const minArg = parseInt(process.argv[2], 10);
const maxArg = parseInt(process.argv[3], 10);

const MIN = Number.isFinite(minArg) ? minArg : DEFAULT_MIN;
const MAX = Number.isFinite(maxArg) ? maxArg : DEFAULT_MAX;

if (MIN < 501) {
  console.error('Minimum price must be at least 501');
  process.exit(1);
}

function randInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function randomize() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    const products = await Product.find({});
    let updated = 0;

    for (const p of products) {
      const old = p.price;
      const newPrice = randInt(MIN, MAX);
      p.price = newPrice;
      if (!p.originalPrice || p.originalPrice < p.price) {
        p.originalPrice = p.price + randInt(50, 2000);
      }
      await p.save();
      console.log(`Updated ${p._id} (${p.name}): ${old} -> ${p.price}`);
      updated++;
    }

    console.log(`Done. ${updated} product(s) randomized (range ${MIN}-${MAX}).`);
    process.exit(0);
  } catch (err) {
    console.error('Error randomizing prices:', err);
    process.exit(1);
  }
}

randomize();
