"use client";

import {
  dietOptions,
  drinkingOptions,
  goalOptions,
  interestedInOptions,
  interestOptions,
  languageOptions,
  personalityTypeOptions,
  petOptions,
  relationshipTypeOptions,
  religionOptions,
  smokingOptions,
  zodiacOptions,
} from "@/lib/options";
import * as z from "zod";

const max5StringArray = z.array(z.string()).max(5, "You can select up to 5 options.");

const goalValues = [...goalOptions.map((option) => option.value), "Undecided"] as const;
const relationshipTypeValues = [
  ...relationshipTypeOptions.map((option) => option.value),
  "Not Specified",
] as const;

export const preferenceSchema = z.object({
  interestedIn: z.enum(interestedInOptions.map((option) => option.value)),
  ageRange: z
    .array(z.number())
    .length(2)
    .refine(([min, max]) => min >= 18 && max <= 50 && min <= max, {
      message: "Age range must be between 18 and 50, and minimum <= maximum.",
    }),
  distance: z.number().min(1).max(100),
  heightRange: z
    .array(z.number())
    .length(2)
    .refine(([min, max]) => min >= 140 && max <= 220 && min <= max, {
      message: "Height range must be between 140cm and 220cm, and minimum <= maximum.",
    }),
  goal: z.object({
    primary: z.enum(goalValues),
    secondary: z.enum(goalValues),
    tertiary: z.enum(goalValues),
  }),
  interests: max5StringArray.refine(
    (values) => values.every((value) => interestOptions.some((option) => option.value === value)),
    { message: "Please select valid interests." },
  ),
  relationshipType: z.enum(relationshipTypeValues),
  languages: max5StringArray.refine(
    (values) => values.every((value) => languageOptions.some((option) => option.value === value)),
    { message: "Please select valid languages." },
  ),
  zodiacPreference: max5StringArray.refine(
    (values) => values.every((value) => zodiacOptions.some((option) => option.value === value)),
    { message: "Please select valid zodiac preferences." },
  ),
  personalityTypePreference: max5StringArray.refine(
    (values) =>
      values.every((value) =>
        personalityTypeOptions.some((option) => option.value === value),
      ),
    { message: "Please select valid personality preferences." },
  ),
  dietPreference: max5StringArray.refine(
    (values) => values.every((value) => dietOptions.some((option) => option.value === value)),
    { message: "Please select valid diet preferences." },
  ),
  religionPreference: max5StringArray.refine(
    (values) =>
      values.every((value) => religionOptions.some((option) => option.value === value)),
    { message: "Please select valid religion preferences." },
  ),
  drinkingPreference: max5StringArray.refine(
    (values) =>
      values.every((value) => drinkingOptions.some((option) => option.value === value)),
    { message: "Please select valid drinking preferences." },
  ),
  smokingPreference: max5StringArray.refine(
    (values) =>
      values.every((value) => smokingOptions.some((option) => option.value === value)),
    { message: "Please select valid smoking preferences." },
  ),
  petPreference: max5StringArray.refine(
    (values) => values.every((value) => petOptions.some((option) => option.value === value)),
    { message: "Please select valid pet preferences." },
  ),
});
