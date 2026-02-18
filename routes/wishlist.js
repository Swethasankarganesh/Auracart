// routes/wishlist.js
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const User = require('../models/User');
const Product = require('../models/Product');

// GET wishlist
router.get('/:userId', async (req, res) => {
  try {
    console.log('=== WISHLIST API CALL ===');
    console.log('User ID:', req.params.userId);
    
    if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
      return res.status(400).json({ 
        wishlist: [], 
        message: 'Invalid user ID format' 
      });
    }

    const user = await User.findById(req.params.userId);
    
    if (!user) {
      return res.status(404).json({ wishlist: [], message: 'User not found' });
    }

    // Handle case where wishlist might not exist
    const wishlistIds = user.wishlist || [];
    console.log('Wishlist IDs from user:', wishlistIds);
    
    if (wishlistIds.length === 0) {
      console.log('Wishlist is empty');
      return res.json({ wishlist: [] });
    }

    // Filter valid ObjectIds
    const validIds = wishlistIds.filter(id => 
      mongoose.Types.ObjectId.isValid(id)
    );
    console.log('Valid ObjectIds:', validIds);

    if (validIds.length === 0) {
      console.log('No valid ObjectIds in wishlist');
      return res.json({ wishlist: [] });
    }

    const wishlistProducts = await Product.find({
      _id: { $in: validIds }
    });

    console.log('Found products:', wishlistProducts.length);

    res.json({ 
      wishlist: wishlistProducts,
      count: wishlistProducts.length
    });
  } catch (err) {
    console.error('Wishlist fetch error details:', err);
    res.status(500).json({ 
      wishlist: [], 
      message: 'Server error',
      error: err.message 
    });
  }
});

// POST add to wishlist
router.post('/:userId/add', async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.params.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if product already in wishlist
    if (user.wishlist.includes(productId)) {
      return res.status(400).json({ message: 'Product already in wishlist' });
    }

    user.wishlist.push(productId);
    await user.save();
    
    res.json({ message: 'Product added to wishlist' });
  } catch (err) {
    console.error('Add to wishlist error:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// DELETE remove from wishlist
router.delete('/:userId/remove/:productId', async (req, res) => {
  try {
    const { userId, productId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.wishlist = user.wishlist.filter(id => id.toString() !== productId);
    await user.save();
    
    res.json({ message: 'Product removed from wishlist' });
  } catch (err) {
    console.error('Remove from wishlist error:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// POST move to cart
router.post('/:userId/move-to-cart', async (req, res) => {
  try {
    const { productId } = req.body;
    const userId = req.params.userId;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Remove from wishlist
    user.wishlist = user.wishlist.filter(id => id.toString() !== productId);
    
    // Add to cart
    const existingCartItem = user.cart.find(item => item.productId.toString() === productId);
    if (existingCartItem) {
      existingCartItem.quantity += 1;
    } else {
      user.cart.push({ productId, quantity: 1 });
    }

    await user.save();
    
    res.json({ message: 'Product moved to cart' });
  } catch (err) {
    console.error('Move to cart error:', err.message);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Debug route to check all products
router.get('/debug/products', async (req, res) => {
  try {
    const products = await Product.find({});
    console.log('All products in database:', products);
    res.json({ 
      count: products.length, 
      products: products 
    });
  } catch (err) {
    console.error('Debug products error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;