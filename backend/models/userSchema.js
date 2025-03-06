
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Hashed password
  createdAt: { type: Date, default: Date.now },
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Array of followed users
  notifications: [{ type: mongoose.Schema.Types.ObjectId, ref: "Notifications" }], // Track user notifications
});

module.exports = mongoose.model("User", UserSchema);
