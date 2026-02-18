"use client";

import { applyReferralCode, fetchReferralSummary } from "@/lib/apis";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useReferralSummary = (enabled = true) =>
  useQuery({
    queryKey: ["referral", "summary"],
    queryFn: fetchReferralSummary,
    enabled,
  });

export const useApplyReferralCode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (code: string) => applyReferralCode(code),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["referral", "summary"] });
      queryClient.invalidateQueries({ queryKey: ["credits", "balance"] });
      queryClient.invalidateQueries({ queryKey: ["credits", "history"] });
    },
  });
};
