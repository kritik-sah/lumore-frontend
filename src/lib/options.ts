import allLanguages from "@/lib/languages.json";

export interface SelectOption {
  label: string;
  value: string;
}

export const languageOptions = allLanguages.map(
  ({ code, name, nativeName }) => ({
    label: `${name} (${nativeName})`,
    value: code.toLowerCase().replace(/\s+/g, "-"),
  })
);

export const genderOptions = [
  { label: "Women", value: "women" },
  { label: "Man", value: "man" },
  { label: "Non Binary", value: "non-binary" },
];

export const intrestedInOptions = [
  { label: "Women", value: "women" },
  { label: "Man", value: "man" },
  { label: "Non Binary", value: "non-binary" },
];

export const goalOptions = [
  { label: "Long-Term Relationship", value: "long-term-relationship" },
  { label: "Casual Connection", value: "casual-connection" },
  { label: "Marriage", value: "marriage" },
  { label: "Friendship", value: "friendship" },
  { label: "Still Exploring", value: "still-exploring" },
  { label: "Serious Dating", value: "serious-dating" },
  { label: "Open to Non-Monogamy", value: "open-to-non-monogamy" },
  { label: "Networking / Professional", value: "networking-professional" },
  {
    label: "Exploring Identity & Sexuality",
    value: "exploring-identity-sexuality",
  },
  { label: "Travel Partner", value: "travel-partner" },
  { label: "Activity Buddy", value: "activity-buddy" },
  { label: "Spiritual / Emotional Bond", value: "spiritual-emotional-bond" },
];

export const bloodTypeOptions = [
  { label: "A+", value: "a+" },
  { label: "A-", value: "a-" },
  { label: "B+", value: "b+" },
  { label: "B-", value: "b-" },
  { label: "AB+", value: "ab+" },
  { label: "AB-", value: "ab-" },
  { label: "O+", value: "o+" },
  { label: "O-", value: "o-" },
];

export const intrestOptions = [
  { label: "Technology", value: "technology" },
  { label: "Healthcare", value: "healthcare" },
  { label: "Finance", value: "finance" },
  { label: "Education", value: "education" },
  { label: "Arts", value: "arts" },
  { label: "Science", value: "science" },
  { label: "Engineering", value: "engineering" },
  { label: "Business", value: "business" },
  { label: "Law", value: "law" },
  { label: "Other", value: "other" },
  { label: "Reading", value: "reading" },
  { label: "Travel", value: "travel" },
  { label: "Music", value: "music" },
  { label: "Sports", value: "sports" },
  { label: "Cooking", value: "cooking" },
  { label: "Photography", value: "photography" },
  { label: "Gaming", value: "gaming" },
  { label: "Fitness", value: "fitness" },
];

export const dietOptions = [
  { label: "Vegetarian", value: "vegetarian" },
  { label: "Vegan", value: "vegan" },
  { label: "Pescatarian", value: "pescatarian" },
  { label: "Non-Vegetarian", value: "non-vegetarian" },
  { label: "Gluten-Free", value: "gluten-free" },
  { label: "Kosher", value: "kosher" },
  { label: "Halal", value: "halal" },
  { label: "No Specific Diet", value: "no-specific-diet" },
];

export const zodiacOptions = [
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

export const drinkingOptions = [
  { label: "Never", value: "never" },
  { label: "Rarely", value: "rarely" },
  { label: "Socially", value: "socially" },
  { label: "Regular", value: "regular" },
  { label: "Prefer Not to Say", value: "prefer-not-to-say" },
];

export const smokingOptions = [
  { label: "Never", value: "never" },
  { label: "Rarely", value: "rarely" },
  { label: "Socially", value: "socially" },
  { label: "Regular", value: "regular" },
  { label: "Prefer Not to Say", value: "prefer-not-to-say" },
];

export const petOptions = [
  { label: "Have Pets", value: "have-pets" },
  { label: "Love Pets", value: "love-pets" },
  { label: "Allergic to Pets", value: "allergic-to-pets" },
  { label: "No Pets", value: "no-pets" },
  { label: "Prefer Not to Say", value: "prefer-not-to-say" },
];

export const maritalStatusOptions = [
  { label: "Single", value: "single" },
  { label: "Divorced", value: "divorced" },
  { label: "Separated", value: "separated" },
  { label: "Widowed", value: "widowed" },
  { label: "Married", value: "married" },
  { label: "Prefer Not to Say", value: "prefer-not-to-say" },
];

export const personalityTypeOptions = [
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
  { label: "Not Sure", value: "not-sure" },
];

export const religionOptions = [
  { label: "Christianity", value: "christianity" },
  { label: "Islam", value: "islam" },
  { label: "Hinduism", value: "hinduism" },
  { label: "Buddhism", value: "buddhism" },
  { label: "Judaism", value: "judaism" },
  { label: "Atheism", value: "atheism" },
  { label: "Other", value: "other" },
];

export const relationshipTypeOptions = [
  { label: "Monogamy", value: "monogamy" },
  { label: "Ethical Non-Monogamy", value: "ethical-non-monogamy" },
  { label: "Polyamory", value: "polyamory" },
  { label: "Open to Exploring", value: "open-to-exploring" },
  { label: "Not Specified", value: "not-specified" },
];
