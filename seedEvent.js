const mongoose = require('mongoose');
require('dotenv').config();

const eventSchema = new mongoose.Schema({
  name: String,
  slug: String,
  type: String,
  discountText: String,
  priority: Number,
  startDate: Date,
  endDate: Date,
  isActive: Boolean
});

const Event = mongoose.model('Event', eventSchema);

async function seedEvents() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce');
    console.log('✅ Connected to MongoDB');

    // Clear existing events
    await Event.deleteMany({});
    console.log('🧹 Cleared existing events');

    // Create sample events
    const events = [
      {
        name: "Big Billion Days 2024",
        slug: "big-billion-days-2024",
        type: "mega",
        discountText: "Up to 80% OFF",
        priority: 1,
        startDate: new Date("2024-12-25"),
        endDate: new Date("2024-12-31"),
        isActive: true
      },
      {
        name: "Republic Day Sale",
        slug: "republic-day-sale-2025",
        type: "national",
        discountText: "Patriotic Offers",
        priority: 2,
        startDate: new Date("2025-01-20"),
        endDate: new Date("2025-01-30"),
        isActive: true
      },
      {
        name: "Pongal Festival Sale",
        slug: "pongal-festival-2025",
        type: "tamil",
        discountText: "Harvest Festival Sale",
        priority: 3,
        startDate: new Date("2025-01-10"),
        endDate: new Date("2025-01-17"),
        isActive: true
      },
      {
        name: "Diwali Festival",
        slug: "diwali-festival-2024",
        type: "festival",
        discountText: "Festival of Lights Sale",
        priority: 4,
        startDate: new Date("2024-10-28"),
        endDate: new Date("2024-11-05"),
        isActive: true
      },
      {
        name: "New Year Mega Sale",
        slug: "new-year-mega-sale-2025",
        type: "mega",
        discountText: "Up to 70% OFF",
        priority: 5,
        startDate: new Date("2025-01-01"),
        endDate: new Date("2025-01-07"),
        isActive: true
      }
    ];

    await Event.insertMany(events);
    console.log(`✅ Seeded ${events.length} events:`);
    events.forEach(event => console.log(`   - ${event.name}`));

    await mongoose.connection.close();
    console.log('🔒 Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding events:', error);
    process.exit(1);
  }
}

seedEvents();