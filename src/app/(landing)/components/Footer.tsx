"use client";
// components/Footer.tsx
import { InstallPrompt } from "@/components/InstallPrompt";
import { usePWA } from "@/hooks/usePWA";

export default function Footer() {
  const { deferredPrompt, isInstallable, install } = usePWA();
  const currentYear = new Date().getFullYear();

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("/sw.js");
    });
  }

  return (
    <footer className="text-center py-5 bg-ui-shade text-ui-light">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2 px-4">
        <p>© {currentYear} Lumore.xyz. All rights reserved.</p>
        <p>Made In India 🇮🇳</p>
      </div>
      {isInstallable && (
        <InstallPrompt deferredPrompt={deferredPrompt} onInstall={install} />
      )}
    </footer>
  );
}
