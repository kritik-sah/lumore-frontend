"use client";

import { emailSchema, phoneSchema, walletSchema } from "@/lib/validation";

export function validateSettingsField(field: string, value: string) {
  if (field === "email") {
    const result = emailSchema.safeParse(value);
    if (!result.success) return result.error.issues[0]?.message || "Invalid email format";
  }

  if (field === "phoneNumber") {
    const result = phoneSchema.safeParse(value);
    if (!result.success) return result.error.issues[0]?.message || "Invalid phone number format";
  }

  if (field === "web3Wallet") {
    const result = walletSchema.safeParse(value);
    if (!result.success) return result.error.issues[0]?.message || "Invalid wallet address format";
  }

  return "";
}
