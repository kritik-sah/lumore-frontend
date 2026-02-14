"use client";

import {
  claimDailyCredits,
  fetchCreditsBalance,
  fetchCreditsHistory,
} from "@/lib/apis";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useCreditsBalance = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["credits", "balance"],
    queryFn: fetchCreditsBalance,
  });

  const claimMutation = useMutation({
    mutationFn: claimDailyCredits,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["credits", "balance"] });
      queryClient.invalidateQueries({ queryKey: ["credits", "history"] });
    },
  });

  return {
    ...query,
    claimDaily: claimMutation.mutateAsync,
    isClaiming: claimMutation.isPending,
  };
};

export const useCreditsHistory = (page = 1, limit = 20) =>
  useQuery({
    queryKey: ["credits", "history", page, limit],
    queryFn: () => fetchCreditsHistory({ page, limit }),
  });

