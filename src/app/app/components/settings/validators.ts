"use client";

export function validateSettingsField(field: string, value: string) {
  if (field === "email") {
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(value)) return "Invalid email format";
  }

  if (field === "phoneNumber") {
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (!phoneRegex.test(value.replace(/\s+/g, ""))) {
      return "Invalid phone number format";
    }
  }

  if (field === "web3Wallet") {
    const walletRegex = /^0x[a-fA-F0-9]{40}$/;
    if (!walletRegex.test(value)) return "Invalid wallet address format";
  }

  return "";
}
