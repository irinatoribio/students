// login.js (API file)
import axios from "axios";

export const login = async (payload) => {
  try {
    const response = await axios.post(
      "http://localhost:8000/api/login",
      payload
    );
    return response;
  } catch (error) {
    throw error;
  }
};
