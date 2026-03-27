import Cookies from "js-cookie";

const ACCESS_TOKEN_KEY = "accessToken";
const LEGACY_ACCESS_TOKEN_KEY = "token";
const REFRESH_TOKEN_KEY = "refreshToken";
const USER_KEY = "user";

const ACCESS_TOKEN_COOKIE_DAYS = 1;
const REFRESH_TOKEN_COOKIE_DAYS = 30;
const USER_COOKIE_DAYS = 30;

const COOKIE_OPTIONS = {
  path: "/",
  sameSite: "lax" as const,
};

export const AUTH_ACCESS_TOKEN_EVENT = "lumore:auth-access-token";

const isBrowser = () => typeof window !== "undefined";

const setCookie = (key: string, value: string, expires: number) => {
  Cookies.set(key, value, {
    ...COOKIE_OPTIONS,
    expires,
  });
};

const removeCookie = (key: string) => {
  Cookies.remove(key, COOKIE_OPTIONS);
};

const normalizeTokenValue = (
  value: string | null | undefined,
): string | null => {
  if (!value) return null;

  const trimmed = value.trim();
  if (!trimmed) return null;

  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    try {
      const parsed = JSON.parse(trimmed);
      if (typeof parsed === "string" && parsed.trim()) {
        return parsed.trim();
      }
    } catch {
      return trimmed.slice(1, -1).trim() || null;
    }
  }

  return trimmed;
};

const parseStoredUser = (value: string | null | undefined) => {
  if (!value) return null;

  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

const broadcastAccessToken = (token: string | null) => {
  if (!isBrowser()) return;

  window.dispatchEvent(
    new CustomEvent(AUTH_ACCESS_TOKEN_EVENT, {
      detail: { token },
    }),
  );
};

const persistToken = (
  key: string,
  token: string,
  expires: number,
  legacyKey?: string,
) => {
  if (!isBrowser()) return;

  localStorage.setItem(key, token);
  setCookie(key, token, expires);

  if (legacyKey) {
    localStorage.removeItem(legacyKey);
    removeCookie(legacyKey);
  }
};

const readToken = (key: string, expires: number, legacyKey?: string) => {
  if (!isBrowser()) return null;

  const storedToken = normalizeTokenValue(
    localStorage.getItem(key) || (legacyKey ? localStorage.getItem(legacyKey) : null),
  );
  const cookieToken = normalizeTokenValue(
    Cookies.get(key) || (legacyKey ? Cookies.get(legacyKey) : null),
  );
  const token = storedToken || cookieToken;

  if (!token) return null;

  persistToken(key, token, expires, legacyKey);
  return token;
};

const persistUser = (user: object) => {
  if (!isBrowser()) return;

  const serializedUser = JSON.stringify(user);
  localStorage.setItem(USER_KEY, serializedUser);
  setCookie(USER_KEY, serializedUser, USER_COOKIE_DAYS);
};

const readUser = () => {
  if (!isBrowser()) return null;

  const storedUser =
    parseStoredUser(localStorage.getItem(USER_KEY)) ||
    parseStoredUser(Cookies.get(USER_KEY));

  if (!storedUser) return null;

  persistUser(storedUser);
  return storedUser;
};

export const setAccessToken = (token: string) => {
  const normalizedToken = normalizeTokenValue(token);
  if (!isBrowser() || !normalizedToken) return;

  persistToken(
    ACCESS_TOKEN_KEY,
    normalizedToken,
    ACCESS_TOKEN_COOKIE_DAYS,
    LEGACY_ACCESS_TOKEN_KEY,
  );
  broadcastAccessToken(normalizedToken);
};

export const getAccessToken = (): string | null =>
  readToken(
    ACCESS_TOKEN_KEY,
    ACCESS_TOKEN_COOKIE_DAYS,
    LEGACY_ACCESS_TOKEN_KEY,
  );

export const removeAccessToken = () => {
  if (!isBrowser()) return;

  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(LEGACY_ACCESS_TOKEN_KEY);
  removeCookie(ACCESS_TOKEN_KEY);
  removeCookie(LEGACY_ACCESS_TOKEN_KEY);
  broadcastAccessToken(null);
};

export const setRefreshToken = (token: string) => {
  const normalizedToken = normalizeTokenValue(token);
  if (!isBrowser() || !normalizedToken) return;

  persistToken(REFRESH_TOKEN_KEY, normalizedToken, REFRESH_TOKEN_COOKIE_DAYS);
};

export const getRefreshToken = (): string | null =>
  readToken(REFRESH_TOKEN_KEY, REFRESH_TOKEN_COOKIE_DAYS);

export const removeRefreshToken = () => {
  if (!isBrowser()) return;

  localStorage.removeItem(REFRESH_TOKEN_KEY);
  removeCookie(REFRESH_TOKEN_KEY);
};

export const setUser = (user: object) => {
  if (!isBrowser()) return;

  persistUser(user);
};

export const getUser = (): any | null => {
  if (!isBrowser()) return null;

  return readUser() || {};
};

export const removeUser = () => {
  if (!isBrowser()) return;

  localStorage.removeItem(USER_KEY);
  removeCookie(USER_KEY);
};

export const setSession = ({
  accessToken,
  refreshToken,
  user,
}: {
  accessToken?: string;
  refreshToken?: string;
  user?: object;
}) => {
  if (accessToken) setAccessToken(accessToken);
  if (refreshToken) setRefreshToken(refreshToken);
  if (user) setUser(user);
};

export const clearSession = () => {
  removeAccessToken();
  removeRefreshToken();
  removeUser();
};

export const setIsOnboarded = (userId: string, isOnboarded: boolean) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(`isOnboarded-${userId}`, isOnboarded.toString());
  }
};

export const getIsOnboarded = (userId: string): boolean | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(`isOnboarded-${userId}`) ? true : false;
  }
  return null;
};

const PENDING_REFERRAL_CODE_KEY = "pendingReferralCode";

export const setPendingReferralCode = (code: string) => {
  if (typeof window !== "undefined") {
    const normalized = String(code || "").trim();
    if (!normalized) return;
    localStorage.setItem(PENDING_REFERRAL_CODE_KEY, normalized);
  }
};

export const getPendingReferralCode = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem(PENDING_REFERRAL_CODE_KEY);
  }
  return null;
};

export const removePendingReferralCode = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(PENDING_REFERRAL_CODE_KEY);
  }
};
