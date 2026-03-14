const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  mobile: { type: String, required: true }, // Using mobile/email as user identifier
  messName: { type: String, required: true },
  providerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Provider' },
  items: { type: String, required: true }, // E.g. "Standard Thali" or "Monthly Pro Subscription"
  price: { type: Number, required: true },
  
  // Is this a regular order or a subscription?
  orderType: { 
    type: String, 
    enum: ['Single', 'Weekly', 'Monthly'], 
    default: 'Single' 
  },
  
  // For subscriptions, track expiration
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date },
  
  status: { type: String, default: 'Pending' }, // Pending, Accepted, Rejected, Expired
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', OrderSchema);
