const Event = require("../models/eventSchema"); // Import the Event model
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");




exports.getAllEventsByUser = async (req, res) => {
  try { 
    console.log('it opened getAllEventsByUser');
    
    const { userId } = req.params;
  

    console.log("User ID:", userId);

    // Find events where author.userId matches userId as a string
    const events = await Event.find({}).lean(); // `.lean()` returns plain JavaScript objects

     // Filter events manually (ensuring author and userId exist before calling .toString())
     const filteredEvents = events.filter(event => 
      event.author && event.author.userId && event.author.userId.toString() === userId
    );

    res.status(200).json(filteredEvents);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch events." });
  }
};

// Get events by author name with fuzzy matching
exports.getEventsByAuthor = async (req, res) => {
  try {
    const { author } = req.query;
    if (!author) return res.status(400).json({ error: "Author name is required" });

    // Fuzzy search using regex (case-insensitive)
    const query = { "author.username": { $regex: author, $options: "i" } };

    // Fetch matching events
    const events = await Event.find(query).sort({ createdAt: -1 });

    // If no exact match, try full-text fuzzy search (if indexed)
    if (events.length === 0) {
      const fuzzyQuery = { $text: { $search: author } };
      const fuzzyEvents = await Event.find(fuzzyQuery).sort({ createdAt: -1 });

      return res.status(200).json(fuzzyEvents);
    }

    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
};

exports.searchEvents = async (req, res) => {
  try {
    const { query } = req.query; // Rename `author` to `query` for broader search
    if (!query) return res.status(400).json({ error: "Search query is required" });

    // Fuzzy search using regex (case-insensitive) for both username and title
    const regexQuery = {
      $or: [
        { "author.username": { $regex: query, $options: "i" } }, // Search by username
        { title: { $regex: query, $options: "i" } }, // Search by title
      ],
    };

    // Fetch matching events
    const events = await Event.find(regexQuery).sort({ createdAt: -1 });

    // If no exact match, try full-text fuzzy search (if indexed)
    if (events.length === 0) {
      const fuzzyQuery = { $text: { $search: query } };
      const fuzzyEvents = await Event.find(fuzzyQuery).sort({ createdAt: -1 });

      return res.status(200).json(fuzzyEvents);
    }

    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error", details: error.message });
  }
};

// Add a new message to an event
exports.addMessage = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { senderName, phoneNumber, content } = req.body;

    if (!senderName || !phoneNumber || !content) {
      return res.status(400).json({ error: "All message fields are required." });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: "Event not found." });
    }

    const newMessage = {
      senderName,
      phoneNumber,
      content,
      status: "unread",
    };

    event.messages.push(newMessage);
    await event.save();

    res.status(201).json({ message: "Message added successfully.", newMessage });
  } catch (error) {
    res.status(500).json({ error: "Failed to add message.", details: error.message });
  }
};



// Get all public events with pagination
exports.getAllEvents = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query; // Default: page 1, limit 10

    const events = await Event.find({ private: false }) // Fetch only public events
      .select("-password -messages") // Exclude sensitive fields
      .sort({ createdAt: -1 }) // Newest events first
      .skip((page - 1) * limit) // Skip previous pages
      .limit(parseInt(limit)); // Limit results

    const totalEvents = await Event.countDocuments({ private: false });

    res.status(200).json({
      events,
      currentPage: parseInt(page),
      totalPages: Math.ceil(totalEvents / limit),
      totalEvents,
    });
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


// Controller to retrieve followers of an event by eventId
exports.getEventFollowers = async (req, res) => {
  try {
      const { eventId } = req.params;

      // Validate eventId format
      if (!mongoose.Types.ObjectId.isValid(eventId)) {
          return res.status(400).json({ message: "Invalid event ID" });
      }

      // Fetch event details along with its followers
      const event = await Event.findById(eventId).populate("followers", "username email");

      if (!event) {
          return res.status(404).json({ message: "Event not found" });
      }

      // Return the list of followers
      res.status(200).json({ followers: event.followers });
  } catch (error) {
      console.error("Error fetching event followers:", error);
      res.status(500).json({ message: "Server error" });
  }
};


// Mark a message as read
exports.markMessageAsRead = async (req, res) => {
  try {
    const { eventId, messageId } = req.params;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: "Event not found." });
    }

    const message = event.messages.id(messageId);
    if (!message) {
      return res.status(404).json({ error: "Message not found." });
    }

    message.status = "read";
    await event.save();

    res.status(200).json({ message: "Message marked as read.", updatedMessage: message });
  } catch (error) {
    res.status(500).json({ error: "Failed to update message status.", details: error.message });
  }
};

// Delete a message
exports.deleteMessage = async (req, res) => {
  try {
    const { eventId, messageId } = req.params;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: "Event not found." });
    }

    const messageIndex = event.messages.findIndex((msg) => msg._id.toString() === messageId);
    if (messageIndex === -1) {
      return res.status(404).json({ error: "Message not found." });
    }

    event.messages.splice(messageIndex, 1);
    await event.save();

    res.status(200).json({ message: "Message deleted successfully." });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete message.", details: error.message });
  }
};




// ✅ Update Event Media (Add New Images and Videos)// Controller for updating event media (add new images and videos)
exports.updateEventMedia = async (req, res) => {
  try {
    const { eventId, newImages, newVideos, userId } = req.body;
    console.log("Received update media request:", req.body);

    // Find the event by ID
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    // Compare provided userId with the event's author userId
    if (event.author.userId.toString() !== userId) {
      return res.status(403).json({ error: "Not authorized to update this event." });
    }

    // Append new images if provided
    if (newImages && newImages.length > 0) {
      console.log("Adding new images:", newImages);
      event.imageUrls.push(...newImages);
    }

    // Append new videos if provided
    if (newVideos && newVideos.length > 0) {
      console.log("Adding new videos:", newVideos);
      event.videoUrls.push(...newVideos);
    }

    await event.save();
    console.log("Updated event media successfully:", event);
    res.status(200).json({ message: "Event media updated successfully", event });
  } catch (error) {
    console.error("Error updating event media:", error);
    res.status(500).json({ error: "Server error while updating event media" });
  }
};

exports.getEventMedia = async (req, res) => {
  try {
    // Expecting eventId and mediaType as query parameters:
    // e.g., /api/event-media?eventId=123&mediaType=photo
    const { eventId, mediaType } = req.query;
    
    if (!eventId || !mediaType) {
      return res.status(400).json({ error: "Missing required parameters: eventId and mediaType" });
    }
    
    // Find the event by its ID
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }
    
    // Determine which media array to return based on mediaType.
    let mediaArray;
    if (mediaType.toLowerCase() === "video") {
      mediaArray = event.videoUrls;
    } else if (
      mediaType.toLowerCase() === "photo" ||
      mediaType.toLowerCase() === "image"
    ) {
      mediaArray = event.imageUrls;
    } else {
      return res.status(400).json({
        error: "Invalid mediaType provided. Use 'photo' (or 'image') or 'video'.",
      });
    }
    
    // Return the media array
    return res.status(200).json({ media: mediaArray });
  } catch (error) {
    console.error("Error retrieving event media:", error);
    return res.status(500).json({ error: "Server error while retrieving event media" });
  }
};
// Controller for updating event cover photo
exports.updateEventCoverPhoto = async (req, res) => {
  try {
    const { eventId, newCoverPhoto, userId } = req.body;
    console.log("Received cover photo update request:", req.body);

    // Find the event by ID
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }

    // Compare provided userId with the event's author userId
    if (event.author.userId.toString() !== userId) {
      return res.status(403).json({ error: "Not authorized to update this event." });
    }

    // Update the cover photo URL
    event.coverPhoto = newCoverPhoto;
    await event.save();
    console.log("Cover photo updated successfully:", event);
    res.status(200).json({ message: "Cover photo updated successfully", event });
  } catch (error) {
    console.error("Error updating cover photo:", error);
    res.status(500).json({ error: "Server error while updating cover photo" });
  }
};


// ✅ Get All Events
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch events" });
  }
};

// ✅ Get a Single Event by ID
exports.getEventById = async (req, res) => {
  try {
    console.log('it reaches here, skipping')
    const { eventId } = req.params;
    const event = await Event.findById(eventId);

    if (!event) return res.status(404).json({ error: "Event not found" });

    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch event" });
  }
};

// ✅ Update an Event (Add New Images/Videos)
exports.updateEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { imageUrls, videoUrls, title, description } = req.body;

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ error: "Event not found" });

    // Append new images and videos to existing arrays
    if (imageUrls) event.imageUrls.push(...imageUrls);
    if (videoUrls) event.videoUrls.push(...videoUrls);
    if (title) event.title = title;
    if (description) event.description = description;

    await event.save();
    res.status(200).json({ message: "Event updated successfully", event });
  } catch (error) {
    res.status(500).json({ error: "Failed to update event" });
  }
};

// ✅ Delete an Event
exports.deleteEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const deletedEvent = await Event.findByIdAndDelete(eventId);

    if (!deletedEvent) return res.status(404).json({ error: "Event not found" });

    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete event" });
  }
};

// ✅ Follow an Event
exports.followEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { userId } = req.body; // User ID of the follower

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ error: "Event not found" });

    // Check if user is already following
    if (event.followers.includes(userId))
      return res.status(400).json({ error: "User already following this event" });

    event.followers.push(userId);
    await event.save();

    res.status(200).json({ message: "User followed the event", event });
  } catch (error) {
    res.status(500).json({ error: "Failed to follow event" });
  }
};

// ✅ Add Viewer to an Event
exports.viewEvent = async (req, res) => {
  try {
 
    const { userId, eventId  } = req.body; // User ID of the viewer
    console.log('user id: ' + userId)
    console.log('event id: ' + eventId)

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ error: "Event not found" });

    // Check if user has already viewed
    if (event.views.includes(userId))
      return res.status(400).json({ error: "User already viewed this event" });

    event.views.push(userId);
    await event.save();

    res.status(200).json({ message: "User viewed the event", event });
  } catch (error) {
    res.status(500).json({ error: "Failed to record event view" });
  }
};


exports.toggleFollowEvent = async (req, res) => {
  const { eventId } = req.params;
  const { userId } = req.body; // Assuming userId is passed in the request body
  console.log('user id: ' + userId)

  try {
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    // Check if the user is already following the event
    const isFollowing = event.followers.includes(userId);

    if (isFollowing) {
      // Unfollow the event
      event.followers = event.followers.filter((id) => id !== userId);
    } else {
      // Follow the event
      event.followers.push(userId);
    }

    await event.save();

    res.status(200).json({
      message: isFollowing ? "Unfollowed successfully" : "Followed successfully",
      isFollowing: !isFollowing, // Return the new follow state
    });
  } catch (error) {
    console.error("Error toggling follow:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



// ✅ Unfollow an Event
exports.unfollowEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { userId } = req.body; // User ID of the follower

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ error: "Event not found" });

    // Remove the user from followers
    event.followers = event.followers.filter((id) => id !== userId);
    await event.save();

    res.status(200).json({ message: "User unfollowed the event", event });
  } catch (error) {
    res.status(500).json({ error: "Failed to unfollow event" });
  }
};

// ✅ Authenticate and Retrieve an Event by Passwordconst bcrypt = require("bcrypt");


exports.authenticateEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    let { password } = req.body;

    if (!password) {
      return res.status(400).json({ error: "Password is required" });
    }

    //password = password.trim();
    console.log("Event ID:", eventId);
    console.log("Provided password:", password);

    // Fetch the event and ensure password is included
    const event = await Event.findById(eventId).select('+password');
    if (!event) {
      console.log("Event not found");
      return res.status(404).json({ error: "Event not found" });
    }

    if (!event.password) {
      console.log("Event has no stored password");
      return res.status(400).json({ error: "No password set for this event" });
    }

    console.log("Stored password hash:", event.password);
    password = password.trim();
    // Correct bcrypt comparison
    const isMatch = await bcrypt.compare(password, event.password);

    if (!isMatch) {
      console.log("Password did not match");
      console.log('event._id: ' + event._id);
      console.log('event title', event.title)
      return res.status(401).json({ error: "Incorrect password" });
    }

    console.log("Authentication successful");
    res.status(200).json(event);
  } catch (error) {
    console.log("Error during authentication:", error);
    res.status(500).json({ error: "Failed to authenticate event" });
  }
};

// ✅ Create a New Event
exports.createEvent = async (req, res) => {
  try {
    const { title, description, coverPhoto, imageUrls, videoUrls, author, private: isPrivate, password } = req.body;
    console.log('received body:', req.body);

    // Validate password if event is private
    let hashedPassword = null;
    if (isPrivate) {
      if (!password) {
        return res.status(400).json({ error: "Password is required for private events" });
      }
      let password1 = password.trim();
      // Hash the password
            const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(password, salt);
    }

    const newEvent = new Event({
      title,
      description,
      coverPhoto, // Set cover photo URL
      imageUrls: imageUrls || [],
      videoUrls: videoUrls || [],
      author,
      private: isPrivate || false, // Default to public if not provided
      password: hashedPassword, // Set only if private
    });

    await newEvent.save();
    console.log("event id", newEvent._id);
    res.status(201).json({ message: "Event created successfully", event: newEvent });
  } catch (error) {
    console.log("Error creating event:", error);
    res.status(500).json({ error: "Server error while creating event" });
  }
};

  // ✅ Update Event Password (Only Event Creator Can Do This)
exports.updateEventPassword = async (req, res) => {
    try {
      const { eventId } = req.params;
      const { newPassword, author } = req.body; // User-provided new password and author
  
      const event = await Event.findById(eventId);
      if (!event) return res.status(404).json({ error: "Event not found" });
  
      // Check if the requester is the event creator
      if (event.author !== author) {
        return res.status(403).json({ error: "Unauthorized: Only the creator can update the password" });
      }
  
      // Hash the new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      event.password = hashedPassword;
      await event.save();
  
      res.status(200).json({ message: "Password updated successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to update event password" });
    }
  };
  
