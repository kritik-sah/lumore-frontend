"use client";

import { getAccessToken, getIsOnboarded, getUser } from "@/service/storage";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

/**
 * Custom hook to manage onboarding state and routing.
 *
 * @returns {Object} - Contains user, token, isOnboarded, and loading state.
 */
export const useOnboarding = () => {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isOnboarded, setIsOnboarded] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = getUser();
    const storedToken = getAccessToken();

    setUser(storedUser);
    setToken(storedToken);

    if (storedUser && storedToken) {
      const onboarded = getIsOnboarded(storedUser._id);

      if (!onboarded) {
        router.replace("/app/onboarding");
      }
    }

    setLoading(false);
  }, [router]);

  return { user, token, isOnboarded, loading };
};
