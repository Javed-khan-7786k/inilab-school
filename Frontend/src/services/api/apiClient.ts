import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
// console.log("API_BASE_URL:", API_BASE_URL); // Log the API base URL for debugging
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor to add JWT token from sessionStorage to the Authorization header
apiClient.interceptors.request.use(
  (config) => {
    const token = sessionStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor to handle common responses and errors
apiClient.interceptors.response.use(
  (response) => {
    // If response format has { success, message, data }, return the whole payload
    return response;
  },
  (error) => {
    // Standardize error messaging
    const message = error.response?.data?.message || "An unexpected error occurred.";
    console.error("API error status:", error.response?.status, message);
    return Promise.reject(new Error(message));
  }
);

export default apiClient;
