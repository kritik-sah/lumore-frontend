"use client";

export function calculateProfileCompletion(user: any) {
  const fields = [
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
    user?.hometown,
  ];

  const filledCount = fields.filter((value) => {
    if (Array.isArray(value)) return value.length > 0;
    return value !== undefined && value !== null && value !== "";
  }).length;

  const total = fields.length;
  const completionPercent = total ? Math.round((filledCount / total) * 100) : 0;

  return {
    completionPercent,
    missingCount: total - filledCount,
  };
}
