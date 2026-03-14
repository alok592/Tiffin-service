const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  // Basic User Info
  name: { 
    type: String, 
    required: true 
  },
  email: { 
    type: String, 
    required: true, 
    unique: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  role: { 
    type: String, 
    default: 'student' // 'student' ya 'owner'
  },
  
  // ✅ NEW FEATURE: Subscription Data
  // (Ye naya hissa hai jo humne abhi add kiya hai)
  subscription: {
    plan: { type: String, default: 'None' }, // Values: 'Weekly', 'Monthly', 'None'
    startDate: { type: Date },
    endDate: { type: Date },
    isActive: { type: Boolean, default: false }
  }
});

module.exports = mongoose.model('User', UserSchema);