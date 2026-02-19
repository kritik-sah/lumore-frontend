"use client";

import * as z from "zod";

export const usernameLikeSchema = z
  .string()
  .trim()
  .min(3, "Must be at least 3 characters.")
  .max(30, "Must be at most 30 characters.")
  .regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers, and underscore are allowed.");

export const emailSchema = z
  .string()
  .trim()
  .min(1, "Email is required.")
  .email("Please enter a valid email address.");

export const phoneSchema = z
  .string()
  .trim()
  .min(1, "Phone number is required.")
  .transform((value) => value.replace(/\s+/g, ""))
  .refine((value) => /^\+?[1-9]\d{1,14}$/.test(value), {
    message: "Please enter a valid international phone number.",
  });

export const walletSchema = z
  .string()
  .trim()
  .regex(/^0x[a-fA-F0-9]{40}$/, "Invalid wallet address format.");

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters.")
  .max(25, "Password must be at most 25 characters.")
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!#%*?&])[A-Za-z\d@$#!%*?&]+$/,
    "Password must include uppercase, lowercase, number, and special character.",
  );

export const referralCodeSchema = usernameLikeSchema;

export const textPostSchema = z
  .string()
  .trim()
  .min(1, "Please write something before posting.")
  .max(1200, "Post text must be at most 1200 characters.");

export const imageCaptionSchema = z
  .string()
  .trim()
  .max(300, "Caption must be at most 300 characters.");

export const promptAnswerSchema = z
  .string()
  .trim()
  .min(2, "Please write at least 2 characters.")
  .max(300, "Prompt answer must be at most 300 characters.");

export const chatFeedbackSchema = z
  .string()
  .trim()
  .min(3, "Please add feedback before ending the chat.")
  .max(500, "Feedback must be at most 500 characters.");

export const chatReportSchema = z.object({
  category: z.string().trim().min(1, "Please choose a report category."),
  details: z
    .string()
    .trim()
    .min(5, "Please describe the issue before reporting.")
    .max(1000, "Report details must be at most 1000 characters."),
});

export const messageSchema = z
  .string()
  .trim()
  .max(1000, "Message is too long.")
  .optional();

export const thisOrThatTextSchema = z
  .string()
  .trim()
  .min(2, "Must be at least 2 characters.")
  .max(120, "Must be at most 120 characters.");

export const thisOrThatCategorySchema = z
  .string()
  .trim()
  .max(60, "Category must be at most 60 characters.")
  .optional();
