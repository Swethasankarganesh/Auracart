const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  type: { 
    type: String, 
    enum: ['festival', 'mega', 'national', 'tamil'], 
    default: 'festival' 
  },
  banner: String,
  discountText: String,
  priority: { type: Number, default: 99 },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  isActive: { type: Boolean, default: true },
}, { 
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

EventSchema.virtual('status').get(function() {
  const now = new Date();
  const startDate = new Date(this.startDate);
  const endDate = new Date(this.endDate);
  
  if (now > endDate) return 'ended';
  if (now >= startDate && now <= endDate) return 'live';
  return 'upcoming';
});

module.exports = mongoose.model('Event', EventSchema);