// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  cart: [
    {
      productId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Product',
        required: true 
      },
      quantity: { type: Number, default: 1 },
      addedAt: { type: Date, default: Date.now }
    }
  ],
  wishlist: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Product' 
  }],
  createdAt: { type: Date, default: Date.now }
});

// Add a method to safely get cart with populated products
userSchema.methods.getPopulatedCart = async function() {
  try {
    await this.populate('cart.productId');
    return this.cart;
  } catch (error) {
    console.error('Error populating cart:', error);
    // Return empty cart if population fails
    return [];
  }
};

module.exports = mongoose.model('User', userSchema);