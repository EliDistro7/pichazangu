

import axios from "axios";
const api = process.env.NEXT_PUBLIC_SERVER;

// Create a new Highlight
export const createHighlight = async ({ name, content, author }) => {
  try {
   // console.log("Creating a highlight", { name, content, author });
    const response = await axios.post(`${api}/highlights/createHighlight`, {
      name,
      content,
      author, // Include the author in the payload
    });
    return response.data; // Contains success message or created highlight data
  } catch (error) {
    console.error("Error creating highlight:", error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || "Failed to create highlight. Please try again later."
    );
  }
};


// Fetch recent Highlights
export const getRecentHighlights = async () => {
  try {
    const response = await axios.get(`${api}/highlights/recent`);
   // console.log('data received', response.data)
    return response.data; // Contains success message and the list of recent highlights
  } catch (error) {
    console.error("Error fetching recent highlights:", error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || "Failed to fetch recent highlights. Please try again later."
    );
  }
}



// Search High
// lights
export const searchHighlights = async (searchParams) => {
  try {
    //console.log("Searching highlights with params:", searchParams);

    // Build the query string from searchParams
    const queryString = new URLSearchParams(searchParams).toString();

    // Send the GET request with the query parameters
    const response = await axios.get(`${api}/highlights/search?${queryString}`);

    //console.log("Search results received:", response.data);
    return response.data; // Contains the search results
  } catch (error) {
    console.error("Error searching highlights:", error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || "Failed to search highlights. Please try again later."
    );
  }
};


// Add media to an existing tab
export const addMediaToTab = async ({ highlightId, tabKey, newMedia }) => {
  try {
    const response = await axios.patch(`${api}/highlights/addMediaToTab`, {
      highlightId,
      tabKey, // Send the tab index as expected by the backend
      newMedia, // Match the parameter name with the backend
    });
    return response.data; // Contains success message or updated tab data
  } catch (error) {
    console.error("Error adding media to tab:", error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || "Failed to add media to tab. Please try again later."
    );
  }
};


// Add a new tab to a highlight
export const addNewTab = async ({ highlightId, tabData }) => {
  try {
    const response = await axios.patch(`${api}/highlights/addNewTab`, {
      highlightId,
      tabData, // Match the backend's expected parameter
    });
    return response.data; // Contains success message or updated highlight data
  } catch (error) {
    console.error("Error adding new tab:", error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || "Failed to add new tab. Please try again later."
    );
  }
};


// Delete media from a specific tab
export const deleteMediaFromTab = async ({ highlightId, tabName, mediaId }) => {
  try {
    const response = await axios.delete(`${api}/highlights/deleteMediaFromTab`, {
      data: { highlightId, tabName, mediaId }, // Axios DELETE requests support sending data via the `data` property
    });
    return response.data; // Contains success message or updated tab data
  } catch (error) {
    console.error("Error deleting media from tab:", error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || "Failed to delete media from tab. Please try again later."
    );
  }
};

// Get a highlight by ID
export const getHighlightById = async (highlightId) => {
  try {
    const response = await axios.get(`${api}/highlights/getHighlightById/${highlightId}`);
    return response.data.highlight; // Contains highlight data
  } catch (error) {
    console.error("Error fetching highlight by ID:", error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || "Failed to fetch highlight. Please try again later."
    );
  }
};


