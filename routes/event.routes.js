const express = require('express');
const router = express.Router();

// Mock data for events
const mockEvents = [
  {
    _id: '1',
    name: "Republic Day",
    slug: "republic-day",
    type: "national",
    discountText: "Patriotic Offers",
    priority: 1,
    startDate: new Date('2026-01-26'),
    endDate: new Date('2026-01-31'),
    isActive: true,
    banner: "https://images.unsplash.com/photo-1549923746-c502d488b3ea?w=800&auto=format&fit=crop"
  },
  {
    _id: '2',
    name: "Pongal Festival",
    slug: "pongal-festival",
    type: "tamil",
    discountText: "Harvest Festival Sale",
    priority: 2,
    startDate: new Date('2026-01-14'),
    endDate: new Date('2026-01-16'),
    isActive: true,
    banner: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&auto=format&fit=crop"
  },
  {
    _id: '3',
    name: "Big Billion Days",
    slug: "big-billion-days",
    type: "mega",
    discountText: "Up to 80% OFF",
    priority: 1,
    startDate: new Date('2026-09-20'),
    endDate: new Date('2026-09-27'),
    isActive: false,
    banner: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&auto=format&fit=crop"
  },
  {
    _id: '4',
    name: "Diwali Festival",
    slug: "diwali-festival",
    type: "festival",
    discountText: "Festival of Lights Sale",
    priority: 3,
    startDate: new Date('2026-11-01'),
    endDate: new Date('2026-11-05'),
    isActive: false,
    banner: "https://images.unsplash.com/photo-1603383928973-5a9e85491a66?w=800&auto=format&fit=crop"
  },
  {
    _id: '5',
    name: "Tamil New Year",
    slug: "tamil-new-year",
    type: "tamil",
    discountText: "Traditional Offers",
    priority: 4,
    startDate: new Date('2026-04-14'),
    endDate: new Date('2026-04-16'),
    isActive: false,
    banner: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&auto=format&fit=crop"
  },
  {
    _id: '6',
    name: "Great Indian Festival",
    slug: "great-indian-festival",
    type: "mega",
    discountText: "Massive Discounts",
    priority: 2,
    startDate: new Date('2026-10-10'),
    endDate: new Date('2026-10-17'),
    isActive: false,
    banner: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&auto=format&fit=crop"
  }
];

// Get events for homepage
router.get('/home', async (req, res) => {
  try {
    console.log('Fetching events for homepage...');
    
    const today = new Date();
    const events = mockEvents
      .filter(event => event.isActive || new Date(event.startDate) >= today)
      .map(event => ({
        ...event,
        status: event.isActive ? 'live' : 'upcoming',
        formattedStartDate: event.startDate.toISOString().split('T')[0],
        formattedEndDate: event.endDate.toISOString().split('T')[0]
      }))
      .sort((a, b) => a.priority - b.priority);
    
    console.log(`Returning ${events.length} events`);
    res.json(events);
  } catch (err) {
    console.error('Error fetching events:', err);
    res.status(500).json({ 
      success: false, 
      message: 'Server error fetching events',
      error: err.message 
    });
  }
});

// Get all events
router.get('/', async (req, res) => {
  try {
    res.json(mockEvents);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get event by slug
router.get('/:slug', async (req, res) => {
  try {
    const event = mockEvents.find(e => e.slug === req.params.slug);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json(event);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create new event
router.post('/', async (req, res) => {
  try {
    const newEvent = {
      _id: Date.now().toString(),
      ...req.body,
      startDate: new Date(req.body.startDate),
      endDate: new Date(req.body.endDate)
    };
    
    mockEvents.push(newEvent);
    res.status(201).json(newEvent);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;