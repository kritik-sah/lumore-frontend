export type CompareAppSlug = "tinder" | "bumble" | "hinge" | "trulymadly";

export type CoreBenchmarkFeatureId =
  | "firstInteraction"
  | "profileVisibility"
  | "matchingSpeed"
  | "identityProtection"
  | "primaryFocus"
  | "genderSafety"
  | "monetization"
  | "experienceMen"
  | "experienceWomen";

export interface CoreBenchmarkFeature {
  id: CoreBenchmarkFeatureId;
  label: string;
  lumoreValue: string;
}

export interface CompareAppBenchmarkExtra {
  id: string;
  label: string;
  lumoreValue: string;
  appValue: string;
}

export interface CompareAppBenchmark {
  core: Record<CoreBenchmarkFeatureId, string>;
  extras?: CompareAppBenchmarkExtra[];
}

export interface CompareAppConfig {
  name: string;
  image: string;
  description: string;
  strengths: string[];
  weaknesses: string[];
  swipeModel: boolean;
  targetAudience: string;
  brandTone: string;
  benchmark: CompareAppBenchmark;
}

export const coreBenchmarkFeatures: CoreBenchmarkFeature[] = [
  {
    id: "firstInteraction",
    label: "First interaction",
    lumoreValue: "Anonymous chat",
  },
  {
    id: "profileVisibility",
    label: "Profile visibility",
    lumoreValue: "Hidden by default",
  },
  {
    id: "matchingSpeed",
    label: "Matching speed",
    lumoreValue: "Instant",
  },
  {
    id: "identityProtection",
    label: "Identity protection",
    lumoreValue: "Full control (reveal by choice)",
  },
  {
    id: "primaryFocus",
    label: "Primary focus",
    lumoreValue: "Friends + Dating (social + events)",
  },
  {
    id: "genderSafety",
    label: "Gender safety",
    lumoreValue: "High (unlock + anonymity)",
  },
  {
    id: "monetization",
    label: "Monetization",
    lumoreValue: "Ads + Subscriptions + Events",
  },
  {
    id: "experienceMen",
    label: "Experience (men)",
    lumoreValue: "Equal opportunity / intent-first",
  },
  {
    id: "experienceWomen",
    label: "Experience (women)",
    lumoreValue: "Full privacy -> safer, calmer",
  },
];

export const compareData: Record<CompareAppSlug, CompareAppConfig> = {
  tinder: {
    name: "Tinder",
    image: "/assets/tinder.png",
    description:
      "Tinder is a global dating app built around fast swipe decisions and high-volume profile discovery.",
    strengths: [
      "Large and active user base in many cities",
      "Simple onboarding and fast matching flow",
      "Useful when you want broad discovery quickly",
    ],
    weaknesses: [
      "High decision fatigue from constant profile browsing",
      "Conversation quality can drop in very high-volume matching",
      "Appearance-first sorting can overshadow deeper compatibility",
    ],
    swipeModel: true,
    targetAudience: "People who want quick discovery and broad match volume",
    brandTone: "Fast, casual, and discovery-driven",
    benchmark: {
      core: {
        firstInteraction: "Swipe on photos",
        profileVisibility: "Public to all",
        matchingSpeed: "Minutes to days",
        identityProtection: "Limited",
        primaryFocus: "Dating only",
        genderSafety: "Low to medium",
        monetization: "Swipe limits / boosts",
        experienceMen: "Low match rate",
        experienceWomen: "Harassment risk",
      },
    },
  },
  bumble: {
    name: "Bumble",
    image: "/assets/bumble.png",
    description:
      "Bumble is a swipe-based dating app where matching happens first and conversation starts after a mutual like.",
    strengths: [
      "Well-known app with a mainstream audience",
      "Structured chat initiation can reduce random outreach",
      "Good for users who like clear in-app interaction rules",
    ],
    weaknesses: [
      "Still relies on frequent swipe decisions",
      "Time-based chat windows can create pressure",
      "Volume-first behavior can still lead to burnout",
    ],
    swipeModel: true,
    targetAudience:
      "Users who prefer swipe browsing with a structured chat flow",
    brandTone: "Confident, modern, and socially structured",
    benchmark: {
      core: {
        firstInteraction: "Swipe on photos",
        profileVisibility: "Public to all",
        matchingSpeed: "Hours to days",
        identityProtection: "Limited",
        primaryFocus: "Dating + BFF + Bizz",
        genderSafety: "Medium",
        monetization: "Premium tiers / boosts",
        experienceMen: "Low to medium match rate",
        experienceWomen: "Better initiation control",
      },
    },
  },
  hinge: {
    name: "Hinge",
    image: "/assets/hinge.png",
    description:
      "Hinge is a swipe and prompt-led dating app focused on profile details and comment-based likes.",
    strengths: [
      "Prompt format can create better conversation starters",
      "Profiles encourage more context than photos alone",
      "Popular among users seeking more intentional dating",
    ],
    weaknesses: [
      "Still dependent on repeated profile screening",
      "Prompt performance can feel like profile optimization work",
      "Choice overload remains a common issue in dense cities",
    ],
    swipeModel: true,
    targetAudience:
      "People who want profile depth while keeping a familiar swipe flow",
    brandTone: "Intentional, conversational, and profile-forward",
    benchmark: {
      core: {
        firstInteraction: "Like + comment on prompts",
        profileVisibility: "Public to all",
        matchingSpeed: "Days / weeks",
        identityProtection: "Limited",
        primaryFocus: "Relationship-oriented dating",
        genderSafety: "Medium",
        monetization: "Likes limits / premium",
        experienceMen: "Low match rate",
        experienceWomen: "Better but public",
      },
    },
  },
  trulymadly: {
    name: "TrulyMadly",
    image: "/assets/trulymadly.png",
    description:
      "TrulyMadly is an India-focused dating app that uses swipe-style discovery with trust and profile verification layers.",
    strengths: [
      "Built with India-specific social context in mind",
      "Trust and verification features improve profile confidence",
      "Helpful for users who prefer regional relevance",
    ],
    weaknesses: [
      "Swipe loops can still create fatigue over time",
      "High browsing volume can reduce depth per conversation",
      "Match quality can vary based on city-level supply",
    ],
    swipeModel: true,
    targetAudience:
      "Indian users looking for local context with familiar swipe mechanics",
    brandTone: "Trust-oriented, practical, and region-specific",
    benchmark: {
      core: {
        firstInteraction: "Swipe on profiles",
        profileVisibility: "Public to all",
        matchingSpeed: "Days / weeks",
        identityProtection: "Verification-led, limited anonymity",
        primaryFocus: "Dating only",
        genderSafety: "Medium",
        monetization: "Subscriptions / boosts",
        experienceMen: "Low to medium match rate",
        experienceWomen: "Better trust checks, still public",
      },
      extras: [
        {
          id: "trust-verification",
          label: "Trust verification",
          lumoreValue: "Behavior + consent signals",
          appValue: "ID and badge verification",
        },
      ],
    },
  },
};

export const compareAppSlugs = Object.keys(compareData) as CompareAppSlug[];

export function getCompareApp(slug: string): CompareAppConfig | null {
  const normalizedSlug = slug.toLowerCase() as CompareAppSlug;
  return compareData[normalizedSlug] ?? null;
}
