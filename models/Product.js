// models/Product.js
const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  salePrice: { type: Number },
  description: { type: String },
  category: { type: String },
  stock: { type: Number, default: 0 },
  image: { type: String },
  createdAt: { type: Date, default: Date.now }
});

// Add index for better performance
productSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model("Product", productSchema);