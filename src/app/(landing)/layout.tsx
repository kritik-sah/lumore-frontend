import type { Metadata } from "next";
import Footer from "./components/Footer";
import NavbarUI from "./components/Navbar";
import { getPlaceNavLinks } from "@/lib/placeArticles";

export const metadata: Metadata = {
  title: "Lumore - Help's you socialize your way!",
  description:
    "Lumore connects you instantly with like-minded people through real-time, anonymous chat, eliminating endless swiping.",
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


