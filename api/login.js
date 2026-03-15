import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { connectDB } from "./db.js";
import User from "../server/models/User.js";

export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ msg: "Method not allowed" });
  }

  try {

    await connectDB();

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
}