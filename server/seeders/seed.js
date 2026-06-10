const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Product = require('../models/Product');

dotenv.config({ path: '.env' });

const products = [
  {
    name: "Classic White Shirt",
    price: 1299,
    originalPrice: 1899,
    image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=400&fit=crop",
    category: "shirts",
    description: "A timeless classic white shirt made from premium cotton. Perfect for any occasion.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["White"],
    rating: 4.5,
    reviewsCount: 128,
    inStock: true,
    stockQuantity: 50,
    isNewArrival: true,
  },
  {
    name: "Premium Black Shirt",
    price: 1499,
    originalPrice: 2199,
    image: "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&h=400&fit=crop",
    category: "shirts",
    description: "Elegant black shirt with a modern fit. Made from high-quality fabric.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black"],
    rating: 4.7,
    reviewsCount: 95,
    inStock: true,
    stockQuantity: 40,
    isMostWanted: true,
  },
  {
    name: "Blue Denim Jeans",
    price: 2299,
    originalPrice: 3299,
    image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&h=400&fit=crop",
    category: "pants",
    description: "Comfortable blue denim jeans with a perfect fit. Durable and stylish.",
    sizes: ["28", "30", "32", "34", "36"],
    colors: ["Blue"],
    rating: 4.3,
    reviewsCount: 67,
    inStock: true,
    stockQuantity: 35,
    isMostWanted: true,
  },
  {
    name: "Red Evening Dress",
    price: 2999,
    originalPrice: 4299,
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=400&fit=crop",
    category: "dresses",
    description: "Stunning red evening dress perfect for special occasions. Elegant and sophisticated.",
    sizes: ["XS", "S", "M", "L"],
    colors: ["Red"],
    rating: 4.8,
    reviewsCount: 43,
    inStock: true,
    stockQuantity: 20,
    isNewArrival: true,
  },
  {
    name: "Leather Jacket",
    price: 4999,
    originalPrice: 6999,
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop",
    category: "jackets",
    description: "Premium leather jacket with a timeless design. Perfect for any season.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "Brown"],
    rating: 4.6,
    reviewsCount: 89,
    inStock: true,
    stockQuantity: 15,
    isMostWanted: true,
  },
  {
    name: "Running Sneakers",
    price: 3499,
    originalPrice: 4999,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
    category: "shoes",
    description: "Comfortable running sneakers with advanced cushioning technology.",
    sizes: ["7", "8", "9", "10", "11"],
    colors: ["White", "Black", "Blue"],
    rating: 4.4,
    reviewsCount: 156,
    inStock: true,
    stockQuantity: 60,
    isNewArrival: true,
  },
  {
    name: "Designer Handbag",
    price: 3999,
    originalPrice: 5999,
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop",
    category: "accessories",
    description: "Elegant designer handbag made from genuine leather. Spacious and stylish.",
    sizes: ["One Size"],
    colors: ["Black", "Brown", "Red"],
    rating: 4.7,
    reviewsCount: 78,
    inStock: true,
    stockQuantity: 25,
  },
  {
    name: "Luxury Watch",
    price: 7999,
    originalPrice: 11999,
    image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&h=400&fit=crop",
    category: "accessories",
    description: "Premium luxury watch with stainless steel case and genuine leather strap.",
    sizes: ["One Size"],
    colors: ["Silver", "Gold"],
    rating: 4.9,
    reviewsCount: 34,
    inStock: true,
    stockQuantity: 10,
    isMostWanted: true,
  },
  {
    name: "Striped Polo Shirt",
    price: 1199,
    originalPrice: 1699,
    image: "https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=400&h=400&fit=crop",
    category: "shirts",
    description: "Casual striped polo shirt perfect for weekend outings.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Blue", "Red"],
    rating: 4.2,
    reviewsCount: 52,
    inStock: true,
    stockQuantity: 45,
    isNewArrival: true,
  },
  {
    name: "Summer Dress",
    price: 1799,
    originalPrice: 2599,
    image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&h=400&fit=crop",
    category: "dresses",
    description: "Light and breezy summer dress with floral patterns.",
    sizes: ["XS", "S", "M", "L"],
    colors: ["Floral", "Blue"],
    rating: 4.5,
    reviewsCount: 71,
    inStock: true,
    stockQuantity: 30,
  },
  {
    name: "Casual Hoodie",
    price: 1899,
    originalPrice: 2799,
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop",
    category: "hoodies",
    description: "Comfortable casual hoodie perfect for everyday wear.",
    sizes: ["S", "M", "L", "XL", "XXL"],
    colors: ["Gray", "Black", "Navy"],
    rating: 4.3,
    reviewsCount: 98,
    inStock: true,
    stockQuantity: 55,
    isNewArrival: true,
  },
  {
    name: "Winter Coat",
    price: 4299,
    originalPrice: 6299,
    image: "https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=400&h=400&fit=crop",
    category: "jackets",
    description: "Warm winter coat with premium insulation and waterproof material.",
    sizes: ["S", "M", "L", "XL"],
    colors: ["Black", "Gray"],
    rating: 4.6,
    reviewsCount: 45,
    inStock: true,
    stockQuantity: 18,
  },
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    await Product.deleteMany({});
    console.log('Cleared products');

    await Product.insertMany(products);
    console.log('Added 12 products');

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@nostra.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    let admin = await User.findOne({ email: adminEmail });
    if (!admin) {
      admin = await User.create({
        name: 'Admin',
        email: adminEmail,
        password: adminPassword,
        role: 'admin',
      });
      console.log(`Created admin user (${adminEmail})`);
    }

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDB();
