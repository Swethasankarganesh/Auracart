// controllers/event.controller.js
const { fetchHomeEvents } = require('../services/event.service');

const getHomepageEvents = async (req, res) => {
  try {
    const events = await fetchHomeEvents();
    res.status(200).json(events);
  } catch (err) {
    console.error('Error fetching events:', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = { getHomepageEvents };
