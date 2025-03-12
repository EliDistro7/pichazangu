const Notification = require("../../models/NotificationsSchema.js");
const User = require("../../models/userSchema.js");
const Event = require("../../models/eventSchema.js");

module.exports = function notificationEvents(io, socket, userSockets) {
  // Helper function to get the username based on userId
  const getUsernameById = async (userId) => {
    try {
      const user = await User.findById(userId);
      return user ? user.username : "Unknown User";
    } catch (err) {
      console.error("Error fetching username:", err);
      return "Unknown User";
    }
  };

  // Helper function to notify users in real-time via Socket.io
  const notifyUser = async (userId, event, eventData) => {
    

    console.log('sendng notification to user')
       // Notify the recipient in real time
      // notifyUser(userId, "new_message", { senderName, messageContent });
    const targetSocketId = userSockets[userId];
    if (targetSocketId) {
      console.log('succesful sent message to user')
      io.to(targetSocketId).emit(event, eventData);
    }
  };

  // Create and store a new notification
  const createNotification = async ({ senderName,userId, type, message, eventId = null }) => {
    try {
      console.log('Creating notification', senderName, userId, type, message, eventId)
      const notification = new Notification({
        user: userId,  // Recipient of the notification
        event: eventId, // Optional event reference
        type,
        message,
        senderName,
        read: false, // Default is unread
      });

      await notification.save();
      notifyUser(userId, "new_notification", notification);
    } catch (err) {
      console.error("Error saving notification:", err);
    }
  };

  // Listen for 'follow_user' event
  socket.on("follow_user", async ({ followerId, followedUserId }) => {
    try {
      const followerName = await getUsernameById(followerId);
      const message = `${followerName} started following you.`;

      await createNotification({
        userId: followedUserId,
        type: "new_follower",
        message,
        senderId: followerId,
      });
    } catch (err) {
      console.error("Error handling follow_user event:", err);
    }
  });

  // Listen for 'follow_event' event
  socket.on("media_added", async ({ userId, eventId, senderName, mediaType, eventTitle }) => {
    try {
      console.log("Handling media_added event...");
  
      // Fetch the event with followers
      const event = await Event.findById(eventId).populate("followers");
      if (!event) {
        console.error("Event not found:", eventId);
        return;
      }

      console.log('followers of the event:', event)
  
      const message = `${senderName} added new ${mediaType} in album ${eventTitle}.`;
  
      // Get followers (excluding the sender)
      const recipients = event.followers
        .map((follower) => follower._id.toString())
        .filter((followerId) => followerId !== userId.toString());
  
      console.log(`Notifying ${recipients.length} followers...`);
  
      for (const recipientId of recipients) {
        await createNotification({
          userId: recipientId,
          type: "media_added",
          message,
          eventId,
          senderName,
        });
  
        notifyUser(recipientId, "new_notification", { senderName, message });
      }
    } catch (err) {
      console.error("Error handling media_added event:", err);
    }
  });
  

  // Listen for 'like_event' event
  socket.on("like_event", async ({ userId, eventId, eventOwnerId }) => {
    try {
      const username = await getUsernameById(userId);
      const message = `${username} liked your event.`;

      await createNotification({
        userId: eventOwnerId,
        type: "event_like",
        message,
        eventId,
        senderId: userId,
      });
    } catch (err) {
      console.error("Error handling like_event event:", err);
    }
  });

  // Listen for 'view_event' event
  socket.on("view_event", async ({ userId, eventId, senderName}) => {
    try {
      //const username = await getUsernameById(userId);
      const message = `${senderName} viewed your event.`;

    
     

       await createNotification({
         userId: userId,
         type: "view_event",
         message,
         senderName: senderName,
         eventId:eventId,
       });

       // Notify the recipient in real time
      notifyUser(userId, "view_event", { senderName, message });
    } catch (err) {
      console.error("Error handling view_event event:", err);
    }
  });

  // Listen for 'send_message' event
  socket.on("new_message", async ({eventId, senderName, userId, messageContent }) => {
    try {
      console.log('message received')
      // const senderName = await getUsernameById(senderId);
      const message = `${senderName} sent you a message: "${messageContent}"`;

      await createNotification({
        userId: userId,
        type: "new_message",
        message,
        senderName: senderName,
        eventId:eventId,
      });

      // Notify the recipient in real time
      notifyUser(userId, "new_message", { senderName, messageContent });
    } catch (err) {
      console.error("Error handling send_message event:", err);
    }
  });

  return {
    createNotification,
  };
};
