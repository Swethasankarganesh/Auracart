const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { 
    type: String,
    required: [true, 'User ID is required']
  },
  userName: {
    type: String,
    required: [true, 'User name is required'],
    trim: true
  },
  userEmail: {
    type: String,
    required: [true, 'User email is required'],
    trim: true,
    lowercase: true
  },
  items: [
    {
      productId: { 
        type: String,
        required: [true, 'Product ID is required']
      },
      name: { 
        type: String, 
        required: [true, 'Product name is required'],
        trim: true
      },
      quantity: { 
        type: Number, 
        required: [true, 'Quantity is required'],
        min: [1, 'Quantity must be at least 1'],
        default: 1
      },
      price: { 
        type: Number, 
        required: [true, 'Price is required'],
        min: [0, 'Price cannot be negative']
      },
      image: { 
        type: String,
        default: '/placeholder.svg'
      }
    }
  ],
  shippingAddress: {
    address: { 
      type: String, 
      required: [true, 'Address is required'],
      trim: true
    },
    city: { 
      type: String, 
      required: [true, 'City is required'],
      trim: true
    },
    state: { 
      type: String,
      default: '',
      trim: true
    },
    pincode: { 
      type: String, 
      required: [true, 'Pincode is required'],
      trim: true
    },
    phone: { 
      type: String, 
      required: [true, 'Phone is required'],
      trim: true
    }
  },
  totalAmount: { 
    type: Number, 
    required: [true, 'Total amount is required'],
    min: [0, 'Total amount cannot be negative']
  },
  paymentMethod: { 
    type: String, 
    required: [true, 'Payment method is required'],
    enum: {
      values: ['card', 'upi', 'netbanking', 'cod'],
      message: '{VALUE} is not a valid payment method'
    }
  },
  paymentStatus: {
    type: String,
    required: true,
    default: 'pending',
    enum: {
      values: ['pending', 'paid', 'failed', 'refunded'],
      message: '{VALUE} is not a valid payment status'
    }
  },
  status: { 
    type: String, 
    default: 'pending',
    enum: {
      values: ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'],
      message: '{VALUE} is not a valid order status'
    }
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

orderSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Order', orderSchema);