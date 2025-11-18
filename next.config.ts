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
// const pwaConfig = withPWA({
//   dest: "public",
//   register: true,
//   disable: process.env.NODE_ENV === "development",
// });

// ✅ Export final merged config
export default nextConfig;
