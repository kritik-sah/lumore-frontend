import { apiClient } from "@/service/api-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

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
  preferences?: {
    interestedIn: string;
    ageRange: { min: number; max: number };
    distance: number;
    goal: {
      primary: string;
      secondary: string;
      tertiary: string;
    };
    interests: {
      professional: string[];
      hobbies: string[];
    };
    relationshipType: string;
    preferredLanguages: string[];
    zodiacPreference: string[];
    institutions: string[];
    personalityTypePreference: string[];
    dietPreference: string[];
    heightRange: number[];
    religionPreference: string[];
    drinkingPreference: string[];
    smokingPreference: string[];
    petPreference: string[];
    locationPreferences: {
      homeTown: string[];
      currentLocation: string[];
    };
  };
}

const fetchUser = async (userId: string) => {
  const { data } = await apiClient.get(`/profile/${userId}`);

  return data;
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
  const response = await apiClient.patch(`/profile/${userId}`, {
    [field]: value,
  });
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
  const response = await apiClient.patch(`/profile/${userId}/visibility`, {
    fields: { [field]: visibility },
  });
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
