// Helper function to convert height from cm to feet/inches
import allLanguages from "@/lib/languages.json";

export const convertHeight = (cm?: number) => {
  if (!cm) return "N/A";
  const inches = Math.round(cm / 2.54);
  const feet = Math.floor(inches / 12);
  const remainderInches = inches % 12;
  return `${feet}'${remainderInches}"`;
};

// Helper function to calculate age from DOB
export const calculateAge = (dob?: string) => {
  if (!dob) return "N/A";
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age;
};

export const languageDisplay = (value: string[]) => {
  const languageOptions = allLanguages.map(({ code, name, nativeName }) => ({
    label: `${name}`,
    value: code,
  }));
  return (
    languageOptions
      .filter((opt) => value.includes(opt.value))
      .map((opt) => opt.label) || []
  );
};

export const distanceDisplay = (value: number) => {
  if (value < 1) {
    return "<1km";
  } else {
    return `${Math.floor(value)}km`;
  }
};

/**
 * Returns the label corresponding to a given value from an options array.
 *
 * @template T - The option type extending { label: string; value: string }.
 * @param options - Array of selectable options.
 * @param value - The value to find the label for.
 * @returns The matching label, or the value itself if no match is found.
 */
export function getLabelFromValue<T extends { label: string; value: string }>(
  options: T[],
  value: string
): string {
  const match = options.find((opt) => opt.value === value);
  return match ? match.label : value;
}

/**
 * Formats a number into a readable string with K, M, B, T suffixes
 * @param num - The number to format
 * @param decimals - Number of decimal places (default: 1)
 * @returns Formatted string
 */
export function formatNumber(num: number, decimals: number = 1): string {
  if (num === 0) return "0";
  if (num < 0) return "-" + formatNumber(Math.abs(num), decimals);

  const units = [
    { value: 1e12, suffix: "T" }, // Trillion
    { value: 1e9, suffix: "B" }, // Billion
    { value: 1e6, suffix: "M" }, // Million
    { value: 1e3, suffix: "K" }, // Thousand
  ];

  for (const unit of units) {
    if (num >= unit.value) {
      const formatted = num / unit.value;
      // Remove unnecessary decimals (e.g., 1.0K -> 1K)
      const rounded = Number(formatted.toFixed(decimals));
      return rounded % 1 === 0
        ? `${Math.floor(rounded)}${unit.suffix}`
        : `${rounded}${unit.suffix}`;
    }
  }

  // For numbers less than 1000, return as is
  return num.toString();
}

export async function registerServiceWorker() {
  const registration = await navigator.serviceWorker.register("/sw.js", {
    scope: "/",
    updateViaCache: "none",
  });
  const sub = await registration.pushManager.getSubscription();
  // setSubscription(sub)
  return sub;
}
