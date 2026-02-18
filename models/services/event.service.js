// services/event.service.js
const Event = require('../models/Event.model');
const { resolveEventStatus } = require('../utils/eventStatus');

const fetchHomeEvents = async () => {
  const events = await Event.find({ isActive: true });

  return events
    .map(e => ({ ...e.toObject(), status: resolveEventStatus(e) }))
    .filter(e => e.status !== 'ended') // only upcoming + live
    .sort((a, b) => a.priority - b.priority); // order by priority
};

module.exports = { fetchHomeEvents };
