import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { getAccessToken, getRefreshToken, setAccessToken } from "./storage";

export const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
// Create an axios instance
export const apiClient = axios.create({
  baseURL: BASE_URL,
});

// 🔹 Request interceptor – attach access token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== "undefined") {
      const token = getAccessToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// 🔹 Response interceptor – handle token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;

    // Check if the error is due to an expired token
    if (
      error.response?.status === 403 &&
      originalRequest &&
      typeof window !== "undefined"
    ) {
      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        return Promise.reject(error);
      }

      try {
        const { data } = await axios.post(`${BASE_URL}/auth/refresh-token`, {
          refreshToken,
        });

        // Save new token and retry the original request
        setAccessToken(data.accessToken);
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);
