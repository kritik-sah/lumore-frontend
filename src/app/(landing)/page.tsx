import { TWITTER_CREATOR, toAbsoluteUrl, withLandingKeywords } from "@/lib/landingSeo";
import type { Metadata } from "next";
import HowLumoreIsDifferent from "./components/HowLumoreIsDifferent";
import Hero from "./components/Hero";
import HowLumoreWorks from "./components/HowLumoreWorks";
import ProductPortfolio from "./components/ProducyPortfolio";
import ReelShowcase from "./components/ReelShowcase";
import AppStats from "./components/AppStats";

const HOME_URL = toAbsoluteUrl("/");

export const metadata: Metadata = {
  title: "Lumore | Swipeless Dating App for Real Connections",
  description:
    "Lumore is a swipeless dating app built for meaningful connections through conversation-first introductions, anonymous-first chat, and intent-led matching.",
  keywords: withLandingKeywords([
    "swipeless dating app",
    "real connections",
    "dating app",
    "dating app India",
  ]),
  alternates: {
    canonical: HOME_URL,
  },
  openGraph: {
    title: "Lumore | Swipeless Dating App for Real Connections",
    description:
      "Lumore is a swipeless dating app built for meaningful connections through conversation-first introductions, anonymous-first chat, and intent-led matching.",
    url: HOME_URL,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lumore | Swipeless Dating App for Real Connections",
    description:
      "Lumore is a swipeless dating app built for meaningful connections through conversation-first introductions, anonymous-first chat, and intent-led matching.",
    creator: TWITTER_CREATOR,
  },
};

export default function Home() {
  return (
    <div className="">
      <Hero />
      <ProductPortfolio />
      <AppStats />
      <HowLumoreWorks />
      <HowLumoreIsDifferent />
      <ReelShowcase />
    </div>
  );
}
