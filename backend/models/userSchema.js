const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { 
    type: String, 
    required: function() { return this.authType === 'local'; } 
  },
  authType: {
    type: String,
    enum: ['local', 'google'],
    default: 'local'
  },
  googleId: { type: String, unique: true, sparse: true },
  avatar: { type: String },
  createdAt: { type: Date, default: Date.now },
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  notifications: [{ type: mongoose.Schema.Types.ObjectId, ref: "Notifications" }],
});

// Add index for compound unique constraint
UserSchema.index({ email: 1, authType: 1 }, { unique: true });

module.exports = mongoose.model("User", UserSchema);