import type { Metadata, Viewport } from "next";
import { DM_Sans, Work_Sans } from "next/font/google";
import "./globals.css";
import Providers from "./provider";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

const workSans = Work_Sans({
  variable: "--font-work-sans",
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#FFD400",
};

export const metadata: Metadata = {
  title: "Lumore - Help's you socialize your way!",
  description:
    "Lumore connects you instantly with like-minded people through real-time, anonymous chat, eliminating endless swiping.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Lumore",
  },
  icons: {
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${dmSans.variable} ${workSans.variable} font-workSans`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
