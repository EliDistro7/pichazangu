// src/actions/userActions.ts
import axios from 'axios';


const server = process.env.NEXT_PUBLIC_SERVER;

/**
 * Sends a POST request to add a pledge for a user.
 * @param pledgeName - Name of the pledge.
 * @param pledgeAmount - Amount of the pledge.
 * @returns Promise resolving to the response or rejecting with an error.
 */
export const addPledge = async ({name,pledgeName, pledgeAmount}) => {
  try {
    // Retrieve the user's name from the cookie
   

    // Construct the payload
    const payload = {
      pledgeName,
      pledgeAmount,
      name,
    };

    // Make the POST request to the server
    const response = await axios.post(`${server}/addPledge`, payload);

    // Return the response data
    return response.data;
  } catch (error) {
    console.error('Error in addPledge:', error.message || error);
    throw error;
  }
};
