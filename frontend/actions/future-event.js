

import axios from "axios";
const api = process.env.NEXT_PUBLIC_SERVER; // Base API URL


// Create a new Future Event
export const createFutureEvent = async ({
  title,
  image,
  category,
  date,
  subtitle,
  buttons,
  extraDetails,
  groupAuthor,
}) => {
    console.log("Creating future event:", {
      title,
      image,
      category,
      date,
      subtitle,
      buttons,
      extraDetails,
      groupAuthor,
    });
  try {
    const response = await axios.post(`${api}/futureEvents/create`, {
      title,
      image,
      category,
      date,
      subtitle,
      buttons,
      extraDetails,
      groupAuthor,
    });
    return response.data; // Contains success message or created event data
  } catch (error) {
    console.error("Error creating future event:", error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || "Failed to create future event. Please try again later."
    );
  }
};

// Get all Future Events
export const getAllFutureEvents = async () => {
  try {
    const response = await axios.get(`${api}/futureEvents/getAll`);
    return response.data; // Contains success message and the list of future events
  } catch (error) {
    console.error("Error fetching future events:", error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || "Failed to fetch future events. Please try again later."
    );
  }
};

// Get a Future Event by ID
export const getFutureEventById = async (eventId) => {
  try {
    const response = await axios.get(`${api}/futureEvents/getFutureEventById/${eventId}`);
    return response.data.data; // Contains specific event data
  } catch (error) {
    console.error("Error fetching future event by ID:", error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || "Failed to fetch future event. Please try again later."
    );
  }
};

// Update a Future Event by ID
export const updateFutureEventById = async (eventId, updateData) => {
  try {
    const response = await axios.patch(`${api}/futureEvents/updateFutureEventById/${eventId}`, updateData);
    return response.data; // Contains success message or updated event data
  } catch (error) {
    console.error("Error updating future event:", error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || "Failed to update future event. Please try again later."
    );
  }
};

// Delete a Future Event by ID
export const deleteFutureEventById = async (eventId) => {
  try {
    const response = await axios.delete(`${api}/futureEvents/deleteFutureEventById/${eventId}`);
    return response.data; // Contains success message or deleted event data
  } catch (error) {
    console.error("Error deleting future event:", error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || "Failed to delete future event. Please try again later."
    );
  }
};

// Delete All Future Events
export const deleteAllFutureEvents = async () => {
  try {
    const response = await axios.delete(`${api}/futureEvents/deleteAllFutureEvents`);
    return response.data; // Contains success message
  } catch (error) {
    console.error("Error deleting all future events:", error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || "Failed to delete all future events. Please try again later."
    );
  }
};
