// utils/eventStatus.js
const resolveEventStatus = (event) => {
  const now = new Date();
  if (now < event.startDate) return 'upcoming';
  if (now > event.endDate) return 'ended';
  return 'live';
};

module.exports = { resolveEventStatus };
