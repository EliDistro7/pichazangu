

import axios from "axios";

const api = process.env.NEXT_PUBLIC_SERVER;

// Fetch notifications for a user
export const getNotifications = async (userId) => {
  try {
    const response = await axios.get(`${api}/notifications/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching notifications:", error.response?.data || error.message);
    throw new Error(error.response?.data?.error || "Failed to fetch notifications. Please try again.");
  }
};

// Mark a notification as read
export const markNotificationAsRead = async (notificationId) => {
  try {
    const response = await axios.patch(`${api}/notifications/${notificationId}/read`);
    return response.data;
  } catch (error) {
    console.error("Error marking notification as read:", error.response?.data || error.message);
    throw new Error(error.response?.data?.error || "Failed to mark notification as read. Please try again.");
  }
};

// Delete a notification
export const deleteNotification = async (notificationId) => {
  try {
    const response = await axios.delete(`${api}/notifications/${notificationId}`);
    return response.data;
  } catch (error) {
    console.error("Error deleting notification:", error.response?.data || error.message);
    throw new Error(error.response?.data?.error || "Failed to delete notification. Please try again.");
  }
};
