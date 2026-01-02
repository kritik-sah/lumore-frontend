import { apiClient } from "@/service/api-client";
import { getUser } from "@/service/storage";
import axios from "axios";
import Cookies from "js-cookie";

/* -------------------------------------------------------------------------- */
/*                              External API Call                             */
/* -------------------------------------------------------------------------- */
export const getFormattedAddress = async (lat: number, lng: number) => {
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`;
  const response = await axios.get(url, {
    headers: { "User-Agent": "Lumore/1.0" }, // Required by OSM
  });
  return response.data.display_name || null;
};

/* -------------------------------------------------------------------------- */
/*                               Auth & Profile                               */
/* -------------------------------------------------------------------------- */
// export const signupUser = async (data: {
//   username: string;
//   email: string;
//   password: string;
//   location: {
//     type: string;
//     coordinates: number[];
//     formattedAddress: string;
//   };
// }) => {
//   const response = await apiClient.post("/auth/signup", data);
//   return response.data;
// };

export const setNewPassword = async (data: { newPassword: string }) => {
  const response = await apiClient.post("/auth/set-password", data);
  return response.data;
};

export const checkUsernameAvailability = async (username: string) => {
  const response = await apiClient.get(`/auth/check-username/${username}`);
  return response.data.isUnique;
};

export const updateUserData = async (data: any) => {
  const { _id: userId } = getUser();
  const response = await apiClient.patch(`/profile/${userId}`, data);
  return response.data;
};
export const updateUserLocation = async (data: any) => {
  const { _id: userId } = getUser();
  const response = await apiClient.post(
    `/profile/${userId}/update-location`,
    data
  );
  return response.data;
};
export const findNearbyUsers = async () => {
  const { _id: userId } = getUser();
  const response = await apiClient.get(`/profile/${userId}/nearby`);
  return response.data;
};

export const updateFieldVisibility = async (
  userId: string,
  field: string,
  visibility: string
) => {
  const response = await apiClient.patch(`/profile/${userId}/visibility`, {
    fields: { [field]: visibility },
  });
  return response.data;
};

export const updateUserPreferences = async (data: any) => {
  const { _id: userId } = getUser();
  const response = await apiClient.patch(
    `/profile/${userId}/preferences`,
    data
  );
  return response.data;
};

/* -------------------------------------------------------------------------- */
/*                                   Slots                                    */
/* -------------------------------------------------------------------------- */
export const fetchUserSlots = async () => {
  const response = await apiClient.get("/slots");
  return response.data.data.slots;
};

export const createSlot = async () => {
  const response = await apiClient.post("/slots", {});
  return response.data.data.slot;
};

export const updateSlot = async (
  slotId: string,
  data: { profile?: string; roomId?: string }
) => {
  const response = await apiClient.patch(`/slots/${slotId}`, data);
  return response.data.data.slot;
};
/* -------------------------------------------------------------------------- */
/*                                   Inbox                                    */
/* -------------------------------------------------------------------------- */
export const fetchIbox = async () => {
  const response = await apiClient.get("/inbox");
  return response.data;
};
export const fetchRoomData = async (roomId: string) => {
  const response = await apiClient.get(`/inbox/${roomId}`);
  return response.data;
};

/* -------------------------------------------------------------------------- */
/*                               Account Actions                              */
/* -------------------------------------------------------------------------- */
export const deleteAccount = async () => {
  const { _id: userId } = getUser();
  const response = await apiClient.delete(`/profile/${userId}`);
  return response.data;
};

/* -------------------------------------------------------------------------- */
/*                               File Upload                                  */
/* -------------------------------------------------------------------------- */
export interface UploadResponse {
  message: string;
  profilePicture: string;
}

export const uploadProfilePicture = async (
  file: File
): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append("profilePic", file);

  const { _id: userId } = getUser();

  const res = await apiClient.patch<UploadResponse>(
    `/profile/${userId}/update-profile-picture`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );

  return res.data;
};

/* -------------------------------------------------------------------------- */
/*                                  Messages                                  */
/* -------------------------------------------------------------------------- */
export const fetchRoomChat = async (roomId: string) => {
  const response = await apiClient.get(`/messages/${roomId}`);
  return response.data;
};

/* -------------------------------------------------------------------------- */
/*                                  App Status                                */
/* -------------------------------------------------------------------------- */
export const fetchAppStatus = async () => {
  const response = await apiClient.get(`/status/app-status`);
  return response.data;
};

/* -------------------------------------------------------------------------- */
/*                           Push Notification                                */
/* -------------------------------------------------------------------------- */
export const subscribePushService = async (subscription: PushSubscription) => {
  console.log("subscribePushService", subscription);
  const response = await apiClient.post(`/push/subscribe`, {
    subscription: JSON.parse(JSON.stringify(subscription)),
  });
  return response.data;
};
export const unsubscribePushService = async (endpoint: string) => {
  const response = await apiClient.post(`/push/unsubscribe`, {
    endpoint,
  });
  return response.data;
};
