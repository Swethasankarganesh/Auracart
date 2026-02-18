const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, _res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  if (req.method === 'POST' || req.method === 'PUT') {
    console.log('Request Body:', JSON.stringify(req.body, null, 2));
  }
  next();
});


const authRoutes = require('./routes/auth');
const wishlistRoutes = require('./routes/wishlist');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/order');
const productRoutes = require('./routes/products');
const eventRoutes = require('./routes/event.routes');

app.use('/api/auth', authRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/products', productRoutes);
app.use('/api/events', eventRoutes);


app.get('/api/big-billion', async (req, res) => {
  try {
    console.log('📦 Fetching Big Billion data...');
    const today = new Date();
    const month = today.getMonth();
    const year = today.getFullYear();
    
    const bigBillionMonths = [2, 5, 8, 11]; 
    
    let nextMonth = -1;
    let nextYear = year;
    
    for (const bbMonth of bigBillionMonths) {
      if (bbMonth > month || (bbMonth === month && today.getDate() < 20)) {
        nextMonth = bbMonth;
        break;
      }
    }

    if (nextMonth === -1) {
      nextMonth = bigBillionMonths[0];
      nextYear = year + 1;
    }
    
    const startDate = new Date(nextYear, nextMonth, 20, 0, 0, 0);
    const endDate = new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    const isActive = today >= startDate && today <= endDate;
    
    const products = [

      {
        id: 1,
        name: "iPhone 16 Pro Max",
        category: "Electronics",
        salePrice: 139900,
        originalPrice: 159900,
        discount: 13,
        image: "/i.png",
        rating: 4.8,
        reviews: 1247,
        brand: "Apple",
        stock: 45,
        tags: ["Best Seller", "Trending"]
      },
      {
        id: 2,
        name: "MacBook Air M3",
        category: "Electronics",
        salePrice: 99900,
        originalPrice: 114900,
        discount: 13,
        image: "/air.jpeg",
        rating: 4.6,
        reviews: 445,
        brand: "Apple",
        stock: 32,
        tags: ["New Launch"]
      },
      {
        id: 3,
        name: "Sony WH-1000XM5",
        category: "Electronics",
        salePrice: 24990,
        originalPrice: 29990,
        discount: 17,
        image: "/sony.jpeg",
        rating: 4.7,
        reviews: 892,
        brand: "Sony",
        stock: 67,
        tags: ["Noise Cancelling"]
      },
      {
        id: 4,
        name: 'Samsung 4K Smart TV 55"',
        category: "Electronics",
        salePrice: 41999,
        originalPrice: 54999,
        discount: 24,
        image: "/tv.jpeg",
        rating: 4.4,
        reviews: 789,
        brand: "Samsung",
        stock: 28,
        tags: ["Smart TV"]
      },
      {
        id: 5,
        name: "Dell XPS 15 Laptop",
        category: "Electronics",
        salePrice: 129999,
        originalPrice: 149999,
        discount: 13,
        image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400",
        rating: 4.5,
        reviews: 567,
        brand: "Dell",
        stock: 18,
        tags: ["Premium"]
      },
      {
        id: 6,
        name: "iPad Pro 12.9",
        category: "Electronics",
        salePrice: 89900,
        originalPrice: 104900,
        discount: 14,
        image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400",
        rating: 4.7,
        reviews: 892,
        brand: "Apple",
        stock: 56,
        tags: ["Pro"]
      },
      {
        id: 7,
        name: "Nike Air Jordan Retro",
        category: "Fashion",
        salePrice: 9799,
        originalPrice: 12999,
        discount: 25,
        image: "/nike.jpeg",
        rating: 4.9,
        reviews: 567,
        brand: "Nike",
        stock: 42,
        tags: ["Limited Edition"]
      },
      {
        id: 8,
        name: "Adidas Ultraboost 23",
        category: "Fashion",
        salePrice: 11899,
        originalPrice: 16999,
        discount: 30,
        image: "/ultra.jpeg",
        rating: 4.5,
        reviews: 678,
        brand: "Adidas",
        stock: 73,
        tags: ["Running Shoes"]
      },
      {
        id: 9,
        name: "Levi's Jeans",
        category: "Fashion",
        salePrice: 1799,
        originalPrice: 2999,
        discount: 40,
        image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400",
        rating: 4.3,
        reviews: 1234,
        brand: "Levi's",
        stock: 89,
        tags: ["Denim"]
      },
      {
        id: 10,
        name: "Ray-Ban Aviator",
        category: "Fashion",
        salePrice: 11999,
        originalPrice: 15999,
        discount: 25,
        image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400",
        rating: 4.6,
        reviews: 456,
        brand: "Ray-Ban",
        stock: 34,
        tags: ["Premium"]
      },
      {
        id: 11,
        name: "Gucci Handbag",
        category: "Fashion",
        salePrice: 89999,
        originalPrice: 119999,
        discount: 25,
        image:"https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400",
        rating: 4.8,
        reviews: 234,
        brand: "Gucci",
        stock: 12,
        tags: ["Luxury"]
      },
      {
        id: 12,
        name: "Rolex Watch",
        category: "Fashion",
        salePrice: 499999,
        originalPrice: 599999,
        discount: 17,
        image: "https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400",
        rating: 4.9,
        reviews: 89,
        brand: "Rolex",
        stock: 8,
        tags: ["Luxury"]
      },
      {
        id: 13,
        name: "Philips Air Fryer",
        category: "Home",
        salePrice: 4999,
        originalPrice: 7999,
        discount: 38,
        image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400",
        rating: 4.4,
        reviews: 789,
        brand: "Philips",
        stock: 56,
        tags: ["Healthy Cooking"]
      },
      {
        id: 14,
        name: "Milton Water Bottle",
        category: "Home",
        salePrice: 499,
        originalPrice: 899,
        discount: 44,
        image: "https://images.unsplash.com/photo-1523362628745-0c100150b504?w=400",
        rating: 4.3,
        reviews: 4567,
        brand: "Milton",
        stock: 234,
        tags: ["Bestseller"]
      },
      {
        id: 15,
        name: "Prestige Cookware Set",
        category: "Home",
        salePrice: 5999,
        originalPrice: 9999,
        discount: 40,
        image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400",
        rating: 4.5,
        reviews: 1234,
        brand: "Prestige",
        stock: 45,
        tags: ["Complete Set"]
      },
      {
        id: 16,
        name: "HUL Detergent",
        category: "Home",
        salePrice: 399,
        originalPrice: 599,
        discount: 33,
        image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400",
        rating: 4.2,
        reviews: 7890,
        brand: "HUL",
        stock: 567,
        tags: ["Essential"]
      },
      {
        id: 17,
        name: "L'Oreal Shampoo",
        category: "Beauty",
        salePrice: 299,
        originalPrice: 499,
        discount: 40,
        image: "https://images.unsplash.com/photo-1556228578-9c360e0b8f3c?w=400",
        rating: 4.3,
        reviews: 4567,
        brand: "L'Oreal",
        stock: 234,
        tags: ["Hair Care"]
      },
      {
        id: 18,
        name: "Nivea Body Lotion",
        category: "Beauty",
        salePrice: 249,
        originalPrice: 399,
        discount: 38,
        image: "https://images.unsplash.com/photo-1556228578-9c360e0b8f3c?w=400",
        rating: 4.4,
        reviews: 3456,
        brand: "Nivea",
        stock: 345,
        tags: ["Skin Care"]
      },
      {
        id: 19,
        name: "MAC Lipstick",
        category: "Beauty",
        salePrice: 1299,
        originalPrice: 1999,
        discount: 35,
        image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=400",
        rating: 4.6,
        reviews: 1234,
        brand: "MAC",
        stock: 67,
        tags: ["Premium"]
      },
      {
        id: 20,
        name: "Dove Soap",
        category: "Beauty",
        salePrice: 45,
        originalPrice: 75,
        discount: 40,
        image:"https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400",
        rating: 4.5,
        reviews: 7890,
        brand: "Dove",
        stock: 890,
        tags: ["Daily Use"]
      }
    ];    
    res.json({
      name: "Big Billion Days",
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      isActive,
      products,
      schedule: "Quarterly sale: March, June, September, December",
      nextSale: startDate.toISOString().split('T')[0]
    });
    
  } catch (err) {
    console.error('❌ Error in /api/big-billion:', err);
    res.status(500).json({ 
      error: 'Server error',
      message: 'Failed to fetch Big Billion data'
    });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    uptime: process.uptime()
  });
});

app.get('/', (req, res) => {
  res.json({ 
    message: 'E-commerce API is running',
    version: '1.0.0',
    endpoints: {
      events: '/api/events',
      bigBillion: '/api/big-billion',
      health: '/api/health'
    }
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    method: req.method
  });
});

app.use((err, req, res, next) => {
  console.error('🔥 Global Error Handler:', err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce';

mongoose.connection.on('connected', () => {
  console.log('✅ MongoDB connected successfully');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️ MongoDB disconnected');
});

const startServer = async () => {
  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    
    console.log("✅ MongoDB connected");

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`🚀 Server running at http://localhost:${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
      console.log(`🔧 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (err) {
    console.error("❌ Failed to start server:", err.message);
    console.error("Error details:", err);
    process.exit(1);
  }
};

process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB connection closed through app termination');
  process.exit(0);
});

startServer();









