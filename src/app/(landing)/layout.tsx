import type { Metadata } from "next";
import Footer from "./components/Footer";
import NavbarUI from "./components/Navbar";
import { getPlaceNavLinks } from "@/lib/placeArticles";
import {
  SITE_NAME,
  SITE_URL,
  TWITTER_CREATOR,
  toAbsoluteUrl,
  withLandingKeywords,
} from "@/lib/landingSeo";

const LANDING_HOME_URL = toAbsoluteUrl("/");

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Lumore - Help's you socialize your way!",
  description:
    "Lumore connects you instantly with like-minded people through real-time, anonymous chat, eliminating endless swiping.",
  keywords: withLandingKeywords(),
  alternates: {
    canonical: LANDING_HOME_URL,
  },
  openGraph: {
    title: "Lumore - Help's you socialize your way!",
    description:
      "Lumore connects you instantly with like-minded people through real-time, anonymous chat, eliminating endless swiping.",
    url: LANDING_HOME_URL,
    siteName: SITE_NAME,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lumore - Help's you socialize your way!",
    description:
      "Lumore connects you instantly with like-minded people through real-time, anonymous chat, eliminating endless swiping.",
    creator: TWITTER_CREATOR,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const placeLinks = await getPlaceNavLinks();

  return (
    <div>
      <NavbarUI placeLinks={placeLinks} />
      {children}
      <Footer placeLinks={placeLinks} />
    </div>
  );
}


