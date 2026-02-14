"use client";

function percentage(fields: any[]) {
  const filled = fields.filter((value) => {
    if (Array.isArray(value)) return value.length > 0;
    return value !== undefined && value !== null && value !== "";
  }).length;

  return fields.length ? Math.round((filled / fields.length) * 100) : 0;
}

export function calculateProfileAndPreferenceCompletion(user: any, preferences: any) {
  const profileFields = [
    user?.profilePicture,
    user?.bio,
    user?.gender,
    user?.dob,
    user?.interests?.length ? user?.interests : null,
    user?.height,
    user?.diet,
    user?.zodiacSign,
    user?.lifestyle?.drinking,
    user?.lifestyle?.smoking,
    user?.lifestyle?.pets,
    user?.work,
    user?.institution,
    user?.languages?.length ? user?.languages : null,
    user?.personalityType,
    user?.religion,
    user?.homeTown,
  ];

  const preferenceFields = [
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

  return {
    profileCompletion: percentage(profileFields),
    preferenceCompletion: percentage(preferenceFields),
  };
}
