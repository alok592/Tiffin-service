import bcrypt from "bcryptjs";
import { connectDB } from "./db.js";
import User from "../server/models/User.js";

export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ msg: "Method not allowed" });
  }

  try {

    await connectDB();

    const { name, email, password, role } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: role || "student"
    });

    await newUser.save();

    res.status(200).json({ msg: "Registration successful" });

  } catch (error) {
    res.status(500).json({ msg: "Server error" });
  }
}