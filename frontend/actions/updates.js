

import axios from "axios";
const api = process.env.NEXT_PUBLIC_SERVER;

// Create a new Update
export const createUpdate = async ({ content, group }) => {
  try {
    const response = await axios.post(`${api}/create-updates`, { content, group });
    
    return response.data; // Contains success message or created update data
  } catch (error) {
    console.error("Error creating update:", error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || "Failed to create update. Please try again later."
    );
  }
};

// Fetch all Updates
export const getAllUpdates = async () => {
  try {
    const response = await axios.post(`${api}/get-updates`);
    return response.data; // Contains the list of all updates
  } catch (error) {
    console.log(error)
    console.error("Error fetching updates:", error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || "Failed to fetch updates. Please try again later."
    );
  }
};

// Get a single Update by ID
export const getUpdateById = async (id) => {
  try {
    const response = await axios.get(`${api}/get-update-by-id/${id}`);
    return response.data.update; // Contains the specific update data
  } catch (error) {
    console.error("Error fetching update by ID:", error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || "Failed to fetch update. Please try again later."
    );
  }
};

// Update an existing Update by ID
export const updateUpdate = async ({ id, content, group }) => {
  try {
    const response = await axios.put(`${api}/updates/${id}`, { content, group });
    return response.data; // Contains success message or updated update data
  } catch (error) {
    console.error("Error updating update:", error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || "Failed to update update. Please try again later."
    );
  }
};

// Delete an Update by ID
export const deleteUpdate = async (id) => {
  try {
    const response = await axios.delete(`${api}/updates/${id}`);
    return response.data; // Contains success message
  } catch (error) {
    console.error("Error deleting update:", error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || "Failed to delete update. Please try again later."
    );
  }
};
