

const mongoose = require("mongoose");

const NotificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true, // The user receiving the notification
    },
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Event",
      required: false, // Only required if the notification is related to an event
    },
    type: {
      type: String,
      enum: ["event_follow", "event_update", "new_follower", "message"],
      required: true, // Defines the type of notification
    },
    message: {
      type: String,
      required: true, // Notification message
    },
    read: {
      type: Boolean,
      default: false, // False by default, marking unread notifications
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notification", NotificationSchema);
