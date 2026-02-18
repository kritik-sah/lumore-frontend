"use client";

import { useUser } from "@/app/app/hooks/useUser";
import { useUserPrefrence } from "@/app/app/hooks/useUserPrefrence";
import { Button } from "@/components/ui/button";
import {
  applyReferralCode,
  setNewPassword,
  updateUserData,
  updateUserPreferences,
} from "@/lib/apis";
import {
  getPendingReferralCode,
  getUser,
  removePendingReferralCode,
  setIsOnboarded,
  setPendingReferralCode,
} from "@/service/storage";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { onboardingScreens } from "./onboarding/config";
import {
  buildOnboardingPayload,
  getInitialValuesForScreen,
  validateScreen,
} from "./onboarding/helpers";
import OnboardingFieldRenderer from "./onboarding/OnboardingFieldRenderer";
import type { Screen } from "./onboarding/types";

const Onboarding = ({ screens = onboardingScreens }: { screens?: Screen[] }) => {
  const currentUser = getUser();
  const userId = currentUser?._id;
  const { user } = useUser(userId);
  const { userPrefrence } = useUserPrefrence(userId);
  const [screenIndex, setScreenIndex] = useState(0);
  const [formValues, setFormValues] = useState<Record<string, unknown>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const router = useRouter();
  const searchParams = useSearchParams();
  const incomingReferralCode = String(searchParams.get("code") || "").trim();

  const currentScreen = screens[screenIndex];
  const totalScreens = screens.length;
  const progress = ((screenIndex + 1) / totalScreens) * 100;

  useEffect(() => {
    if (!currentScreen) return;

    const values = getInitialValuesForScreen(currentScreen, user, userPrefrence);
    if (incomingReferralCode) {
      setPendingReferralCode(incomingReferralCode);
    }

    if (currentScreen.fields.some((field) => field.name === "referralCode")) {
      const storedCode = getPendingReferralCode();
      if (storedCode && !values.referralCode) {
        values.referralCode = storedCode;
      }
    }

    setFormValues(values);
  }, [currentScreen, user, userPrefrence, incomingReferralCode]);

  const handleInputChange = (name: string, value: unknown) => {
    if (name === "referralCode") {
      const nextCode = String(value || "").trim();
      if (nextCode) {
        setPendingReferralCode(nextCode);
      } else {
        removePendingReferralCode();
      }
    }

    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  const screenErrors = useMemo(() => validateScreen(currentScreen, formValues), [
    currentScreen,
    formValues,
  ]);

  const submitOnboardingData = async () => {
    const { userData, userPreferenceData, password } = buildOnboardingPayload(
      currentScreen,
      formValues,
    );
    const referralCodeRaw =
      typeof formValues.referralCode === "string" ? formValues.referralCode : "";
    const referralCode = referralCodeRaw.trim();
    const hasReferralCodeField = currentScreen.fields.some(
      (field) => field.name === "referralCode",
    );

    if (Object.keys(userData).length) {
      await updateUserData(userData);
    }

    if (Object.keys(userPreferenceData).length) {
      await updateUserPreferences(userPreferenceData);
    }

    if (password) {
      await setNewPassword({ newPassword: password });
    }

    if (hasReferralCodeField && referralCode) {
      try {
        await applyReferralCode(referralCode);
        removePendingReferralCode();
      } catch (error: any) {
        const message =
          error?.response?.data?.message || "Invalid referral code. Please check and try again.";
        setErrors((prev) => ({ ...prev, referralCode: message }));
        throw error;
      }
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

    if (screenIndex < totalScreens - 1) {
      setScreenIndex((prev) => prev + 1);
      return;
    }

    setIsOnboarded(userId, true);
    router.replace("/app/profile");
  };

  return (
    <div className="p-4 h-[100vh]">
      <div className="w-full rounded-full border border-ui-highlight/20 overflow-hidden">
        <div
          style={{ width: `${progress}%` }}
          className="rounded-full h-2 bg-ui-highlight"
        />
      </div>

      <div className="flex h-full flex-col justify-between items-center pt-4 w-full">
        <div className="w-full">
          <div className="my-6">
            <p className="text-3xl font-bold text-ui-dark mb-2">
              {currentScreen.title}
            </p>
          </div>

          <div className="space-y-4">
            {currentScreen.fields.map((field) => (
              <div key={field.name} className="w-full">
                <OnboardingFieldRenderer
                  field={field}
                  value={formValues[field.name]}
                  onChange={handleInputChange}
                />
                {errors[field.name] ? (
                  <p className="mt-1 text-xs text-red-500">{errors[field.name]}</p>
                ) : null}
              </div>
            ))}
          </div>
        </div>

        <div className="w-full mt-6">
          <Button className="w-full p-6" onClick={handleNext}>
            {screenIndex === totalScreens - 1 ? "Let's Go..." : "Next"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
