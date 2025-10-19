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
