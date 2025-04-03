import { useEffect, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export const usePWA = () => {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if the app is running in standalone mode
    setIsStandalone(window.matchMedia("(display-mode: standalone)").matches);

    // Listen for changes in display mode
    const mediaQuery = window.matchMedia("(display-mode: standalone)");
    const handleDisplayModeChange = (e: MediaQueryListEvent) => {
      setIsStandalone(e.matches);
    };

    mediaQuery.addEventListener("change", handleDisplayModeChange);

    // Handle the beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Handle successful installation
    window.addEventListener("appinstalled", () => {
      setDeferredPrompt(null);
      setIsInstallable(false);
    });

    return () => {
      mediaQuery.removeEventListener("change", handleDisplayModeChange);
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  const install = async () => {
    if (!deferredPrompt) return;

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === "accepted") {
        // Track PWA installation in Google Analytics
        if (typeof window !== "undefined" && (window as any).gtag) {
          (window as any).gtag("event", "pwa_install", {
            event_category: "engagement",
            event_label: "PWA Installation",
            value: 1,
          });
        }

        setDeferredPrompt(null);
        setIsInstallable(false);
      } else {
        // Track PWA installation rejection
        if (typeof window !== "undefined" && (window as any).gtag) {
          (window as any).gtag("event", "pwa_install_rejected", {
            event_category: "engagement",
            event_label: "PWA Installation Rejected",
            value: 0,
          });
        }
      }
    } catch (error) {
      console.error("Error installing PWA:", error);
      // Track PWA installation error
      if (typeof window !== "undefined" && (window as any).gtag) {
        (window as any).gtag("event", "pwa_install_error", {
          event_category: "error",
          event_label: "PWA Installation Error",
          value: 0,
        });
      }
    }
  };

  return {
    deferredPrompt,
    isInstallable,
    isStandalone,
    install,
  };
};
