"use client";

import { useUser } from "@/app/app/hooks/useUser";
import { useUserPrefrence } from "@/app/app/hooks/useUserPrefrence";
import { Button } from "@/components/ui/button";
import { updateUserData, updateUserPreferences } from "@/lib/apis";
import { isUiSimplificationEnabled } from "@/lib/feature-flags";
import { trackAnalytic } from "@/service/analytics";
import { getUser, setIsOnboarded } from "@/service/storage";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  legacyOnboardingScreens,
  onboardingScreens,
} from "./onboarding/config";
import {
  buildOnboardingPayload,
  getInitialValuesForScreen,
  validateScreen,
} from "./onboarding/helpers";
import OnboardingFieldRenderer from "./onboarding/OnboardingFieldRenderer";
import type { Screen } from "./onboarding/types";

const Onboarding = ({
  screens = isUiSimplificationEnabled()
    ? onboardingScreens
    : legacyOnboardingScreens,
}: {
  screens?: Screen[];
}) => {
  const currentUser = getUser();
  const userId = currentUser?._id;
  const { user } = useUser(userId);
  const { userPrefrence } = useUserPrefrence(userId);
  const [screenIndex, setScreenIndex] = useState(0);
  const [formValues, setFormValues] = useState<Record<string, unknown>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const queryClient = useQueryClient();
  const router = useRouter();
  const trackedStartRef = useRef(false);
  const isSimplifiedOnboarding = isUiSimplificationEnabled();

  const currentScreen = screens[screenIndex];
  const totalScreens = screens.length;
  const progress = ((screenIndex + 1) / totalScreens) * 100;

  useEffect(() => {
    if (!currentScreen) return;

    const values = getInitialValuesForScreen(
      currentScreen,
      user,
      userPrefrence,
    );

    setFormValues(values);
  }, [currentScreen, user, userPrefrence]);

  useEffect(() => {
    if (trackedStartRef.current) return;
    trackedStartRef.current = true;
    trackAnalytic({
      activity: "onboarding_started",
      label: isSimplifiedOnboarding ? "simplified" : "legacy",
      category: "ui-simplification",
    });
  }, [isSimplifiedOnboarding]);

  const handleInputChange = (name: string, value: unknown) =>
    setFormValues((prev) => ({ ...prev, [name]: value }));

  const screenErrors = useMemo(
    () => validateScreen(currentScreen, formValues),
    [currentScreen, formValues],
  );

  const submitOnboardingData = async () => {
    const { userData, userPreferenceData } = buildOnboardingPayload(
      currentScreen,
      formValues,
    );

    if (Object.keys(userData).length) {
      await updateUserData(userData);
    }

    if (Object.keys(userPreferenceData).length) {
      await updateUserPreferences(userPreferenceData);
    }
  };

  const handleNext = async () => {
    if (Object.keys(screenErrors).length > 0) {
      setErrors(screenErrors);
      return;
    }

    setErrors({});
    try {
      await submitOnboardingData();
    } catch {
      return;
    }

    trackAnalytic({
      activity: "onboarding_step_completed",
      label: currentScreen.id || `step-${screenIndex + 1}`,
      category: "ui-simplification",
      value: screenIndex + 1,
    });

    if (screenIndex < totalScreens - 1) {
      setScreenIndex((prev) => prev + 1);
      return;
    }

    if (userId) {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["user", userId] }),
        queryClient.invalidateQueries({ queryKey: ["user-profile", userId] }),
        queryClient.refetchQueries({ queryKey: ["user", userId], type: "all" }),
        queryClient.refetchQueries({
          queryKey: ["user-profile", userId],
          type: "all",
        }),
      ]);
    }

    setIsOnboarded(userId, true);
    trackAnalytic({
      activity: "onboarding_completed",
      label: isSimplifiedOnboarding ? "simplified" : "legacy",
      category: "ui-simplification",
    });
    router.replace("/app/profile?showOptionalSetup=1");
  };

  return (
    <div className="p-4 h-[100vh]">
      <div className="w-full rounded-full border border-ui-highlight/20 overflow-hidden">
        <div
          style={{ width: `${progress}%` }}
          className="rounded-full h-2 bg-ui-highlight"
        />
      </div>

      <div className="flex h-full flex-col justify-between items-center w-full">
        <div className="w-full">
          <div className="my-3">
            <p className="text-2xl font-bold text-ui-shade mb-2">
              {currentScreen.title}
            </p>
          </div>

          <div className="space-y-4 overflow-auto max-h-[70vh] pr-2">
            {currentScreen.fields.map((field) => (
              <div key={field.name} className="w-full">
                <OnboardingFieldRenderer
                  field={field}
                  value={formValues[field.name]}
                  onChange={handleInputChange}
                />
                {field.helperText && !errors[field.name] ? (
                  <p className="mt-1 text-xs text-ui-shade/70">
                    {field.helperText}
                  </p>
                ) : null}

                {errors[field.name] ? (
                  <p className="mt-1 text-xs text-red-500">
                    {errors[field.name]}
                  </p>
                ) : null}
              </div>
            ))}
          </div>
        </div>

        <div className="w-full mt-6">
          {/* {screenIndex === totalScreens - 1 ? (
            <p className="mt-3 text-xs text-ui-shade/70 text-center">
              You can skip optional profile details for now and complete them
              later.
            </p>
          ) : null} */}
          <Button className="w-full p-6" onClick={handleNext}>
            {screenIndex === totalScreens - 1 ? "Let's Go..." : "Next"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;


