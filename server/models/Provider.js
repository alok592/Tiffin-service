const mongoose = require('mongoose');

const ProviderSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  messName: { type: String, required: true },
  address: { type: String, required: true },
  pricePerMeal: { type: Number, required: true },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true }
  },
  isVeg: { type: Boolean, default: true },
  todaysMenu: { type: [String], default: [] },
  weeklySchedule: {
    Monday: { type: [String], default: [] },
    Tuesday: { type: [String], default: [] },
    Wednesday: { type: [String], default: [] },
    Thursday: { type: [String], default: [] },
    Friday: { type: [String], default: [] },
    Saturday: { type: [String], default: [] },
    Sunday: { type: [String], default: [] }
  },
  subscriptionPlans: {
    trial: { price: { type: Number, default: 100 }, duration: { type: String, default: "1 Day" } },
    weekly: { price: { type: Number, default: 700 }, duration: { type: String, default: "7 Days" } },
    monthly: { price: { type: Number, default: 2500 }, duration: { type: String, default: "30 Days" } }
  },
  openingTime: { type: String, default: "08:00" },
  closingTime: { type: String, default: "22:00" },
  imageUrl: { type: String, default: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600" },
  rating: { type: Number, default: 4.5 },
  reviews: { type: Number, default: 120 }
});

ProviderSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Provider', ProviderSchema);
