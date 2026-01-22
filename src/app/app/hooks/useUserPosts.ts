import { apiClient } from "@/service/api-client";
import { useQuery, useQueryClient } from "@tanstack/react-query";

const fetchUserPosts = async (userId: string) => {
  const { data } = await apiClient.get(`/post/${userId}`);
  return data;
};

export const useUserPosts = (userId: string) => {
  const {
    data: posts,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["user posts", userId],
    queryFn: () => fetchUserPosts(userId),
  });

  return {
    posts,
    isLoading,
    error,
  };
};
