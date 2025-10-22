import type { NextConfig } from "next";
import withPWA from "next-pwa";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  images: {
    domains: [
      "api.microlink.io", // Microlink Image Preview
    ],
  },
};

// ✅ Wrap with PWA configuration
const pwaConfig = withPWA({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development", // Disable PWA in dev mode
});

// ✅ Export final merged config
export default pwaConfig(nextConfig as any);
