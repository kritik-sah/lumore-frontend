"use client";

import type { UserPreferences } from "@/app/app/hooks/useUserPrefrence";

export function calculatePreferencesCompletion(preferences?: UserPreferences) {
  if (!preferences) return { completionPercent: 0, missingCount: 0 };

  const fields = [
    preferences?.interestedIn,
    preferences?.ageRange?.length ? preferences.ageRange : null,
    preferences?.distance,
    preferences?.heightRange?.length ? preferences.heightRange : null,
    preferences?.goal,
    preferences?.relationshipType,
    preferences?.interests?.length ? preferences.interests : null,
    preferences?.languages?.length ? preferences.languages : null,
    preferences?.zodiacPreference?.length ? preferences.zodiacPreference : null,
    preferences?.personalityTypePreference?.length
      ? preferences.personalityTypePreference
      : null,
    preferences?.dietPreference?.length ? preferences.dietPreference : null,
    preferences?.religionPreference?.length ? preferences.religionPreference : null,
    preferences?.drinkingPreference?.length ? preferences.drinkingPreference : null,
    preferences?.smokingPreference?.length ? preferences.smokingPreference : null,
    preferences?.petPreference?.length ? preferences.petPreference : null,
  ];

  const filledCount = fields.filter((value) => {
    if (Array.isArray(value)) return value.length > 0;
    return value !== undefined && value !== null && value !== "";
  }).length;

  const total = fields.length;
  const completionPercent = total ? Math.round((filledCount / total) * 100) : 0;

  return { completionPercent, missingCount: total - filledCount };
}
