import { apiClient } from "@/service/api-client";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export interface UserPreferences {
  interestedIn: string;
  ageRange: number[];
  distance: number;
  goal: {
    primary: string;
    secondary: string;
    tertiary: string;
  };
  interests: string[];
  relationshipType: string;
  preferredLanguages: string[];
  zodiacPreference: string[];
  institutions: string[];
  personalityTypePreference: string[];
  dietPreference: string[];
}

const fetchUserPrefrence = async (userId: string) => {
  const { data } = await apiClient.get(`/profile/${userId}/preferences`);
  return data as UserPreferences;
};

export const useUserPrefrence = (userId: string) => {
  const {
    data: userPrefrence,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["user-profile", userId],
    queryFn: () => fetchUserPrefrence(userId),
  });

  return {
    userPrefrence,
    isLoading,
    error,
  };
};
