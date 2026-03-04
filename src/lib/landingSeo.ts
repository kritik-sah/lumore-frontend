export const SITE_URL = "https://www.lumore.xyz";
export const SITE_NAME = "Lumore";
export const TWITTER_CREATOR = "@0xlumore";

const LANDING_BASE_KEYWORDS = [
  "Lumore",
  "swipeless dating",
  "dating without swiping",
  "no swipe dating app",
  "conversation-first dating",
  "intent-based matching",
  "anonymous chat dating",
];

export function withLandingKeywords(extraKeywords: string[] = []): string[] {
  return Array.from(new Set([...LANDING_BASE_KEYWORDS, ...extraKeywords]));
}

export function toAbsoluteUrl(pathOrUrl: string): string {
  if (/^https?:\/\//i.test(pathOrUrl)) {
    return pathOrUrl;
  }

  const normalizedPath = pathOrUrl.startsWith("/")
    ? pathOrUrl
    : `/${pathOrUrl}`;
  return `${SITE_URL}${normalizedPath}`;
}
