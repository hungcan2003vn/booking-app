// src/api/loginApi.ts
import axios from "axios";

export const loginApi = async (identifier: string, password: string) => {
  try {
    const response = await axios.post(
      "https://jellyfish-app-43090-zm6h3.ondigitalocean.app/api/auth/local",
      {
        identifier,
        password,
      },
    );
    return response.data;
  } catch (error) {
    console.error("Login API error:", error);
    throw error;
  }
};




