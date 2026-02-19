import allLanguages from "@/lib/languages.json";

export interface SelectOption {
  label: string;
  value: string;
}

export const DYNAMIC_OPTIONS_CACHE_KEY = "lumore:dynamic-options";
export const DYNAMIC_OPTIONS_VERSION_KEY = "lumore:dynamic-options-version";
export const DYNAMIC_OPTIONS_REFETCH_EVENT = "lumore:options-refetch";
export const DYNAMIC_OPTIONS_UPDATED_EVENT = "lumore:options-updated";

const cloneOptions = (options: SelectOption[]) => options.map((option) => ({ ...option }));

const defaultLanguageOptions: SelectOption[] = allLanguages.map(
  ({ code, name, nativeName }) => ({
    label: `${name} (${nativeName})`,
    value: code.toLowerCase().replace(/\s+/g, "-"),
  }),
);

const defaultGenderOptions: SelectOption[] = [
  { label: "Woman", value: "woman" },
  { label: "Man", value: "man" },
];

const defaultInterestedInOptions: SelectOption[] = [
  { label: "woman", value: "woman" },
  { label: "Man", value: "man" },
];

const defaultGoalOptions: SelectOption[] = [
  { label: "A Serious Relationship", value: "serious-relationship" },
  { label: "Marriage or Life Partnership", value: "marriage" },
  { label: "Something Casual or Fun", value: "casual" },
  { label: "Friendship & Shared Interests", value: "friendship" },
  { label: "Open to Exploring", value: "open-to-exploring" },
  { label: "Meaningful Emotional Bond", value: "emotional-bond" },
  { label: "Travel or Activity Partner", value: "travel-activity" },
  {
    label: "Professional or Networking Connection",
    value: "professional-networking",
  },
  { label: "Exploring Identity & Sexuality", value: "identity-sexuality" },
];

const defaultBloodTypeOptions: SelectOption[] = [
  { label: "A+", value: "a+" },
  { label: "A-", value: "a-" },
  { label: "B+", value: "b+" },
  { label: "B-", value: "b-" },
  { label: "AB+", value: "ab+" },
  { label: "AB-", value: "ab-" },
  { label: "O+", value: "o+" },
  { label: "O-", value: "o-" },
];

const defaultInterestOptions: SelectOption[] = [
  { label: "Art & Culture", value: "art-culture" },
  { label: "Music", value: "music" },
  { label: "Travel & Adventure", value: "travel" },
  { label: "Reading & Literature", value: "reading" },
  { label: "Sports & Fitness", value: "sports-fitness" },
  { label: "Cooking & Food", value: "cooking" },
  { label: "Technology & Innovation", value: "technology" },
  { label: "Movies & Entertainment", value: "movies" },
  { label: "Photography & Design", value: "photography" },
  { label: "Gaming", value: "gaming" },
  { label: "Science & Nature", value: "science" },
  { label: "Volunteering & Community", value: "volunteering" },
  { label: "Mindfulness & Spirituality", value: "spirituality" },
];

const defaultDietOptions: SelectOption[] = [
  { label: "Vegetarian", value: "vegetarian" },
  { label: "Vegan", value: "vegan" },
  { label: "Pescatarian", value: "pescatarian" },
  { label: "No Restrictions", value: "no-restrictions" },
  { label: "Halal", value: "halal" },
  { label: "Kosher", value: "kosher" },
  { label: "Gluten-Free", value: "gluten-free" },
];

const defaultZodiacOptions: SelectOption[] = [
  { label: "Aries", value: "aries" },
  { label: "Taurus", value: "taurus" },
  { label: "Gemini", value: "gemini" },
  { label: "Cancer", value: "cancer" },
  { label: "Leo", value: "leo" },
  { label: "Virgo", value: "virgo" },
  { label: "Libra", value: "libra" },
  { label: "Scorpio", value: "scorpio" },
  { label: "Sagittarius", value: "sagittarius" },
  { label: "Capricorn", value: "capricorn" },
  { label: "Aquarius", value: "aquarius" },
  { label: "Pisces", value: "pisces" },
];

const defaultDrinkingOptions: SelectOption[] = [
  { label: "Never", value: "never" },
  { label: "Occasionally", value: "occasionally" },
  { label: "Socially", value: "socially" },
  { label: "Regularly", value: "regularly" },
  { label: "Prefer Not to Say", value: "prefer-not-to-say" },
];

const defaultSmokingOptions: SelectOption[] = [
  { label: "Never", value: "never" },
  { label: "Occasionally", value: "occasionally" },
  { label: "Socially", value: "socially" },
  { label: "Regularly", value: "regularly" },
  { label: "Prefer Not to Say", value: "prefer-not-to-say" },
];

const defaultPetOptions: SelectOption[] = [
  { label: "Love Pets", value: "love-pets" },
  { label: "Have Pets", value: "have-pets" },
  { label: "No Pets Right Now", value: "no-pets" },
  { label: "Allergic to Pets", value: "allergic" },
  { label: "Prefer Not to Say", value: "prefer-not-to-say" },
];

const defaultMaritalStatusOptions: SelectOption[] = [
  { label: "Single", value: "single" },
  { label: "Divorced", value: "divorced" },
  { label: "Separated", value: "separated" },
  { label: "Widowed", value: "widowed" },
  { label: "In a Relationship", value: "in-relationship" },
];

const defaultPersonalityTypeOptions: SelectOption[] = [
  { label: "INTJ", value: "intj" },
  { label: "INTP", value: "intp" },
  { label: "ENTJ", value: "entj" },
  { label: "ENTP", value: "entp" },
  { label: "INFJ", value: "infj" },
  { label: "INFP", value: "infp" },
  { label: "ENFJ", value: "enfj" },
  { label: "ENFP", value: "enfp" },
  { label: "ISTJ", value: "istj" },
  { label: "ISFJ", value: "isfj" },
  { label: "ESTJ", value: "estj" },
  { label: "ESFJ", value: "esfj" },
  { label: "ISTP", value: "istp" },
  { label: "ISFP", value: "isfp" },
  { label: "ESTP", value: "estp" },
  { label: "ESFP", value: "esfp" },
];

const defaultReligionOptions: SelectOption[] = [
  { label: "Christian", value: "christian" },
  { label: "Muslim", value: "muslim" },
  { label: "Hindu", value: "hindu" },
  { label: "Buddhist", value: "buddhist" },
  { label: "Jewish", value: "jewish" },
  { label: "Spiritual, Not Religious", value: "spiritual" },
  { label: "Agnostic / Atheist", value: "agnostic-atheist" },
  { label: "Other", value: "other" },
  { label: "Prefer Not to Say", value: "prefer-not-to-say" },
];

const defaultRelationshipTypeOptions: SelectOption[] = [
  { label: "Monogamous", value: "monogamy" },
  { label: "Open Relationship", value: "open-relationship" },
  { label: "Ethical Non-Monogamy", value: "ethical-non-monogamy" },
  { label: "Exploring What Feels Right", value: "exploring" },
];

const defaultVisibilityOptions: SelectOption[] = [
  { label: "Public", value: "public" },
  { label: "Unlock (Friends)", value: "unlocked" },
  { label: "Private", value: "private" },
];

export const languageOptions = cloneOptions(defaultLanguageOptions);
export const genderOptions = cloneOptions(defaultGenderOptions);
export const interestedInOptions = cloneOptions(defaultInterestedInOptions);
export const goalOptions = cloneOptions(defaultGoalOptions);
export const bloodTypeOptions = cloneOptions(defaultBloodTypeOptions);
export const interestOptions = cloneOptions(defaultInterestOptions);
export const dietOptions = cloneOptions(defaultDietOptions);
export const zodiacOptions = cloneOptions(defaultZodiacOptions);
export const drinkingOptions = cloneOptions(defaultDrinkingOptions);
export const smokingOptions = cloneOptions(defaultSmokingOptions);
export const petOptions = cloneOptions(defaultPetOptions);
export const maritalStatusOptions = cloneOptions(defaultMaritalStatusOptions);
export const personalityTypeOptions = cloneOptions(defaultPersonalityTypeOptions);
export const religionOptions = cloneOptions(defaultReligionOptions);
export const relationshipTypeOptions = cloneOptions(defaultRelationshipTypeOptions);
export const visibilityOptions = cloneOptions(defaultVisibilityOptions);

export type DynamicOptionKey =
  | "languageOptions"
  | "genderOptions"
  | "interestedInOptions"
  | "goalOptions"
  | "bloodTypeOptions"
  | "interestOptions"
  | "dietOptions"
  | "zodiacOptions"
  | "drinkingOptions"
  | "smokingOptions"
  | "petOptions"
  | "maritalStatusOptions"
  | "personalityTypeOptions"
  | "religionOptions"
  | "relationshipTypeOptions"
  | "visibilityOptions";

export type DynamicOptionsPayload = Partial<Record<DynamicOptionKey, SelectOption[]>>;

const dynamicOptionRegistry: Record<DynamicOptionKey, SelectOption[]> = {
  languageOptions,
  genderOptions,
  interestedInOptions,
  goalOptions,
  bloodTypeOptions,
  interestOptions,
  dietOptions,
  zodiacOptions,
  drinkingOptions,
  smokingOptions,
  petOptions,
  maritalStatusOptions,
  personalityTypeOptions,
  religionOptions,
  relationshipTypeOptions,
  visibilityOptions,
};

const isOptionArray = (value: unknown): value is SelectOption[] =>
  Array.isArray(value) &&
  value.every(
    (option) =>
      Boolean(option) &&
      typeof option === "object" &&
      typeof (option as SelectOption).label === "string" &&
      typeof (option as SelectOption).value === "string",
  );

const normalizeOptionArray = (options: SelectOption[]) => {
  const unique = new Map<string, SelectOption>();
  options.forEach((option) => {
    const value = option.value.trim();
    const label = option.label.trim();
    if (!value || !label) return;
    unique.set(value, { value, label });
  });
  return Array.from(unique.values());
};

const replaceOptionsInPlace = (target: SelectOption[], next: SelectOption[]) => {
  target.splice(0, target.length, ...next);
};

export const applyDynamicOptions = (payload: DynamicOptionsPayload) => {
  (Object.keys(dynamicOptionRegistry) as DynamicOptionKey[]).forEach((key) => {
    const next = payload[key];
    if (!isOptionArray(next)) return;
    const normalized = normalizeOptionArray(next);
    if (!normalized.length) return;
    replaceOptionsInPlace(dynamicOptionRegistry[key], normalized);
  });
};

export const saveDynamicOptionsToCache = (
  payload: DynamicOptionsPayload,
  version?: string,
) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(DYNAMIC_OPTIONS_CACHE_KEY, JSON.stringify(payload));
  if (version) {
    window.localStorage.setItem(DYNAMIC_OPTIONS_VERSION_KEY, version);
  }
};

export const loadDynamicOptionsFromCache = (): DynamicOptionsPayload | null => {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(DYNAMIC_OPTIONS_CACHE_KEY);
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as DynamicOptionsPayload;
    applyDynamicOptions(parsed);
    return parsed;
  } catch {
    return null;
  }
};

export const getCachedOptionsVersion = () => {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(DYNAMIC_OPTIONS_VERSION_KEY);
};

export const setCachedOptionsVersion = (version: string) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(DYNAMIC_OPTIONS_VERSION_KEY, version);
};

export const triggerDynamicOptionsRefetch = () => {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(DYNAMIC_OPTIONS_REFETCH_EVENT));
};
