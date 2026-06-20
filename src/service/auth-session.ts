import axios from "axios";
import {
  clearSession,
  getAccessToken,
  getRefreshToken,
  getUser,
  setAccessToken,
} from "./storage";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

type JwtPayload = {
  exp?: number;
};

let refreshRequest: Promise<string | null> | null = null;

const decodeJwtPayload = (token: string): JwtPayload | null => {
  try {
    const payloadSegment = token.split(".")[1];
    if (!payloadSegment || typeof atob !== "function") return null;

    const base64 = payloadSegment.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
    const decoded = atob(padded);

    return JSON.parse(decoded) as JwtPayload;
  } catch {
    return null;
  }
};

export const isTokenExpired = (
  token: string | null | undefined,
  skewSeconds = 30,
) => {
  if (!token) return true;

  const payload = decodeJwtPayload(token);
  if (!payload?.exp) return false;

  const nowInSeconds = Math.floor(Date.now() / 1000);
  return payload.exp <= nowInSeconds + skewSeconds;
};

export const shouldRestoreSession = () => {
  const refreshToken = getRefreshToken();
  const user = getUser();

  if (!refreshToken || !user?._id) {
    return false;
  }

  const accessToken = getAccessToken();
  return !accessToken || isTokenExpired(accessToken);
};

export const refreshAccessToken = async (): Promise<string | null> => {
  if (refreshRequest) {
    return refreshRequest;
  }

  refreshRequest = (async () => {
    const refreshToken = getRefreshToken();
    if (!refreshToken || !BASE_URL) {
      clearSession();
      return null;
    }

    try {
      const { data } = await axios.post(`${BASE_URL}/auth/refresh-token`, {
        refreshToken,
      });
      const nextAccessToken =
        typeof data?.accessToken === "string" ? data.accessToken : null;

      if (!nextAccessToken) {
        throw new Error("Invalid refresh response");
      }

      setAccessToken(nextAccessToken);
      return nextAccessToken;
    } catch (error) {
      console.error("Token refresh failed", error);
      clearSession();
      return null;
    } finally {
      refreshRequest = null;
    }
  })();

  return refreshRequest;
};

export const bootstrapAuthSession = async () => {
  const accessToken = getAccessToken();
  const refreshToken = getRefreshToken();
  const user = getUser();

  if (!user?._id) {
    return false;
  }

  if (accessToken && !isTokenExpired(accessToken)) {
    return true;
  }

  if (!refreshToken) {
    clearSession();
    return false;
  }

  const nextAccessToken = await refreshAccessToken();
  return Boolean(nextAccessToken && getUser()?._id);
};
