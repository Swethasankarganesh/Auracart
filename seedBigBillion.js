const mongoose = require('mongoose');
require('dotenv').config();

const bigBillionSchema = new mongoose.Schema({
  eventId: String,
  name: String,
  startDate: Date,
  endDate: Date,
  isActive: Boolean,
  products: Array
});

const BigBillion = mongoose.model('BigBillion', bigBillionSchema);

function getNextBigBillionDate() {
  const today = new Date();
  const month = today.getMonth();
  const year = today.getFullYear();
  
  const bigBillionMonths = [2, 5, 8, 11]; // March, June, September, December
  
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
  
  return new Date(nextYear, nextMonth, 20, 0, 0, 0);
}

function getBigBillionProducts() {
  // Return the 20+ products array from above
  return ; // Copy the products array from above
}

async function seedBigBillion() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce');
    console.log('✅ Connected to MongoDB');

    // Clear existing events
    await BigBillion.deleteMany({});
    console.log('🧹 Cleared existing Big Billion events');

    // Create next 4 Big Billion events (next year)
    const today = new Date();
    const events = [];
    
    for (let i = 0; i < 4; i++) {
      const eventDate = new Date(today.getFullYear(), 2 + (i * 3), 20); // March, June, September, December
      const eventId = `big-billion-${eventDate.getFullYear()}-${String(eventDate.getMonth() + 1).padStart(2, '0')}`;
      
      const event = {
        eventId,
        name: "Big Billion Days",
        startDate: eventDate,
        endDate: new Date(eventDate.getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days
        isActive: i === 0, // First event is active
        products: getBigBillionProducts()
      };
      
      events.push(event);
    }

    await BigBillion.insertMany(events);
    console.log(`✅ Seeded ${events.length} Big Billion events`);

    await mongoose.connection.close();
    console.log('🔒 Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding Big Billion:', error);
    process.exit(1);
  }
}

seedBigBillion();