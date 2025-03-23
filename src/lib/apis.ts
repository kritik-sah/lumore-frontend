import axios from "axios";
import Cookies from "js-cookie";
const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const signupUser = async (data: {
  username: string;
  password: string;
}) => {
  const response = await axios.post(`${API_URL}/auth/signup`, data);
  return response.data; // Returns { _id, username, email, token }
};

export const loginUser = async (data: {
  identifier: string;
  password: string;
}) => {
  const response = await axios.post(`${API_URL}/auth/login`, data);
  return response.data; // Returns { _id, username, email, token }
};

export const setNewPassword = async (data: { newPassword: string }) => {
  const token = Cookies.get("token");
  const response = await axios.post(`${API_URL}/auth/set-password`, data, {
    headers: {
      Authorization: `Bearer ${token}`, // Pass token in Authorization header
    },
  });
  return response.data; // Returns { _id, username, email, token }
};

export const checkUsernameAvailability = async (username: string) => {
  const response = await axios.get(
    `${API_URL}/auth/check-username/${username}`
  );
  return response.data.isUnique; // Returns true or false
};

export const updateUserData = async (data: any) => {
  const token = Cookies.get("token");
  const { _id: userId } = JSON.parse(Cookies.get("user") || "");

  const response = await axios.patch(`${API_URL}/profile/${userId}`, data, {
    headers: {
      Authorization: `Bearer ${token}`, // Pass token in Authorization header
    },
  });
  return response.data;
};

export const updateFieldVisibility = async (
  userId: string,
  field: string,
  visibility: string
) => {
  const token = Cookies.get("token");
  const response = await axios.patch(
    `${API_URL}/profile/${userId}/visibility`,
    { fields: { [field]: visibility } },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};
