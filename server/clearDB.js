require('dotenv').config();
const mongoose = require('mongoose');
const Provider = require('./models/Provider');
const Order = require('./models/Order');
const User = require('./models/User');

const clearDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to DB...");

    await Provider.deleteMany({});
    console.log("✅ All Default Messes Cleared!");

    await Order.deleteMany({});
    console.log("✅ All Default Orders Cleared!");

    await User.deleteMany({});
    console.log("✅ All Default Users Cleared!");

    console.log("🎉 Database is completely empty and ready for REAL data!");
    process.exit();
  } catch (err) {
    console.error("Error clearing DB:", err);
    process.exit(1);
  }
};

clearDB();
