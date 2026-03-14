require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();

/* =======================
   MIDDLEWARE
======================= */

app.use(cors({
  origin: [
    "https://tiffin-service-chi.vercel.app",
    "http://localhost:3000"
  ],
  credentials: true
}));

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true }));

// Request Logger
app.use((req, res, next) => {
  console.log(`👉 ${req.method} ${req.url}`);
  next();
});

/* =======================
   DATABASE CONNECTION
======================= */

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected Successfully");
  } catch (err) {
    console.error("❌ MongoDB Error:", err.message);
    process.exit(1);
  }
};

connectDB();

};

connectDB();

/* =======================
   MODELS
======================= */

const User = require('./models/User');
const Provider = require('./models/Provider');
const Order = require('./models/Order');

/* =======================
   HEALTH CHECK
======================= */

app.get("/", (req, res) => {
  res.json({ message: "🚀 Tiffin Service API Running" });
});

/* =======================
   AUTH ROUTES
======================= */

app.post('/api/auth/register', async (req, res) => {
  try {

    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ msg: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: role || "student"
    });

    await newUser.save();

    res.json({ msg: "Registration Successful" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server Error" });
  }
});


app.post('/api/auth/login', async (req, res) => {
  try {

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user)
      return res.status(400).json({ msg: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch)
      return res.status(400).json({ msg: "Invalid password" });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    res.status(500).json({ msg: "Login error" });
  }
});

/* =======================
   PROVIDER ROUTES
======================= */

app.get('/api/providers', async (req, res) => {

  try {

    const { lat, lng } = req.query;

    if (lat && lng) {

      const providers = await Provider.aggregate([
        {
          $geoNear: {
            near: {
              type: "Point",
              coordinates: [parseFloat(lng), parseFloat(lat)]
            },
            distanceField: "distance",
            spherical: true,
            distanceMultiplier: 0.001
          }
        }
      ]);

      return res.json(providers);

    } else {

      const providers = await Provider.find();
      return res.json(providers);

    }

  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Error fetching providers" });
  }
});


app.get('/api/providers/:id', async (req, res) => {

  try {

    const provider = await Provider.findById(req.params.id);

    if (!provider)
      return res.status(404).json({ msg: "Provider not found" });

    res.json(provider);

  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }

});


app.post('/api/providers', async (req, res) => {

  try {

    const newProvider = new Provider(req.body);
    await newProvider.save();

    res.json({ msg: "Mess Added Successfully" });

  } catch (err) {
    res.status(500).json({ msg: "Error adding mess" });
  }

});


app.put('/api/providers/:id', async (req, res) => {

  try {

    const updated = await Provider.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updated);

  } catch (err) {
    res.status(500).json({ msg: "Error updating mess" });
  }

});

/* =======================
   ORDERS ROUTES
======================= */

app.get('/api/orders', async (req, res) => {

  try {

    const orders = await Order.find().sort({ createdAt: -1 });

    res.json(orders);

  } catch (err) {
    res.status(500).json({ msg: "Error fetching orders" });
  }

});


app.post('/api/orders', async (req, res) => {

  try {

    const newOrder = new Order(req.body);
    await newOrder.save();

    res.json(newOrder);

  } catch (err) {
    res.status(500).json({ msg: "Error creating order" });
  }

});


app.put('/api/orders/:id', async (req, res) => {

  try {

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );

    res.json(updatedOrder);

  } catch (err) {
    res.status(500).json({ msg: "Error updating order" });
  }

});

/* =======================
   SERVER START
======================= */

const PORT = process.env.PORT || 10000;

app.listen(PORT, () => {
  console.log(`🚀 Professional Server running on Port ${PORT}`);
});
