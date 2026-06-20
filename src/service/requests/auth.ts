"use client";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { refreshAccessToken } from "../auth-session";
import { apiClient } from "../api-client";
import {
  clearSession,
  setSession,
} from "../storage";

export type User = {
  id: string;
  name: string;
  email: string;
  // extend with other fields if available
};

export default function useAuth() {
  const router = useRouter();
  const [isLoading, setisLoading] = useState(false);

  /**
   * 🔹 Google login handler
   */
  const loginWithGoogle = useCallback(async (code: string) => {
    try {
      setisLoading(true);
      const { data } = await apiClient.post("/auth/google-signin-web", {
        code: code,
      });
      setSession({
        accessToken: data?.accessToken,
        refreshToken: data?.refreshToken,
        user: data?.user,
      });

      return data?.user;
    } catch (error) {
      console.error(error);
    } finally {
      setisLoading(false);
    }
  }, []);

  const loginTma = useCallback(async (initData: any) => {
    try {
      setisLoading(true);
      const { data } = await apiClient.post("/auth/tma-login", {
        initData: initData,
      });
      setSession({
        accessToken: data?.accessToken,
        refreshToken: data?.refreshToken,
        user: data?.user,
      });
      return data?.user;
    } catch (error) {
      console.error(error);
    } finally {
      setisLoading(false);
    }
  }, []);

  /**
   * 🔹 Normal email/password login handler
   */
  const loginUser = async (data: { identifier: string; password: string }) => {
    try {
      setisLoading(true);
      const { data: res } = await apiClient.post("/auth/login", data);
      setSession({
        accessToken: res?.accessToken,
        refreshToken: res?.refreshToken,
        user: res?.user,
      });

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
    } finally {
      setisLoading(false);
    }
  };

  /**
   * 🔹 Logout handler
   */
  const logout = useCallback(() => {
    clearSession();

    router.push("/app/login"); // Navigate to login page
  }, [router]);

  /**
   * 🔹 Token refresh handler
   */
  const refreshTokens = useCallback(async (): Promise<boolean> => {
    try {
      setisLoading(true);
      const nextAccessToken = await refreshAccessToken();
      if (nextAccessToken) {
        return true;
      }

      router.push("/app/login");
      return false;
    } finally {
      setisLoading(false);
    }
  }, [router]);

  return {
    loginWithGoogle,
    loginTma,
    loginUser,
    logout,
    refreshTokens,
    isLoading,
  };
}
