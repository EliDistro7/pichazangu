
import axios from "axios";

const api = process.env.NEXT_PUBLIC_SERVER;

// Create a new event
export const createEvent = async (event) => {
  console.log("Event data:", event);

  try {
    // Validate required fields
    if (!event.title || !event.description || !event.author || !event.author.username || !event.author.userId) {
      throw new Error("Title, description, and author details are required.");
    }

    // Validate password if the event is private
    if (event.private) {
      if (!event.password) {
        throw new Error("Password is required for private events.");
      }
      if (event.password.trim().length < 6) {
        throw new Error("Password must be at least 6 characters long.");
      }
    }

    // Prepare the event data for the API request
    const eventData = {
      title: event.title,
      description: event.description,
      elaborateDescription: event.elaborateDescription || "", // Optional
      coverPhoto: event.coverPhoto || "", // Optional
      imageUrls: event.imageUrls || [], // Default to empty array
      videoUrls: event.videoUrls || [], // Default to empty array
      author: {
        username: event.author.username,
        userId: event.author.userId,
      },
      private: event.private || false, // Default to public
      password: event.private ? event.password.trim() : undefined, // Include password only if private
      visibleOnHomepage: event.visibleOnHomepage || false, // Default to false
      boosted: event.boosted || false, // Default to false
    };

    // Make the API request
    const response = await axios.post(`${api}/events/create`, eventData);
    return response.data; // Returns success message or created event data
  } catch (error) {
    console.error("Error creating event:", error.response?.data || error.message);

    // Throw a user-friendly error message
    throw new Error(
      error.response?.data?.error || error.message || "Failed to create event. Please try again."
    );
  }
};

// Retrieve event media based on eventId and mediaType
export const getEventMedia = async ({eventId, mediaType}) => {
  try {
    const response = await axios.get(`${api}/event-media`, {
      params: {
        eventId,
        mediaType,
      },
    });
    return response.data.media; // Returns the media array
  } catch (error) {
    console.error("Error retrieving event media:", error.response?.data || error.message);
    throw new Error(
      error.response?.data?.error || "Failed to retrieve event media. Please try again."
    );
  }
};

// 🔍 Get Events by Author Name (Supports Fuzzy Search)
export const getEventsByAuthor = async (authorName) => {
  try {
    const response = await axios.get(`${api}/events/author`, {
      params: { author: authorName },
    });
    console.log("Events retrieved by author:", response.data);
    return response// Returns the list of events
  } catch (error) {
    console.error("Error retrieving events by author:", error.response?.data || error.message);
    throw new Error(
      error.response?.data?.error || "Failed to fetch events. Please try again."
    );
  }
};

export const searchEvents = async (query) => {
  try {
    const response = await axios.get(`${api}/search-events`, {
      params: { query }, // Use `query` instead of `author`
    });
    return response; // Returns the list of events
  } catch (error) {
    console.error("Error retrieving events:", error.response?.data || error.message);
    throw new Error(
      error.response?.data?.error || "Failed to fetch events. Please try again."
    );
  }
};

// Update event media (add new images and videos)

export const updateEventMedia = async ({
  eventId,
  newImages,
  newVideos,
  userId,
  mediaType,
  socket = null,
  senderName,
}) => {
  try {
    console.log("Updating event media for eventId:", eventId);

    const response = await axios.patch(`${api}/events/updateMedia`, {
      eventId,
      newImages,
      newVideos,
      userId, // Ensuring userId is sent for authorization
    });

    // Emit socket event if socket is available
    if (socket) {
      socket.emit("media_added", {
        senderName,
        mediaType,
        eventId,
        userId,
      });
    }

    console.log("Media update response:", response.data);
    return response.data; // Returns success message or updated event data
  } catch (error) {
    console.error("Error updating event media:", error.response?.data || error.message);
    throw new Error(
      error.response?.data?.error || "Failed to update event media. Please try again."
    );
  }
};

// Request to collaborate on an event
export const requestCollaboration = async ({
  eventId,
  userId,
  username,
  socket = null,
}) => {
  try {
    console.log("Sending collaboration request for event:", eventId);

    const response = await axios.post(`${api}/events/${eventId}/requestCollaboration`, {
      userId,
      username,
    });

    // Emit socket event if socket is available
    if (socket) {
      socket.emit("collaboration_requested", {
        eventId,
        userId,
        username,
      });
    }

    console.log("Collaboration request response:", response.data);
    return response.data; // Returns success message or updated event data
  } catch (error) {
    console.error("Error requesting collaboration:", error.response?.data || error.message);
    throw new Error(
      error.response?.data?.error || "Failed to send collaboration request. Please try again."
    );
  }
};


// Accept user request to join event
export const acceptUserToEvent = async ({
  eventId,
  userId,
  username,
  authorId, // The event owner's ID (to verify authorization)
  socket = null,
  senderName,
}) => {
  try {
    console.log("Accepting user request for event:", eventId);

    const response = await axios.post(`${api}/events/${eventId}/acceptUser`, {
      userId,
      username,
      authorId, // Ensure only the event owner can accept
    });

    // Emit socket event if socket is available
    if (socket) {
      socket.emit("user_accepted", {
        senderName,
        eventId,
        userId,
      });
    }

    console.log("User accepted response:", response.data);
    return response.data; // Returns success message or updated event data
  } catch (error) {
    console.error("Error accepting user request:", error.response?.data || error.message);
    throw new Error(
      error.response?.data?.error || "Failed to accept user request. Please try again."
    );
  }
};

export const removeInvitedUser = async ({eventId, userId, socket}) => {
  try {
    const response = await axios.delete(`${api}/events/${eventId}/invited/${userId}`);
   
     // Emit event to update real-time UI (if using socket.io)
     if (socket) {
      socket.emit("invitedUserRemoved", { eventId, userId });
    }
    return response.data;
  } catch (error) {
    console.error("Error removing invited user:", error);
    throw error.response?.data || { error: "Failed to remove invited user" };
  }
};

// Reject a collaboration request
export const rejectCollaborationRequest = async ({ eventId, requestId, socket = null }) => {
  try {
    const response = await axios.delete(`${api}/events/${eventId}/pendingRequests/${requestId}`);

    // Emit socket event if socket is available
    if (socket) {
      socket.emit("collaboration_request_rejected", {
        eventId,
        requestId,
      });
    }

    return response.data; // Returns success message or updated event data
  } catch (error) {
    console.error("Error rejecting collaboration request:", error.response?.data || error.message);
    throw new Error(
      error.response?.data?.error || "Failed to reject collaboration request. Please try again."
    );
  }
};


// Update event cover photo
export const updateEventCoverPhoto = async ({ eventId, newCoverPhoto, userId }) => {
  try {
    console.log("Updating cover photo for eventId:", eventId);
    const response = await axios.patch(`${api}/events/updateCoverPhoto`, {
      eventId,
      newCoverPhoto,
      userId,
    });
    console.log("Cover photo update response:", response.data);
    return response.data; // Returns success message or updated event data
  } catch (error) {
    console.error("Error updating cover photo:", error.response?.data || error.message);
    throw new Error(
      error.response?.data?.error || "Failed to update cover photo. Please try again."
    );
  }
};

// Fetch all events
export const getAllEvents = async () => {
  try {
    //console.log('api', api)
    const response = await axios.get(`${api}/get-events`);
    return response.data; // Returns all events
  } catch (error) {
    console.log(error);
    console.error("Error fetching events:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to fetch events.");
  }
};

// Get a single event by ID
export const getEventById = async (eventId) => {
  try {
    console.log("eventId of event:", eventId);
    const response = await axios.post(`${api}/event/${eventId}`);

    console.log("response:", response.data);
    return response.data; // Returns the specific event
  } catch (error) {
    console.log("error fetching event:", error.response?.data || error.message);
    console.error("Error fetching event:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to fetch event.");
  }
};

// Get an event by password
export const getEventByPassword = async ({ eventId, password }) => {
  try {
    const response = await axios.post(`${api}/events/getByPassword`, {
      eventId,
      password,
    });
    return response.data.event; // Returns event if password is correct
  } catch (error) {
    console.error("Error fetching event by password:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Incorrect password or event not found.");
  }
};



// Change event password
export const changeEventPassword = async ({ eventId, oldPassword, newPassword }) => {
  try {
    const response = await axios.patch(`${api}/events/changePassword`, {
      eventId,
      oldPassword,
      newPassword,
    });
    return response.data; // Returns success message
  } catch (error) {
    console.error("Error changing event password:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to change password.");
  }
};

// Delete an event
export const deleteEvent = async (eventId) => {
  try {
    const response = await axios.delete(`${api}/events/${eventId}`);
    return response.data; // Returns success message
  } catch (error) {
    console.error("Error deleting event:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to delete event.");
  }
};

// Follow an event
export const followEvent = async ({ eventId, userId, socket = null }) => {
  try {
    const response = await axios.post(`${api}/events/follow`, { eventId, userId });

    if (socket) {
      socket.emit("follow_event", { userId, eventId });
    }

    return response.data; // Returns success message or updated event data
  } catch (error) {
    console.error("Error following event:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to follow event.");
  }
};

// Unfollow an event
export const unfollowEvent = async ({ eventId, userId, socket = null }) => {
  try {
    const response = await axios.post(`${api}/events/unfollow`, { eventId, userId });

    if (socket) {
      socket.emit("unfollow_event", { userId, eventId });
    }

    return response.data; // Returns success message or updated event data
  } catch (error) {
    console.error("Error unfollowing event:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to unfollow event.");
  }
};

// Get followers of an event
export const getEventFollowers = async (eventId) => {
  try {
    const response = await axios.get(`${api}/event/${eventId}/followers`);
    return response.data; // Returns an array of followers;
  } catch (error) {
    console.error("Error fetching event followers:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to fetch event followers.");
  }
};


// Add a view to an event
export const addViewToEvent = async ({ eventId, userId, socket = null,senderName  }) => {
  try {
    const response = await axios.post(`${api}/events/add-view`, { eventId, userId});

    if (socket) {
      socket.emit("view_event", { userId, eventId,senderName });
    }

    return response.data; // Returns success message or updated event data
  } catch (error) {
    console.error("Error adding view to event:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to add view.");
  }
};

// Add a message to an event
export const addMessage = async ({ eventId, userId, senderName, phoneNumber, content, socket = null }) => {
  try {
    console.log('eventId', eventId);
    const response = await axios.post(`${api}/events/${eventId}/messages`, {
      senderName,
      phoneNumber,
      content,
    });

    if (socket) {
      socket.emit("new_message", {senderName, userId,eventId, messageContent:content });

    }


    return response.data; // Returns the added message
  } catch (error) {
    console.error("Error adding message:", error.response?.data || error.message);
    throw new Error(error.response?.data?.error || "Failed to add message. Please try again.");
  }
};

// Authenticate an event by eventId and password
export const authenticateEvent = async ({ eventId, password }) => {
  try {
    const response = await axios.post(
      `${api}/events/${eventId}/authenticate`,
      { password }
    );
    return response.data; // Returns the event data if authentication is successful
  } catch (error) {
    console.error(
      "Error authenticating event:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.error ||
        "Failed to authenticate event. Please try again."
    );
  }
};

// Fetch all events created by a specific user
export const getAllEventsByUser = async (userId) => {
  const response = await fetch(`${api}/events/user/${userId}`);
  if (!response.ok) throw new Error("Failed to fetch events.");
  return response.json();
};

// ✅ Mark a message as read
export const markMessageAsRead = async ({ eventId, messageId }) => {
  try {
    const response = await axios.patch(`${api}/events/${eventId}/messages/${messageId}/read`);
    return response.data; // Returns the updated message status
  } catch (error) {
    console.error("Error marking message as read:", error.response?.data || error.message);
    throw new Error(
      error.response?.data?.error || "Failed to mark message as read. Please try again."
    );
  }
};

// ❌ Delete a message from an event
export const deleteMessage = async ({ eventId, messageId }) => {
  try {
    const response = await axios.delete(`${api}/events/${eventId}/messages/${messageId}`);
    return response.data; // Returns success confirmation
  } catch (error) {
    console.error("Error deleting message:", error.response?.data || error.message);
    throw new Error(
      error.response?.data?.error || "Failed to delete message. Please try again."
    );
  }
};