

import axios from 'axios';

const api = process.env.NEXT_PUBLIC_SERVER

/**
 * Function to send a notification to the admin.
 * @param {string} name - The ID of the admin to notify.
 * @param {string} userId - The ID of the user attempting to register.
 * @returns {Promise<Object>} - The server response data.
 */
export const addRegisterNotification = async ({name, userId, selectedRole,type}) => {
  try {
    const response = await axios.post(`${api}/admin/addRegisterNotifications`, {
      name,
      userId,
      selectedRole, 
      type
    });

    //console.log('Notification added successfully:', response.data);
    return response.data; // Returning server response for further usage
  } catch (error) {
    console.error('Error adding notification:', error.response?.data || error.message);
    throw error; // Throwing the error for handling by the caller
  }
};


export const fetchAdminById = async () => {
    const adminId = process.env.NEXT_PUBLIC_MKUU
    try {
      const response = await axios.get(`${api}/admin/${adminId}`);
      console.log('Admin data:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching admin:', error.response?.data || error.message);
      throw error;
    }
  };



/**
 * Marks a notification as read for the admin.
 * 
 * @param {string} adminId - The ID of the admin.
 * @param {string} userId - The ID of the user whose notification needs to be marked as read.
 * @returns {Promise<void>} Resolves on success or throws an error.
 */
export const markNotificationAsRead = async ({ userId}) => {
    const adminId = process.env.NEXT_PUBLIC_MKUU
  try {
    // Send a POST request to the backend endpoint
    const response = await axios.post(`${api}/admin/markNotificationAsRead`, {
      adminId,
      userId,
    });

    if (response.status === 200) {
      console.log('Notification marked as read:', response.data.notification);
      return response.data.notification;
    }
  } catch (error) {
    console.error('Error marking notification as read:', error.response?.data?.message || error.message);
    throw error;
  }
};


/**
 * Deletes a notification for the admin.
 * 
 * @param {string} userId - The ID of the user whose notification needs to be deleted.
 * @returns {Promise<void>} Resolves on success or throws an error.
 */
export const deleteNotification = async ({ userId }) => {
  const adminId = process.env.NEXT_PUBLIC_MKUU; // Admin ID from environment variables
  try {
    // Send a POST request to the backend endpoint
    const response = await axios.post(`${api}/admin/deleteRegisterNotification`, {
      adminId,
      userId,
    });

    if (response.status === 200) {
      console.log('Notification deleted successfully:', response.data.message);
      return response.data.message;
    }
  } catch (error) {
    console.error('Error deleting notification:', error.response?.data?.message || error.message);
    throw error;
  }
};



export const verifyUser = async ({ userId }) => {
  const adminId = process.env.NEXT_PUBLIC_MKUU; // Admin ID from environment variables
  try {
    console.log(`Verifying ${userId}`)
    // Send a POST request to the backend endpoint
    const response = await axios.post(`${api}/verifyUser`, {
      adminId,
      userId,
    });

  }catch(err){
    console.log(err);
  }
}

export const addSelectedRole = async ({ userId, selected }) => {
  const adminId = process.env.NEXT_PUBLIC_MKUU; // Admin ID from environment variables
  try {
    console.log(`Verifying ${userId}`)
    // Send a POST request to the backend endpoint
    const response = await axios.post(`${api}/verifyUser`, {
      adminId,
      userId,
    });

  }catch(err){
    console.log(err);
  }
}

export const updateUserRoles = async ({ userId, selectedRoles, leadershipPositions }) => {
  const adminId = process.env.NEXT_PUBLIC_MKUU; // Admin ID from environment variables
  try {
    // Send a POST request to the backend endpoint to update user roles
    const response = await axios.post(`${api}/admin/updateUserRoles`, {
      adminId,
      userId,
      selectedRoles,
      leadershipPositions, // This can be omitted or set to {} if the user is not a leader
    });

    if (response.status === 200) {
      console.log('User roles updated successfully:', response.data.message);
      return response.data.message;
    }
  } catch (error) {
    console.error('Error updating user roles:', error.response?.data?.message || error.message);
    throw error;
  }
}; 
