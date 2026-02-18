// routes/cart.js
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const User = require('../models/User');

// GET cart for user
router.get('/:userId', async (req, res) => {
  console.log('=== CART API CALL ===');
  console.log('Request received for user ID:', req.params.userId);
  
  try {
    // Validate user ID format
    if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
      console.log('Invalid user ID format');
      return res.status(400).json({ 
        message: 'Invalid user ID format',
        cart: [],
        count: 0
      });
    }

    console.log('Looking for user in database...');
    const user = await User.findById(req.params.userId);
    console.log('User found:', user ? 'Yes' : 'No');

    if (!user) {
      console.log('User not found');
      return res.status(404).json({ 
        message: 'User not found',
        cart: [],
        count: 0
      });
    }

    console.log('User cart exists:', user.cart ? 'Yes' : 'No');
    console.log('Cart length:', user.cart ? user.cart.length : 0);

    // Handle case where cart might be undefined
    const userCart = user.cart || [];
    
    // Try to populate product details if we have items
    let populatedCart = userCart;
    
    if (userCart.length > 0) {
      console.log('Attempting to populate cart items...');
      try {
        // Create a copy of the user to avoid modifying the original
        const userCopy = await User.findById(req.params.userId);
        await userCopy.populate('cart.productId');
        populatedCart = userCopy.cart;
        
        // Filter out any items with invalid product references
        populatedCart = populatedCart.filter(item => 
          item.productId !== null && 
          item.productId !== undefined &&
          typeof item.productId === 'object'
        );
        
        console.log('Population successful. Valid items:', populatedCart.length);
      } catch (populateError) {
        console.error('Error populating cart:', populateError.message);
        console.error('Populate error stack:', populateError.stack);
        // Return cart without populated products if population fails
        populatedCart = userCart;
      }
    }

    console.log('Sending response with', populatedCart.length, 'items');
    res.json({ 
      cart: populatedCart,
      count: populatedCart.length
    });
    
  } catch (err) {
    console.error('CART FETCH ERROR:');
    console.error('Error message:', err.message);
    console.error('Error stack:', err.stack);
    console.error('Error name:', err.name);
    
    res.status(500).json({ 
      message: 'Server error fetching cart', 
      error: err.message,
      cart: [],
      count: 0
    });
  }
});

// Add debug endpoint
router.get('/:userId/debug', async (req, res) => {
  console.log('=== CART DEBUG ENDPOINT ===');
  console.log('User ID:', req.params.userId);
  
  try {
    // Check MongoDB connection
    console.log('MongoDB ready state:', mongoose.connection.readyState);
    
    // Validate user ID format
    if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
      return res.status(400).json({ 
        error: 'Invalid user ID format',
        userId: req.params.userId,
        mongooseReadyState: mongoose.connection.readyState
      });
    }

    const user = await User.findById(req.params.userId);
    console.log('User found:', !!user);
    
    if (!user) {
      return res.status(404).json({ 
        error: 'User not found',
        userId: req.params.userId,
        mongooseReadyState: mongoose.connection.readyState
      });
    }

    console.log('User cart field exists:', 'cart' in user);
    console.log('User cart value:', user.cart);
    console.log('Cart type:', typeof user.cart);
    console.log('Cart length:', user.cart ? user.cart.length : 0);
    
    if (user.cart && user.cart.length > 0) {
      console.log('First cart item:', user.cart[0]);
      console.log('First item productId:', user.cart[0].productId);
      console.log('First item productId type:', typeof user.cart[0].productId);
      
      // Check if product exists
      if (user.cart[0].productId) {
        const Product = require('../models/Product');
        const product = await Product.findById(user.cart[0].productId);
        console.log('Product exists:', !!product);
      }
    }

    res.json({
      userId: req.params.userId,
      userExists: !!user,
      cartExists: 'cart' in user,
      cartValue: user.cart,
      cartType: typeof user.cart,
      cartLength: user.cart ? user.cart.length : 0,
      mongooseReadyState: mongoose.connection.readyState,
      mongooseStates: ['disconnected', 'connected', 'connecting', 'disconnecting']
    });
    
  } catch (err) {
    console.error('DEBUG ERROR:');
    console.error('Error message:', err.message);
    console.error('Error stack:', err.stack);
    
    res.status(500).json({ 
      error: 'Debug endpoint failed', 
      message: err.message,
      stack: err.stack,
      mongooseReadyState: mongoose.connection.readyState
    });
  }
});

// Export the router
module.exports = router;