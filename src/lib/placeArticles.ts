import "server-only";

import { applyTemplateDeep } from "@/lib/template";
import { client, urlFor } from "@/sanity/client";

export const PLACE_SITE_URL = "https://www.lumore.xyz";

const options = { next: { revalidate: 60 } };
const navOptions = { next: { revalidate: 3600 } };

type PlaceCta = {
  label: string;
  href: string;
};

type HeroImage = {
  src: string;
  alt: string;
};

type MatchingStep = {
  step: string;
  title: string;
  points: string[];
};

type AreaItem = {
  name: string;
  description: string;
  dateIdeas: string[];
};

type ComparisonRow = {
  label: string;
  typical: string;
  lumore: string;
};

type FaqItem = {
  q: string;
  a: string;
};

export type PlaceArticle = {
  _updatedAt?: string;
  slug: string;
  placeName: string;
  region: string;
  country: string;
  sortOrder?: number | null;
  seo: {
    title: string;
    description: string;
    ogImage?: string;
    canonical: string;
  };
  hero: {
    headline: string;
    subheadline: string;
    primaryCta: PlaceCta;
    secondaryCta: PlaceCta;
    heroImages: HeroImage[];
  };
  why: {
    title: string;
    intro: string;
    bullets: string[];
  };
  matching: {
    title: string;
    steps: MatchingStep[];
    scoringFactors: string[];
  };
  areas: {
    title: string;
    items?: AreaItem[];
  };
  events: {
    title: string;
    intro: string;
    types?: string[];
    cta: PlaceCta;
  };
  community: {
    title: string;
    features: string[];
    safety: string[];
  };
  comparison: {
    title: string;
    rows: ComparisonRow[];
  };
  faqs: {
    title: string;
    items: FaqItem[];
  };
  closing: {
    title: string;
    subtext: string;
    cta: PlaceCta;
  };
};

export type PlaceNavLink = {
  slug: string;
  placeName: string;
  region: string;
  country: string;
};

export type PlaceSitemapEntry = {
  slug: string;
  updatedAt?: string;
};

type SanityImageField = {
  alt?: string;
  asset?: unknown;
};

type PlaceDocument = {
  _updatedAt?: string;
  slug: string;
  placeName: string;
  region: string;
  country: string;
  sortOrder?: number | null;
  seo: {
    title: string;
    description: string;
    canonical?: string;
  };
  hero: {
    headline: string;
    subheadline: string;
    secondaryCta?: PlaceCta;
    heroImages?: SanityImageField[];
    heroImage?: SanityImageField;
  };
  areas: {
    title: string;
    items?: AreaItem[];
  };
  events: {
    title: string;
    intro: string;
    types?: string[];
    cta?: PlaceCta;
  };
};

const STATIC_PRIMARY_CTA_TEMPLATE: PlaceCta = {
  label: "Start Matching in {placeName}",
  href: "https://play.google.com/store/apps/details?id=xyz.lumore.www.twa",
};

const STATIC_WHY_TEMPLATE = {
  title: "Why Dating in {placeName} Feels So Exhausting",
  intro:
    "{placeName} is one of the most social places around, but modern dating can still feel noisy and repetitive. The format is usually the problem, not the people.",
  bullets: [
    "Too many options and too little clarity can make conversations feel disposable.",
    "Busy schedules make consistency hard, even when the first interaction feels promising.",
    "Most apps optimize for profile browsing instead of intent and compatibility.",
  ],
};

const STATIC_MATCHING_TEMPLATE = {
  title: "City-Based Instant Matching in {placeName}",
  steps: [
    {
      step: "1",
      title: "Enter the {placeName} matching pool",
      points: [
        "Set your intent, age range, and distance preferences.",
        "Join a live local matching pool instead of swiping endlessly.",
      ],
    },
    {
      step: "2",
      title: "Get one high-quality nearby match",
      points: [
        "Compatibility and proximity are considered together.",
        "You focus on one aligned introduction at a time.",
      ],
    },
    {
      step: "3",
      title: "Talk first, unlock identity later",
      points: [
        "Start with anonymous-first conversation to reduce pressure.",
        "Unlock profiles only with mutual consent.",
      ],
    },
  ],
  scoringFactors: [
    "Relationship goals",
    "Intent alignment",
    "Lifestyle preferences",
    "Conversation readiness",
    "Compatibility signals",
  ],
};

const STATIC_COMMUNITY_TEMPLATE = {
  title: "A Community, Not Just an App in {placeName}",
  features: [
    "City-first singles circles focused on consistency over randomness.",
    "Conversation prompts designed for real compatibility, not just openers.",
    "Feedback loops that improve match quality over time.",
  ],
  safety: [
    "Report and block controls",
    "Anonymous-first and mutual unlock flow",
    "Active moderation for safer interactions",
  ],
};

const STATIC_COMPARISON = {
  title: "Why Lumore Is Different From Other Dating Apps in {placeName}",
  rows: [
    {
      label: "Swiping",
      typical: "Endless scrolling and fast profile filtering",
      lumore: "No swipe. One best match at a time",
    },
    {
      label: "Match quality",
      typical: "High volume, low context",
      lumore: "Lower volume, higher intent alignment",
    },
    {
      label: "Conversation start",
      typical: "Identity-first pressure",
      lumore: "Anonymous-first to reduce bias",
    },
    {
      label: "Local relevance",
      typical: "Broad city feed",
      lumore: "Neighborhood-aware matching signals",
    },
    {
      label: "Offline transition",
      typical: "Unstructured and inconsistent",
      lumore: "Community-led events and guided next steps",
    },
  ],
};

const STATIC_FAQS_TEMPLATE = {
  title: "Dating in {placeName}: FAQs",
  items: [
    {
      q: "What is the best dating app in {placeName} for serious intent?",
      a: "If you want fewer but better introductions, Lumore is built for conversation-first dating in {placeName} without endless swiping.",
    },
    {
      q: "How can I meet singles near me in {placeName}?",
      a: "Use city-focused matching and neighborhood events so your connections are nearby and easier to meet in real life.",
    },
    {
      q: "How does anonymous-first chat help?",
      a: "It reduces appearance pressure early and gives both people space to evaluate communication style and intent before profile unlock.",
    },
    {
      q: "Is this useful for professionals with busy schedules?",
      a: "Yes. The one-match flow is designed for people with tight calendars who want quality conversations over high-volume scrolling.",
    },
  ],
};

const STATIC_CLOSING_TEMPLATE = {
  title: "Ready to Date in {placeName} Without Swiping?",
  subtext: "One match. One conversation. Real connection in {placeName}.",
  cta: {
    label: "Start Matching in {placeName}",
    href: "https://play.google.com/store/apps/details?id=xyz.lumore.www.twa",
  },
};

const PLACE_FIELDS = `
  _updatedAt,
  "slug": slug.current,
  placeName,
  region,
  country,
  sortOrder,
  seo{
    title,
    description,
    canonical
  },
  hero{
    headline,
    subheadline,
    secondaryCta{
      label,
      href
    },
    heroImages[]{
      alt,
      asset
    },
    heroImage{
      alt,
      asset
    }
  },
  areas{
    title,
    items[]{
      name,
      description,
      dateIdeas
    }
  },
  events{
    title,
    intro,
    types,
    cta{
      label,
      href
    }
  }
`;

const ALL_PLACES_QUERY = `*[_type == "place" && defined(slug.current)]|order(coalesce(sortOrder, 999999) asc, placeName asc){${PLACE_FIELDS}}`;
const PLACE_BY_SLUG_QUERY = `*[_type == "place" && slug.current == $slug][0]{${PLACE_FIELDS}}`;
const PLACE_SLUGS_QUERY = `*[_type == "place" && defined(slug.current)]|order(coalesce(sortOrder, 999999) asc, placeName asc){"slug": slug.current}`;
const PLACE_NAV_QUERY = `*[_type == "place" && defined(slug.current)]|order(coalesce(sortOrder, 999999) asc, placeName asc){
  "slug": slug.current,
  placeName,
  region,
  country
}`;
const PLACE_SITEMAP_QUERY = `*[_type == "place" && defined(slug.current)]|order(coalesce(sortOrder, 999999) asc, placeName asc){
  "slug": slug.current,
  _updatedAt
}`;

function buildImageUrl(image?: SanityImageField): string | undefined {
  if (!image?.asset) {
    return undefined;
  }

  try {
    return urlFor(image).url();
  } catch {
    return undefined;
  }
}

function applyPlaceNameTemplate<T>(template: T, placeName: string): T {
  return applyTemplateDeep(template, { placeName });
}

function mapHeroImages(images: SanityImageField[] | undefined, placeName: string): HeroImage[] {
  if (!Array.isArray(images)) {
    return [];
  }

  return images
    .map((image, index) => {
      const src = buildImageUrl(image);
      if (!src) {
        return null;
      }

      return {
        src,
        alt: image.alt || `Dating in ${placeName} (${index + 1})`,
      };
    })
    .filter((image): image is HeroImage => Boolean(image));
}

function mapPlaceDocument(place: PlaceDocument): PlaceArticle {
  const seoCanonical = place.seo?.canonical || `/place/${place.slug}`;
  const heroImages = mapHeroImages(place.hero?.heroImages, place.placeName);
  const legacyHeroImageUrl = buildImageUrl(place.hero?.heroImage);
  const legacyHeroImageAlt = place.hero?.heroImage?.alt || `Dating in ${place.placeName}`;
  const resolvedHeroImages =
    heroImages.length > 0
      ? heroImages
      : legacyHeroImageUrl
        ? [
            {
              src: legacyHeroImageUrl,
              alt: legacyHeroImageAlt,
            },
          ]
        : [];
  const seoOgImage = resolvedHeroImages[0]?.src;

  const primaryCta = applyPlaceNameTemplate(
    STATIC_PRIMARY_CTA_TEMPLATE,
    place.placeName,
  );
  const why = applyPlaceNameTemplate(STATIC_WHY_TEMPLATE, place.placeName);
  const matching = applyPlaceNameTemplate(STATIC_MATCHING_TEMPLATE, place.placeName);
  const community = applyPlaceNameTemplate(STATIC_COMMUNITY_TEMPLATE, place.placeName);
  const comparison = applyPlaceNameTemplate(STATIC_COMPARISON, place.placeName);
  const faqs = applyPlaceNameTemplate(STATIC_FAQS_TEMPLATE, place.placeName);
  const closing = applyPlaceNameTemplate(STATIC_CLOSING_TEMPLATE, place.placeName);

  return {
    _updatedAt: place._updatedAt,
    slug: place.slug,
    placeName: place.placeName,
    region: place.region,
    country: place.country,
    sortOrder: place.sortOrder ?? null,
    seo: {
      title: place.seo.title,
      description: place.seo.description,
      canonical: seoCanonical,
      ogImage: seoOgImage,
    },
    hero: {
      headline: place.hero.headline,
      subheadline: place.hero.subheadline,
      primaryCta,
      secondaryCta: place.hero.secondaryCta ?? { label: "Explore Events", href: "/events" },
      heroImages: resolvedHeroImages,
    },
    why,
    matching,
    areas: {
      title: place.areas?.title ?? `Meet Singles Near You in ${place.placeName}`,
      items: place.areas?.items ?? [],
    },
    events: {
      title: place.events?.title ?? `Offline Dating Events in ${place.placeName}`,
      intro:
        place.events?.intro ??
        `Not just online. Build real-world connections in ${place.placeName} through curated social circles.`,
      types: place.events?.types ?? [],
      cta: place.events?.cta ?? {
        label: `Join the next ${place.placeName} event`,
        href: "/events",
      },
    },
    community,
    comparison,
    faqs,
    closing,
  };
}

export async function getAllPlaceArticles(): Promise<PlaceArticle[]> {
  const places = await client.fetch<PlaceDocument[]>(ALL_PLACES_QUERY, {}, options);
  return places.map(mapPlaceDocument);
}

export async function getPlaceArticleBySlug(
  slug: string,
): Promise<PlaceArticle | undefined> {
  const place = await client.fetch<PlaceDocument | null>(
    PLACE_BY_SLUG_QUERY,
    { slug },
    options,
  );

  if (!place) {
    return undefined;
  }

  return mapPlaceDocument(place);
}

export async function getPlaceArticleSlugs(): Promise<string[]> {
  const slugs = await client.fetch<{ slug: string }[]>(PLACE_SLUGS_QUERY, {}, options);
  return slugs.map((item) => item.slug).filter(Boolean);
}

export async function getPlaceNavLinks(): Promise<PlaceNavLink[]> {
  return client.fetch<PlaceNavLink[]>(PLACE_NAV_QUERY, {}, navOptions);
}

export async function getPlaceSitemapEntries(): Promise<PlaceSitemapEntry[]> {
  const places = await client.fetch<{ slug: string; _updatedAt?: string }[]>(
    PLACE_SITEMAP_QUERY,
    {},
    options,
  );

  return places.map((place) => ({
    slug: place.slug,
    updatedAt: place._updatedAt,
  }));
}

export function toAbsolutePlaceUrl(url: string) {
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  if (url.startsWith("/")) {
    return `${PLACE_SITE_URL}${url}`;
  }

  return `${PLACE_SITE_URL}/${url}`;
}
