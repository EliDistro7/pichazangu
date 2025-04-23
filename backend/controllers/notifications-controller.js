const Notification = require("../models/NotificationsSchema.js");
const Event = require("../models/eventSchema.js")


async function populateEventTitles() {
  console.log('Starting to populate event titles...');
  
  // Find all notifications that have an event ID but no eventTitle
  const notificationsToUpdate = await Notification.find({
    event: { $exists: true, $ne: null },
    eventTitle: { $exists: false }
  });
  
  console.log(`Found ${notificationsToUpdate.length} notifications to update`);
  
  // Group notifications by event ID to minimize database queries
  const eventGroups = {};
  notificationsToUpdate.forEach(notification => {
    const eventId = notification.event.toString();
    if (!eventGroups[eventId]) {
      eventGroups[eventId] = [];
    }
    eventGroups[eventId].push(notification._id);
  });
  
  // Process each event group
  let updatedCount = 0;
  let errorCount = 0;
  
  for (const eventId of Object.keys(eventGroups)) {
    try {
      // Find the event
      const event = await Event.findById(eventId);
      
      if (event && event.title) {
        // Update all notifications for this event
        const result = await Notification.updateMany(
          { _id: { $in: eventGroups[eventId] } },
          { $set: { eventTitle: event.title } }
        );
        
        updatedCount += result.nModified;
        console.log(`Updated ${result.nModified} notifications for event "${event.title}" (${eventId})`);
      } else {
        console.log(`Event ${eventId} not found or has no title. Skipping ${eventGroups[eventId].length} notifications.`);
        errorCount += eventGroups[eventId].length;
      }
    } catch (error) {
      console.error(`Error processing event ${eventId}:`, error);
      errorCount += eventGroups[eventId].length;
    }
  }
  
  console.log(`
    Update complete:
    - Total notifications processed: ${notificationsToUpdate.length}
    - Successfully updated: ${updatedCount}
    - Failed to update: ${errorCount}
  `);
}

populateEventTitles()

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

const markNotificationAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    
    const notification = await Notification.findByIdAndUpdate(notificationId, { read: true }, { new: true });
    
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }
    
    res.status(200).json(notification);
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;
    
    const notification = await Notification.findByIdAndDelete(notificationId);
    
    if (!notification) {
      return res.status(404).json({ message: "Notification not found" });
    }
    
    res.status(200).json({ message: "Notification deleted successfully" });
  } catch (error) {
    console.error("Error deleting notification:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { getNotificationsByUserId, markNotificationAsRead, deleteNotification };
