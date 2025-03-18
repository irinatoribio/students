import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor - Attach Token to Requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Retrieve token from storage
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor - Handle Expired Token (401 Errors)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      console.log("Unauthorized! Logging out...");
      localStorage.removeItem("access_token"); // Clear token from storage
      window.location.href = "/login"; // Redirect to login page
    }
    return Promise.reject(error);
  }
);
export default api;
