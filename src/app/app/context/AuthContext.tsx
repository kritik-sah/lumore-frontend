"use client";
import Cookies from "js-cookie";
import { createContext, useContext, useEffect, useState } from "react";

interface User {
  _id: string;
  username: string;
  email: string;
  // Add other user fields as needed
}

interface AuthContextType {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
  isLoading: true,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("AuthContext: Initializing...");
    const initializeAuth = () => {
      try {
        const storedUser = Cookies.get("user");
        console.log(
          "AuthContext: Found stored user:",
          storedUser ? "yes" : "no"
        );

        if (storedUser) {
          const userData = JSON.parse(storedUser);
          console.log("AuthContext: Setting user:", userData._id);
          setUser(userData);
        } else {
          console.log("AuthContext: No user found in cookies");
          setUser(null);
        }
      } catch (error) {
        console.error("AuthContext: Error parsing user data:", error);
        Cookies.remove("user");
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = (userData: User) => {
    console.log("AuthContext: Logging in user:", userData._id);
    setUser(userData);
    Cookies.set("user", JSON.stringify(userData), { expires: 7 });
  };

  const logout = () => {
    console.log("AuthContext: Logging out user");
    setUser(null);
    Cookies.remove("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
