const mongoose = require("mongoose");
require("dotenv").config();

const Product = require("./models/Product");

const products = [
  {
    name: "Premium Casual Sneakers",
    description: "Comfortable and stylish sneakers for everyday use.",
    category: "Fashion",
    price: 1899,
    originalPrice: 2499,
    discount: 24,
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80",
    rating: 4.8,
    stock: 50,
    featured: true,
  },

  {
    name: "Wireless Headphones",
    description: "High-quality wireless headphones with immersive sound.",
    category: "Electronics",
    price: 2499,
    originalPrice: 3499,
    discount: 29,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
    rating: 4.7,
    stock: 40,
    featured: true,
  },

  {
    name: "Classic Leather Backpack",
    description: "Premium backpack suitable for college, office and travel.",
    category: "Fashion",
    price: 1599,
    originalPrice: 2199,
    discount: 27,
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=800&q=80",
    rating: 4.9,
    stock: 35,
    featured: true,
  },

  {
    name: "Minimal Ceramic Table Lamp",
    description: "Elegant ceramic lamp for a modern home.",
    category: "Home & Living",
    price: 1299,
    originalPrice: 1799,
    discount: 28,
    image:
      "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=800&q=80",
    rating: 4.6,
    stock: 25,
    featured: true,
  },
];

const seedProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    await Product.deleteMany();

    await Product.insertMany(products);

    console.log("Products added successfully");

    await mongoose.disconnect();

    console.log("MongoDB connection closed");

    process.exit(0);
  } catch (error) {
    console.error("Error:", error.message);
    process.exit(1);
  }
};

seedProducts();