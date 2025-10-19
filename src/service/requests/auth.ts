"use client";
import axios from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { apiClient, BASE_URL } from "../api-client";
import {
  getRefreshToken,
  removeAccessToken,
  removeRefreshToken,
  removeUser,
  setAccessToken,
  setRefreshToken,
  setUser,
} from "../storage";

export type User = {
  id: string;
  name: string;
  email: string;
  // extend with other fields if available
};

export default function useAuth() {
  const router = useRouter();

  /**
   * 🔹 Google login handler
   */
  const loginWithGoogle = useCallback(async (code: string): Promise<User> => {
    const { data } = await apiClient.post("/auth/google-signin-web", {
      code: code,
    });

    if (data?.accessToken) {
      setAccessToken(data.accessToken);
      Cookies.set("accessToken", JSON.stringify(data.accessToken), {
        expires: 1,
      });
    }
    if (data?.refreshToken) {
      setRefreshToken(data.refreshToken);
      Cookies.set("refreshToken", JSON.stringify(data.refreshToken), {
        expires: 10,
      });
    }
    if (data?.user) {
      setUser(data.user);
      Cookies.set("user", JSON.stringify(data?.user), { expires: 30 });
    }

    return data?.user;
  }, []);

  /**
   * 🔹 Normal email/password login handler
   */
  const loginUser = async (data: { identifier: string; password: string }) => {
    try {
      const { data: res } = await apiClient.post("/auth/login", data);

      if (res?.accessToken) {
        setAccessToken(res.accessToken);
        Cookies.set("accessToken", JSON.stringify(res.accessToken), {
          expires: 1,
        });
      }
      if (res?.refreshToken) {
        setRefreshToken(res.refreshToken);
        Cookies.set("refreshToken", JSON.stringify(res.refreshToken), {
          expires: 10,
        });
      }
      if (res?.user) {
        setUser(res.user);
        Cookies.set("user", JSON.stringify(res?.user), { expires: 30 });
      }

      return res?.user;
    } catch (error: any) {
      if (error.response) {
        throw new Error(error.response.data.message || "Login failed");
      } else if (error.request) {
        throw new Error(
          "No response from server. Please check your connection."
        );
      } else {
        throw new Error("Error setting up the request");
      }
    }
  };

  /**
   * 🔹 Logout handler
   */
  const logout = useCallback(() => {
    removeAccessToken();
    removeRefreshToken();
    removeUser();
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    Cookies.remove("user");

    router.push("/app/login"); // Navigate to login page
  }, [router]);

  /**
   * 🔹 Token refresh handler
   */
  const refreshTokens = useCallback(async (): Promise<boolean> => {
    try {
      const refreshToken = getRefreshToken();
      if (!refreshToken) throw new Error("No refresh token found");

      const { data } = await axios.post(`${BASE_URL}/auth/refresh-token`, {
        refreshToken,
      });

      if (data?.accessToken) {
        setAccessToken(data.accessToken);
        return true;
      } else {
        throw new Error("Invalid refresh response");
      }
    } catch (error) {
      console.error("Token refresh failed", error);
      logout();
      return false;
    }
  }, [logout]);

  return {
    loginWithGoogle,
    loginUser,
    logout,
    refreshTokens,
  };
}
