// src/api/userAPI.ts
import axios from 'axios';

const API_BASE_URL = 'https://jellyfish-app-43090-zm6h3.ondigitalocean.app';

export const fetchUsers = async (token: string) => {
  const response = await axios.get(`${API_BASE_URL}/api/users?populate=*`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};


export const updateUserThumbnail = async (userId: number, thumbnailId: string, token: string) => {
  const response = await axios.put(
    `${API_BASE_URL}/api/users/${userId}`,
    { thumbnail: thumbnailId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

export const updateUserName = async ( token: string ) => {
  const userId = 1; 
  const newName = 'hungcan2003'; 

  try {
    const response = await axios.put(
      `${API_BASE_URL}/api/users/${userId}`,
      {
        name: newName,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    console.log('User updated:', response.data);
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      // Handle Axios-specific errors
      console.error('Error updating user:', error.response ? error.response.data : error.message);
    } else {
      // Handle non-Axios errors
      console.error('Unknown error occurred:', (error as Error).message);
    }
  }
};