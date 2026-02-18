const express = require('express');
const router = express.Router();
const Order = require('../models/order');

// Create new order
router.post('/', async (req, res) => {
  console.log('🔥 POST /api/orders called');
  console.log('📦 Request body:', JSON.stringify(req.body, null, 2));
  
  try {
    const {
      userId,
      userName,
      userEmail,
      items,
      shippingAddress,
      totalAmount,
      paymentMethod,
      paymentStatus
    } = req.body;

    console.log('🔍 Validating data...');

    // Validate required fields
    if (!userId) {
      console.log('❌ Missing userId');
      return res.status(400).json({ 
        success: false,
        message: 'User ID is required' 
      });
    }
    
    if (!userName) {
      console.log('❌ Missing userName');
      return res.status(400).json({ 
        success: false,
        message: 'User name is required' 
      });
    }
    
    if (!userEmail) {
      console.log('❌ Missing userEmail');
      return res.status(400).json({ 
        success: false,
        message: 'User email is required' 
      });
    }
    
    if (!items || !Array.isArray(items)) {
      console.log('❌ Invalid items:', items);
      return res.status(400).json({ 
        success: false,
        message: 'Items array is required' 
      });
    }
    
    if (items.length === 0) {
      console.log('❌ Empty items array');
      return res.status(400).json({ 
        success: false,
        message: 'Cart is empty' 
      });
    }
    
    if (!shippingAddress) {
      console.log('❌ Missing shippingAddress');
      return res.status(400).json({ 
        success: false,
        message: 'Shipping address is required' 
      });
    }
    
    if (!totalAmount) {
      console.log('❌ Missing totalAmount');
      return res.status(400).json({ 
        success: false,
        message: 'Total amount is required' 
      });
    }
    
    if (!paymentMethod) {
      console.log('❌ Missing paymentMethod');
      return res.status(400).json({ 
        success: false,
        message: 'Payment method is required' 
      });
    }

    console.log('✅ All validations passed');

    // Create new order object
    const orderData = {
      userId: userId.toString(),
      userName: userName.toString(),
      userEmail: userEmail.toString(),
      items: items.map((item, index) => {
        console.log(`📦 Processing item ${index}:`, item);
        return {
          productId: (item.productId || item._id || `prod_${Date.now()}_${index}`).toString(),
          name: (item.name || 'Unknown Product').toString(),
          quantity: Number(item.quantity) || 1,
          price: Number(item.price) || 0,
          image: item.image || '/placeholder.svg'
        };
      }),
      shippingAddress: {
        address: (shippingAddress.address || '').toString(),
        city: (shippingAddress.city || '').toString(),
        state: (shippingAddress.state || '').toString(),
        pincode: (shippingAddress.pincode || '').toString(),
        phone: (shippingAddress.phone || '').toString()
      },
      totalAmount: Number(totalAmount),
      paymentMethod: paymentMethod.toString(),
      paymentStatus: (paymentStatus || (paymentMethod === 'cod' ? 'pending' : 'paid')).toString(),
      status: 'pending'
    };

    console.log('📝 Order data to save:', JSON.stringify(orderData, null, 2));

    // Create and save order
    const order = new Order(orderData);
    console.log('💾 Saving order to database...');
    
    const savedOrder = await order.save();
    
    console.log('✅ Order saved successfully! ID:', savedOrder._id);

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      order: savedOrder
    });

  } catch (error) {
    console.error('💥 CRITICAL ERROR:', error);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    // Check for specific MongoDB errors
    if (error.name === 'ValidationError') {
      console.log('❌ Mongoose Validation Error Details:');
      Object.values(error.errors).forEach(err => {
        console.log(`  - ${err.path}: ${err.message}`);
      });
      
      return res.status(400).json({ 
        success: false,
        message: 'Validation failed',
        errors: Object.values(error.errors).map(err => ({
          field: err.path,
          message: err.message
        }))
      });
    }
    
    if (error.name === 'MongoServerError') {
      console.log('❌ MongoDB Server Error:', error.code);
      return res.status(500).json({ 
        success: false,
        message: 'Database error',
        code: error.code
      });
    }

    res.status(500).json({ 
      success: false,
      message: 'Internal server error',
      error: error.message,
      stack: error.stack
    });
  }
});

module.exports = router;