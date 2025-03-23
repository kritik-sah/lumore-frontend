import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Cookies from "js-cookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface User {
  _id: string;
  username: string;
  visibleName: string;
  hiddenName: string;
  bio: string;
  gender: string;
  dob: string;
  sexualOrientation: string;
  height: number;
  currentLocation: string;
  diet: string;
  zodiacSign: string;
  lifestyle: {
    alcohol: string;
    smoking: string;
    pets: string;
  };
  work: {
    title: string;
    company: string;
  };
  education: {
    degree: string;
    institution: string;
  };
  maritalStatus: string;
  languages: string[];
  personalityType: string;
  fieldVisibility: Record<string, string>;
}

const fetchUser = async (userId: string) => {
  const token = Cookies.get("token");
  const response = await axios.get(`${API_URL}/profile/${userId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

const updateUserField = async ({
  userId,
  field,
  value,
}: {
  userId: string;
  field: string;
  value: any;
}) => {
  const token = Cookies.get("token");
  const response = await axios.patch(
    `${API_URL}/profile/${userId}`,
    { [field]: value },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

const updateFieldVisibility = async ({
  userId,
  field,
  visibility,
}: {
  userId: string;
  field: string;
  visibility: string;
}) => {
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

export const useUser = (userId: string) => {
  const queryClient = useQueryClient();

  const {
    data: user,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => fetchUser(userId),
  });

  const updateFieldMutation = useMutation({
    mutationFn: ({ field, value }: { field: string; value: any }) =>
      updateUserField({ userId, field, value }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", userId] });
    },
  });

  const updateVisibilityMutation = useMutation({
    mutationFn: ({
      field,
      visibility,
    }: {
      field: string;
      visibility: string;
    }) => updateFieldVisibility({ userId, field, visibility }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", userId] });
    },
  });

  return {
    user,
    isLoading,
    error,
    updateField: updateFieldMutation.mutate,
    updateVisibility: updateVisibilityMutation.mutate,
    isUpdating:
      updateFieldMutation.isPending || updateVisibilityMutation.isPending,
  };
};
