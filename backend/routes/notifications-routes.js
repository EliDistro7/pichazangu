

const express = require("express");
const router = express.Router();
const { getNotificationsByUserId } = require("../controllers/notifications-controller.js");

// Route to get notifications by user ID
router.get("/notifications/:userId", getNotificationsByUserId);

module.exports = router;
