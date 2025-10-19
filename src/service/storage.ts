// /storage.ts
export const setAccessToken = (token: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("accessToken", token);
  }
};

export const getAccessToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("accessToken");
  }
  return null;
};

export const removeAccessToken = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("accessToken");
  }
};

export const setRefreshToken = (token: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("refreshToken", token);
  }
};

export const getRefreshToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("refreshToken");
  }
  return null;
};

export const removeRefreshToken = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("refreshToken");
  }
};

export const setUser = (user: object) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("user", JSON.stringify(user));
  }
};

export const getUser = (): any | null => {
  if (typeof window !== "undefined") {
    return JSON.parse(localStorage.getItem("user") || "{}");
  }
  return null;
};

export const removeUser = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("user");
  }
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
