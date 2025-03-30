import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from "axios";
import { useAuthStore } from "../store/authStore";

// Define the base URL
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// Create the API client instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const token = useAuthStore.getState().token;

    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    // Log the error for debugging
    console.error('API Error:', error.response?.status, error.response?.data);

    // Check if it's a 401 error and not already retrying
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      useAuthStore.getState().refreshTokenValue
    ) {
      originalRequest._retry = true;

      try {
        // Attempt to refresh the token
        await useAuthStore.getState().refreshToken();

        // Get new token and retry the request
        const token = useAuthStore.getState().token;
        if (token && originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${token}`;
        }

        return apiClient(originalRequest);
      } catch (refreshError) {
        // If refresh fails, force logout and redirect to login
        useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }

    // Create a more descriptive error
    const errorMessage =
      error.response?.data?.message ||
      error.response?.statusText ||
      error.message ||
      'Unknown error occurred';

    if (error.response) {
      error.message = `Server Error (${error.response.status}): ${errorMessage}`;
    } else if (error.request) {
      error.message = `No response from server: ${error.message}`;
    } else {
      error.message = `Request Error: ${error.message}`;
    }

    return Promise.reject(error);
  }
);

export default apiClient;
