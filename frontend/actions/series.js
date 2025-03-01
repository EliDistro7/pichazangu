import axios from 'axios';
const api = process.env.NEXT_PUBLIC_SERVER;

// Create a new Series
export const createSeries = async ({ name, description, startDate, endDate, author }) => {
  try {
    const response = await axios.post(`${api}/series`, {
      name,
      description,
      startDate,
      endDate,
      author,
    });
    return response.data;
  } catch (error) {
    console.error('Error creating series:', error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || 'Failed to create series. Please try again later.'
    );
  }
};

// Get all Series
export const getAllSeries = async ({ author }) => {
  try {
    const response = await axios.post(`${api}/get-series`, { author });
    return response.data;
  } catch (error) {
    console.error('Error fetching series:', error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || 'Failed to fetch series. Please try again later.'
    );
  }
};


// Delete a Series
export const deleteSeries = async ({ seriesId, author }) => {
  try {
    // When sending a DELETE with a request body, use the 'data' option.
    const response = await axios.delete(`${api}/series/${seriesId}`, {
      data: { author },
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting series:', error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || 'Failed to delete series. Please try again later.'
    );
  }
};

// Add a Session to a Series
export const addSession = async ({ seriesId, date, title, content, author, audio }) => {
    try {
      const payload = { date, title, content, author };
      
      // Include the audio object if provided
      if (audio && typeof audio === 'object') {
        payload.audio = audio;
      }
  
      const response = await axios.post(`${api}/series/${seriesId}/sessions`, payload);
      return response.data;
    } catch (error) {
      console.error('Error adding session:', error.response?.data || error.message);
      throw new Error(
        error.response?.data?.message || 'Failed to add session. Please try again later.'
      );
    }
  };

  // Get a Single Session from a Series
export const getSession = async ({ seriesId, sessionId }) => {
  try {
    const response = await axios.get(`${api}/series/${seriesId}/sessions/${sessionId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching session:', error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || 'Failed to fetch session. Please try again later.'
    );
  }
};
  

// Delete a Session from a Series
export const deleteSession = async ({ seriesId, sessionId, author }) => {
  try {
    // When sending a DELETE with a request body, use the 'data' option.
    const response = await axios.delete(`${api}/series/${seriesId}/sessions/${sessionId}`, {
      data: { author },
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting session:', error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || 'Failed to delete session. Please try again later.'
    );
  }
};

// Update Attendance for a Session
export const updateAttendance = async ({ seriesId, sessionId, attendanceCount, author }) => {
  try {
    const response = await axios.patch(`${api}/series/${seriesId}/sessions/${sessionId}/attendance`, {
      attendanceCount,
      author,
    });
    return response.data;
  } catch (error) {
    console.error('Error updating attendance:', error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || 'Failed to update attendance. Please try again later.'
    );
  }
};

// Get a Single Series
export const getSingleSeries = async (seriesId) => {
  try {
    const response = await axios.get(`${api}/series/${seriesId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching single series:', error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || 'Failed to fetch series. Please try again later.'
    );
  }
};

// Get Audio Sessions for a Series
export const getAudioBySeries = async (seriesId) => {
  try {
    const response = await axios.get(`${api}/series/${seriesId}/audio`);
    return response.data;
  } catch (error) {
    console.error('Error fetching audio sessions:', error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || 'Failed to fetch audio sessions. Please try again later.'
    );
  }
};


// Add Notification to User Series
export const addNotificationToUser = async ({ userId, notification }) => {
  try {
    const response = await axios.post(`${api}/user/${userId}/series/notifications`, { notification });
    return response.data;
  } catch (error) {
    console.error('Error adding notification:', error.response?.data || error.message);
    throw new Error(
      error.response?.data?.message || 'Failed to add notification. Please try again later.'
    );
  }
};