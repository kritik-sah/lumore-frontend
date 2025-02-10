import {
  checkUsernameAvailability,
  loginUser,
  setNewPassword,
  signupUser,
} from "@/lib/apis";
import { useMutation, useQuery } from "@tanstack/react-query";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

export const useSignup = () => {
  return useMutation({
    mutationFn: signupUser,
    onSuccess: (data) => {
      Cookies.set("token", data.token, { expires: 7 }); // Store token in cookies for 7 days
      Cookies.set("user", JSON.stringify(data), { expires: 7 }); // Store user data
    },
    onError: (error) => {
      console.error("Signup failed:", error);
    },
  });
};

export const useCheckUsername = (username: string) => {
  return useQuery({
    queryKey: ["check-username", username], // Cache based on username
    queryFn: () => checkUsernameAvailability(username),
    enabled: !!username, // Only run query when username is non-empty
  });
};

export const useLogin = () => {
  return useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      Cookies.set("token", data.token, { expires: 7 }); // Store token in cookies for 7 days
      Cookies.set("user", JSON.stringify(data), { expires: 7 }); // Store user data
    },
    onError: (error) => {
      console.error("Login failed:", error);
    },
  });
};

export const useSetNewPassword = () => {
  return useMutation({
    mutationFn: setNewPassword,
    onSuccess: (data) => {
      console.log("Set new password successfully:", data);
    },
    onError: (error) => {
      console.error("Set new password failed:", error);
    },
  });
};

export const useLogout = () => {
  const router = useRouter();
  const logout = () => {
    Cookies.remove("token");
    Cookies.remove("user");
    router.push("/app/login");
  };
  return { logout };
};
