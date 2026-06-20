import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { refreshAccessToken } from "./auth-session";
import { clearSession, getAccessToken, getRefreshToken } from "./storage";

export const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
// Create an axios instance
export const apiClient = axios.create({
  baseURL: BASE_URL,
});

type RetryableRequestConfig = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

const isRefreshRequest = (url?: string) => Boolean(url?.includes("/auth/refresh-token"));

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
    const originalRequest = error.config as RetryableRequestConfig | undefined;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      typeof window !== "undefined" &&
      !originalRequest._retry &&
      !isRefreshRequest(originalRequest.url)
    ) {
      const refreshToken = getRefreshToken();
      if (!refreshToken) {
        clearSession();
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      const nextAccessToken = await refreshAccessToken();
      if (!nextAccessToken) {
        return Promise.reject(error);
      }

      originalRequest.headers.Authorization = `Bearer ${nextAccessToken}`;
      return apiClient(originalRequest);
    }

    return Promise.reject(error);
  }
);
