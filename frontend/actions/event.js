

import axios from "axios";

const api = process.env.NEXT_PUBLIC_SERVER;

// Create a new event
export const createEvent = async (event) => {
  console.log("event is",event)
  try {
    

    // Include password only if the event is private
   

    const response = await axios.post(`${api}/events/create`, event);
    return response.data; // Returns success message or created event data
  } catch (error) {
    console.error("Error creating event:", error.response?.data || error.message);
    throw new Error(
      error.response?.data?.error || "Failed to create event. Please try again."
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
    return response.data.events; // Returns the list of events
  } catch (error) {
    console.error("Error retrieving events by author:", error.response?.data || error.message);
    throw new Error(
      error.response?.data?.error || "Failed to fetch events. Please try again."
    );
  }
};

// Update event media (add new images and videos)
export const updateEventMedia = async ({ eventId, newImages, newVideos, userId }) => {
  try {
    console.log("Updating event media for eventId:", eventId);
    const response = await axios.patch(`${api}/events/updateMedia`, {
      eventId,
      newImages,
      newVideos,
      userId,
    });
    console.log("Media update response:", response.data);
    return response.data; // Returns success message or updated event data
  } catch (error) {
    console.error("Error updating event media:", error.response?.data || error.message);
    throw new Error(
      error.response?.data?.error || "Failed to update event media. Please try again."
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
export const followEvent = async ({ eventId, userId }) => {
  try {
    const response = await axios.post(`${api}/events/follow`, { eventId, userId });
    return response.data; // Returns success message or updated event data
  } catch (error) {
    console.error("Error following event:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to follow event.");
  }
};

// Unfollow an event
export const unfollowEvent = async ({ eventId, userId }) => {
  try {
    const response = await axios.post(`${api}/events/unfollow`, { eventId, userId });
    return response.data; // Returns success message or updated event data
  } catch (error) {
    console.error("Error unfollowing event:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to unfollow event.");
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

