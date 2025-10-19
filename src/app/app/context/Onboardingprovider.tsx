"use client";

import React, { createContext, useContext } from "react";
import { useOnboarding } from "../hooks/useOnboarding";

interface OnboardingContextValue {
  user: any;
  token: string | null;
  isOnboarded: boolean;
  loading: boolean;
}

const OnboardingContext = createContext<OnboardingContextValue | undefined>(
  undefined
);

/**
 * Provides onboarding state throughout the app.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - The components wrapped by the provider.
 */
export const OnboardingProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const onboarding = useOnboarding();

  return (
    <OnboardingContext.Provider value={onboarding}>
      {children}
    </OnboardingContext.Provider>
  );
};

/**
 * Hook to consume onboarding context safely.
 *
 * @returns {OnboardingContextValue}
 */
export const useOnboardingContext = (): OnboardingContextValue => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error(
      "useOnboardingContext must be used within an OnboardingProvider"
    );
  }
  return context;
};
