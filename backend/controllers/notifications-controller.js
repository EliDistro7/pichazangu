

const Notification = require("../models/NotificationsSchema.js");

const getNotificationsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const notifications = await Notification.find({ user: userId })
      .sort({ createdAt: -1 }) // Sort by latest notifications first
      .lean();

    res.status(200).json(notifications);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { getNotificationsByUserId };
