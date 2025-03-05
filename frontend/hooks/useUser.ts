import axios from 'axios';
import Cookies from 'js-cookie';

// Define environment variable for server URL
const server = process.env.NEXT_PUBLIC_SERVER;

// Interfaces for TypeScript type safety
interface UserResponse {
  _id: string;
  username: string;
  email: string;
  role: string;
  createdAt: string;
  followers: string[];
  following: string[];
}

interface LoginCredentials {
  name: string;
  password: string;
}

interface ErrorResponse {
  response?: {
    data?: {
      message: string;
    };
  };
}

// Utility functions for managing secure cookies
export const setSecureCookie = (key: string, value: string): void => {
  Cookies.set(key, value, { secure: true, sameSite: 'Strict' });
};

 const getSecureCookie = (key: string): string | undefined => {
  const cookieValue = Cookies.get(key);
  // Replace underscores with spaces in the cookie value if it exists
  return cookieValue ? cookieValue.replace(/_/g, ' ') : undefined;
};


 const removeSecureCookie = (key: string): void => {
  Cookies.remove(key);
};

export const removeCookie = (): void => {
  removeSecureCookie('eventifyUserId');
  removeSecureCookie('eventifyUsername');
};

export const getCookie =() =>{
  return getSecureCookie('eventifyUsername')
}

export const getDesanitezedCookie =()=>{
  const sanitizedCookie = getSecureCookie('eventifyUsername');
  return sanitizedCookie? sanitizedCookie.replace(/_/g,'') : undefined;
}



export const getUser = async () => {
  try {
    const name = getDesanitezedCookie(); // Ensure the user ID is retrieved from cookies
    if (!name) {
      return null; // User is not logged in
    }

    // Make the API request
    const response = await axios.get(`${server}/${name}`); // Adjust endpoint as needed

    // Validate response
    if (response.status !== 200 || !response.data) {
      console.error("Failed to fetch user data:", response);
      return null; // Consider returning null if the response is invalid
    }

    return response.data; // Return user data
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null; // Return null in case of an error
  }
};


const login = async (
  endpoint: string,
  credentials: LoginCredentials
): Promise<UserResponse> => {
  try {
   // console.log('Login data:', credentials);
    const response = await axios.post(`${server}/${endpoint}`, credentials, {
      headers: { 'Content-Type': 'application/json' },
    });

    //console.log('Response:', response);

    if (!response.data || !response.data.user.name){
      throw new Error('Login failed: Invalid response structure');
    }

    // Replace spaces with underscores in the username
    const sanitizedUsername = response.data.user.username.replace(/\s+/g, '_');

    // Save the sanitized username to a secure cookie
    setSecureCookie('eventifyUsername', sanitizedUsername);
    setSecureCookie('eventifyUserId', response.data.user._id); // Save the user ID to a secure cookie

    // Return the sanitized user object
    return { ...response.data.user, name: sanitizedUsername };
  } catch (error) {
    const errorMessage =
      (error as ErrorResponse)?.response?.data?.message || 'Login failed';
    console.error('Login error:', errorMessage);
    throw new Error(errorMessage);
  }
};


// Specific login functions for normal and admin users
export const loginUser = async (
  credentials: LoginCredentials
): Promise<UserResponse> => {
  return login('login', credentials); // Normal user login endpoint
};

export const loginAdmin = async (
  credentials: LoginCredentials
): Promise<UserResponse> => {
  return login('loginAdmin', credentials); // Admin user login endpoint
};


// Function to retrieve the logged-in user's ID from a secure cookie
export const getLoggedInUserId = (): string | null => {
  const userId = Cookies.get('eventifyUserId');
  return userId ? userId : null;
};

export const getLoggedInUsername = (): string | null => {
  const userId = Cookies.get('eventifyUsername');
  return userId ? userId : null;
};


// Function to fetch users by role
export const getUsersByRole = async ({
  role,
  page = 1,
  limit = 10,
}: {
  role: string;
  page?: number;
  limit?: number;
}) => {
  try {
    // Retrieve the logged-in user's ID from the cookie
    const adminId = getLoggedInUserId();

    if (!adminId) {
      throw new Error('User is not logged in or user ID is missing.');
    }

    // Make the API request to retrieve users by role
    const response = await axios.post(
      `${server}/getUsersByRole`,
      { adminId, role, page, limit },
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );

    // Validate the response
    if (response.status !== 200) {
      throw new Error('Failed to fetch users.');
    }

    

    return response.data.users; // Returns users, categories, and pagination info
  } catch (error) {
    console.error('Error fetching users by role:', error);
    throw error;
  }
};