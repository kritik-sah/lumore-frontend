import Cookies from "js-cookie";

interface UserCookie {
  sessionCookie: string | undefined;
  userCookie: any | undefined;
}

export const getCookies = (): UserCookie => {
  const sessionCookie = Cookies.get("token");
  const userStr = Cookies.get("user");
  const userCookie = userStr ? JSON.parse(userStr) : undefined;

  return {
    sessionCookie,
    userCookie,
  };
};

export const useCookies = () => {
  const { sessionCookie, userCookie } = getCookies();

  const clearCookies = () => {
    Cookies.remove("token");
    Cookies.remove("user");
  };

  return {
    sessionCookie,
    userCookie,
    getCookies,
    clearCookies,
  };
};
