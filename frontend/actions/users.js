

import axios from 'axios';

const api = process.env.NEXT_PUBLIC_SERVER;

/**
 * Fetch user details by userId
 * @param {string} userId - The ID of the user to retrieve
 * @returns {Promise<object>} - The user data
 */
export const getUserById = async (userId) => {
    try {
        const response = await axios.get(`${api}/user/${userId}`);
        return response.data; // Returns the user object
    } catch (error) {
        console.error("Error fetching user:", error);
        throw error; // Handle errors in the calling component
    }
};


export const getUsersByRole = async ({ adminId, role, page = 1, limit = 10 }) => {
  // Update with your actual API endpoint if needed

  try {
    const response = await axios.post(`${api}/getUsersByRole`, {
      adminId,
      role,
      page,
      limit,
    });

    return response.data; // Contains users, categories, pagination info
  } catch (error) {
    console.error('Error fetching users by role:', error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || 'Failed to fetch users. Please try again later.'
    );
  }
};


// Push a new matangazo notification
export const pushMatangazoNotification = async ({ group, message, userId }) => {
 // console.log('group', group);

  try {
    const response = await axios.post(`${api}/users/pushMatangazoNotifications`, {
      group,
      message,
      userId,
    });
    return response.data; // Contains success message or updated notifications
  } catch (error) {
    console.error('Error pushing matangazo notification:', error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || 'Failed to push notification. Please try again later.'
    );
  }
};

// Create a new donation
export const createDonation = async ({ name, details, startingDate, deadline, group,total }) => {
//  console.log('Creating donation:', { name, details, startingDate, deadline, group });
  
  try {
    const response = await axios.post(`${api}/users/createDonation`, {
      name,
      details,
      startingDate,
      deadline,
      group,
      total,
    });
    return response.data; // Contains success message or updated donations
  } catch (error) {
    console.error('Error creating donation:', error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || 'Failed to create donation. Please try again later.'
    );
  }
};



// Fetch notifications for a user
export const getUserNotifications = async (userId) => {
  try {
    const response = await axios.get(`${api}/users/${userId}/notifications`);
    return response.data.notifications; // Array of notifications
  } catch (error) {
    console.error('Error fetching user notifications:', error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || 'Failed to fetch notifications. Please try again later.'
    );
  }
};


// Fetch donations for a user
export const getUserDonations = async (userId) => {
  try {
    const response = await axios.get(`${api}/users/${userId}/donations`);
    return response.data.donations; // Array of donations
  } catch (error) {
    console.error('Error fetching user donations:', error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || 'Failed to fetch donations. Please try again later.'
    );
  }
};

// Mark a specific notification as read
export const markNotificationAsRead = async ({ userId, notificationId }) => {
  try {
    const response = await axios.put(
      `${api}/users/${userId}/notifications/${notificationId}/read`
    );
    return response.data.message; // Success message
  } catch (error) {
    console.error('Error marking notification as read:', error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || 'Failed to mark notification as read. Please try again later.'
    );
  }
};

// Mark a specific notification as read
export const removeNotification = async ({ userId, notificationId }) => {
  try {
    const response = await axios.delete(
      `${api}/users/${userId}/notifications/${notificationId}/remove`
    );
    return response.data.message; // Success message
  } catch (error) {
    console.error('Error marking notification as read:', error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || 'Failed to mark notification as read. Please try again later.'
    );
  }
};

// Fetch all matangazo notifications for a specific user
export const getMatangazoNotifications = async (userId) => {
  try {
    const response = await axios.get(`${api}/notifications/${userId}`);
    return response.data.notifications; // Return fetched notifications
  } catch (error) {
    console.error('Error fetching notifications:', error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || 'Failed to fetch notifications. Please try again later.'
    );
  }
};



// Delete a specific matangazo notification for a user and optionally for a group
export const deleteMatangazoNotification = async ({ userId, notificationId, group,message }) => {
  try {
   // console.log('group is defined', group)
    // Include group in the request body if provided
    const config = group ? { data: { group } } : {};
    const response = await axios.post(`${api}/notifications/${userId}/${notificationId}`, {group,message});
    return response.data.message; // Success message
  } catch (error) {
    console.error('Error deleting notification:', error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || 'Failed to delete notification. Please try again later.'
    );
  }
};

// Edit a specific matangazo notification for a user and optionally for a group
export const editMatangazoNotification = async ({ userId, notificationId, group, updatedData }) => {
  try {
    // Include group explicitly in the updated data if provided
    const payload = { ...updatedData };
    if (group) {
      payload.group = group;
    }

    const response = await axios.put(`${api}/notifications/${userId}/${notificationId}`, payload);
    return response.data.message; // Success message
  } catch (error) {
    console.error('Error editing notification:', error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || 'Failed to edit notification. Please try again later.'
    );
  }
};



// Pin a specific notification
export const pinNotification = async ({ userId, notificationId }) => {
  try {
    const response = await axios.patch(
      `${api}/users/${userId}/notifications/${notificationId}/pin`
    );
    return response.data.message; // Success message
  } catch (error) {
    console.error('Error pinning notification:', error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || 'Failed to pin notification. Please try again later.'
    );
  }
};


// Fetch donations by group and field type
export const getDonationsByGroupAndFieldType = async ({ userId, group, field_type }) => {
  //console.log('group', group)
  try {
    const response = await axios.post(`${api}/users/getDonations`, {
      userId,
      group,
      field_type
    });
    return response.data.donationsData; // Array of donations along with username details
  } catch (error) {
    console.error('Error fetching donations by group and field type:', error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || 'Failed to fetch donations. Please try again later.'
    );
  }
};


// Add amount to a specific donation
export const addDonationAmount = async ({ userId, donationId, amount }) => {
  try {
    const response = await axios.patch(
      `${api}/users/${userId}/donations/${donationId}/add`,
      { amount }
    );
    return response.data.message; // Success message
  } catch (error) {
    console.error('Error adding donation amount:', error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || 'Failed to add donation amount. Please try again later.'
    );
  }
};


// Fetch top-ranking users by group and time interval
export const getTopRankingUsers = async ({ group, interval }) => {
  try {
    const response = await axios.post(`${api}/attendance/top-ranking-users`, {
      group,
      interval,
    });
    return response.data.topRankingUsers; // Array of top-ranking users with details
  } catch (error) {
    console.error('Error fetching top-ranking users:', error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message ||
        'Failed to fetch top-ranking users. Please try again later.'
    );
  }
};


// Fetch default roles with leadership positions
export const getDefaultRoles = async () => {
  try {
    const response = await axios.post(`${api}/getRoles`);
    
    // Ensure that roles are returned as an array of objects with role and defaultPositions
    return response.data.roles.map(roleObj => ({
      role: roleObj.role,
      defaultPositions: roleObj.defaultPositions || [] // Ensure defaultPositions is always an array
    }));
  } catch (error) {
    console.error('Error fetching default roles:', error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || 'Failed to fetch default roles.'
    );
  }
};

// Fetch leaders by role (now considers both role and leadership positions)
export const getLeadersByRole = async (role) => {
  try {
    const response = await axios.post(`${api}/getLeadersByRole`, { role });

    return {
      role,
      leaders: response.data.users, // Array of leader users
      categories: response.data.categories, // Analytics categories
      currentPage: response.data.currentPage,
      totalPages: response.data.totalPages,
      totalUsers: response.data.totalUsers,
    };
  } catch (error) {
    console.error(
      `Error fetching leaders for role "${role}":`,
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message ||
        `Failed to fetch leaders for role: ${role}`
    );
  }
};


// Add a subscription for a user
export const addSeriesSubscription = async (userId, subscriptionData) => {
  try {
    const response = await axios.post(`${api}/users/${userId}/subscriptions`, subscriptionData);
    return response.data;
  } catch (error) {
    console.error('Error adding subscription:', error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || 'Failed to add subscription.'
    );
  }
};

// Remove a subscription for a user
export const removeSeriesSubscription = async (userId, subscriptionId) => {
  try {
    const response = await axios.delete(`${api}/users/${userId}/subscriptions/${subscriptionId}`);
    return response.data;
  } catch (error) {
    console.error('Error removing subscription:', error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || 'Failed to remove subscription.'
    );
  }
};

// Add a notification for a user
export const addSeriesNotification = async (userId, notificationData) => {
  try {
    const response = await axios.post(`${api}/users/${userId}/notifications`, notificationData);
    return response.data;
  } catch (error) {
    console.error('Error adding notification:', error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || 'Failed to add notification.'
    );
  }
};

// Remove a notification for a user
export const removeSeriesNotification = async (userId, notificationId) => {
  try {
    const response = await axios.delete(`${api}/users/${userId}/notifications/${notificationId}`);
    return response.data;
  } catch (error) {
    console.error('Error removing notification:', error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || 'Failed to remove notification.'
    );
  }
};


// Fetch users born this month;
export const fetchUsersBornThisMonth = async () => {
  try {
    const response = await axios.post(`${api}/users/bornThisMonth`); 
   // console.log('response received', response);
    return response.data;
  } catch (error) {
   // console.log('error', error);
    console.error('Error fetching users born this month:', error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || 'Failed to fetch users born this month.'
    );
  }
};



