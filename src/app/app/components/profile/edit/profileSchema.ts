"use client";

import {
  bloodTypeOptions,
  dietOptions,
  drinkingOptions,
  genderOptions,
  maritalStatusOptions,
  personalityTypeOptions,
  petOptions,
  religionOptions,
  smokingOptions,
  zodiacOptions,
} from "@/lib/options";
import * as z from "zod";

export const profileSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  nickname: z.string().min(1, "Nickname must be at least 1 characters"),
  realName: z.string().min(2, "Real name must be at least 2 characters"),
  interests: z.array(z.string()).max(5),
  languages: z.array(z.string()).max(5),
  bio: z.string().max(500, "Bio must not exceed 500 characters"),
  dob: z.string(),
  height: z.string().regex(/^\d{2,3}$/, "Height must be a valid number in cm"),
  work: z.string().optional(),
  institution: z.string().optional(),
  phoneNumber: z
    .string()
    .transform((val) => val.replace(/\s+/g, ""))
    .refine((val) => !val || /^\+?[1-9]\d{1,14}$/.test(val), {
      message:
        "Invalid phone number format. Please enter a valid international phone number.",
    })
    .optional(),
  bloodGroup: z.enum(bloodTypeOptions.map((option) => option.value)),
  gender: z.enum(genderOptions.map((option) => option.value)),
  hometown: z.string(),
  diet: z.enum(dietOptions.map((option) => option.value)),
  zodiacSign: z.enum(zodiacOptions.map((option) => option.value)),
  lifestyle: z.object({
    drinking: z.enum(drinkingOptions.map((option) => option.value)),
    smoking: z.enum(smokingOptions.map((option) => option.value)),
    pets: z.enum(petOptions.map((option) => option.value)),
  }),
  maritalStatus: z.enum(maritalStatusOptions.map((option) => option.value)),
  personalityType: z.enum(personalityTypeOptions.map((option) => option.value)),
  religion: z.enum(religionOptions.map((option) => option.value)),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
