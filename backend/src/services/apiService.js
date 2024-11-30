import axios from 'axios';

const API_URL = 'http://localhost:8080'; // Adjust the base URL as needed

// Function to get user info
export const getUserInfo = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/user/info`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user info:', error);
    throw error;
  }
}; 