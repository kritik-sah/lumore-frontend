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
import { checkUsernameAvailability } from "@/lib/apis";
import * as z from "zod";

const isAtLeast18 = (dob: string) => {
  const birthDate = new Date(dob);
  if (Number.isNaN(birthDate.getTime())) return false;

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age -= 1;
  }

  return age >= 18;
};

export const createProfileSchema = (currentUsername?: string) =>
  z.object({
    username: z
      .string()
      .trim()
      .min(3, "Username must be at least 3 characters")
      .max(30, "Username must be at most 30 characters")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers, and underscore",
      )
      .refine(
        async (username) => {
          if (currentUsername && username === currentUsername) return true;
          return checkUsernameAvailability(username);
        },
        { message: "Username is already taken" },
      ),
    nickname: z
      .string()
      .trim()
      .min(1, "Nickname must be at least 1 character")
      .max(50, "Nickname must be at most 50 characters"),
    realName: z
      .string()
      .trim()
      .min(2, "Real name must be at least 2 characters")
      .max(80, "Real name must be at most 80 characters"),
  interests: z.array(z.string()).max(5),
  languages: z.array(z.string()).max(5),
    bio: z.string().trim().max(500, "Bio must not exceed 500 characters"),
    dob: z
      .string()
      .refine((value) => !Number.isNaN(new Date(value).getTime()), {
        message: "Date of birth must be a valid date",
      })
      .refine(isAtLeast18, {
        message: "You must be at least 18 years old",
      }),
    height: z
      .string()
      .regex(/^\d{2,3}$/, "Height must be a valid number in cm")
      .refine((value) => {
        const parsed = Number.parseInt(value, 10);
        return parsed >= 100 && parsed <= 250;
      }, "Height must be between 100cm and 250cm"),
    work: z.string().trim().max(100, "Work must be at most 100 characters").optional(),
    institution: z
      .string()
      .trim()
      .max(100, "Institution must be at most 100 characters")
      .optional(),
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
    hometown: z.string().trim().min(1, "Hometown is required"),
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

export const profileSchema = createProfileSchema();

export type ProfileFormValues = z.infer<typeof profileSchema>;
