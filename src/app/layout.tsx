import ServiceWorker from "@/components/ServiceWorker";
import DeferredThirdPartyScripts from "@/components/DeferredThirdPartyScripts";
import type { Metadata, Viewport } from "next";
import { DM_Sans, Work_Sans } from "next/font/google";
import { Toaster } from "react-hot-toast";
import "./globals.css";

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
  themeColor: "#FAFAFA",
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
    apple: "/ios/180.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head className="overflow-x-hidden">
        <meta
          name="google-adsense-account"
          content="ca-pub-7384584510187682"
        ></meta>
      </head>
      <body className={`${dmSans.variable} ${workSans.variable} font-workSans`}>
        {children}
        <DeferredThirdPartyScripts />
        <Toaster position="top-right" />
        <ServiceWorker />
      </body>
    </html>
  );
}

