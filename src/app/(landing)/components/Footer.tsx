"use client";
import Icon from "@/components/icon";
// components/Footer.tsx
import { InstallPrompt } from "@/components/InstallPrompt";
import { usePWA } from "@/hooks/usePWA";
import { trackAnalytic } from "@/service/analytics";
import Link from "next/link";

export default function Footer() {
  const { deferredPrompt, isInstallable, install } = usePWA();
  const currentYear = new Date().getFullYear();

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker.register("/sw.js");
    });
  }

  return (
    <footer className="py-5 bg-ui-light text-ui-shade border-t border-ui-shade/10">
      <div className="mx-auto max-w-screen-xl space-y-8 px-4 py-4 sm:px-6 lg:space-y-16 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div>
            <img
              src="/assets/lumore-hr.svg"
              alt="lumore"
              className="h-16 w-28"
            />
            <p className="mt-4 max-w-xs text-ui-shade/60">
              Find Your Match, Your Way
            </p>

            <ul className="mt-8 flex gap-6">
              {/* <li>
                <a
                  href="#"
                  rel="noreferrer"
                  target="_blank"
                  className="text-ui-light/60 transition hover:opacity-75"
                >
                  <span className="sr-only">Facebook</span>

                  <svg className="size-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </li> */}

              <li>
                <a
                  href="https://www.instagram.com/0xlumore/"
                  rel="noreferrer"
                  target="_blank"
                  className="text-ui-shade transition opacity-95 hover:opacity-100"
                  onClick={() =>
                    trackAnalytic({
                      activity: "instagram_click",
                      label: "Instagram Click",
                    })
                  }
                >
                  <span className="sr-only">Instagram</span>

                  <Icon name="FaInstagram" className="h-6 w-6" />
                </a>
              </li>

              <li>
                <a
                  href="https://x.com/0xlumore"
                  rel="noreferrer"
                  target="_blank"
                  className="text-ui-shade transition opacity-95 hover:opacity-100"
                  onClick={() =>
                    trackAnalytic({
                      activity: "twitter_click",
                      label: "Twitter Click",
                    })
                  }
                >
                  <span className="sr-only">Twitter</span>
                  <Icon name="FaXTwitter" className="h-6 w-6" />
                </a>
              </li>

              <li>
                <a
                  href="https://github.com/lumore-xyz"
                  rel="noreferrer"
                  target="_blank"
                  className="text-ui-shade transition opacity-95 hover:opacity-100"
                  onClick={() =>
                    trackAnalytic({
                      activity: "github_click",
                      label: "Github Click",
                    })
                  }
                >
                  <span className="sr-only">GitHub</span>

                  <Icon name="FaGithub" className="h-6 w-6" />
                </a>
              </li>
            </ul>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:col-span-2 lg:grid-cols-4">
            <div className="hidden md:block">
              {/* <p className="font-medium text-ui-light/80">Company</p>

              <ul className="mt-6 space-y-4 text-sm">
                <li>
                  <a href="#" className="text-ui-light/60 transition hover:opacity-75"> About </a>
                </li>

                <li>
                  <a href="#" className="text-ui-light/60 transition hover:opacity-75"> Meet the Team </a>
                </li>

                <li>
                  <a href="#" className="text-ui-light/60 transition hover:opacity-75"> Accounts Review </a>
                </li>
              </ul> */}
            </div>

            <div className="hidden md:block">
              {/* <p className="font-medium text-ui-light/80">Helpful Links</p>

              <ul className="mt-6 space-y-4 text-sm">
                <li>
                  <a href="#" className="text-ui-light/60 transition hover:opacity-75"> Contact </a>
                </li>

                <li>
                  <a href="#" className="text-ui-light/60 transition hover:opacity-75"> FAQs </a>
                </li>

                <li>
                  <a href="#" className="text-ui-light/60 transition hover:opacity-75"> Live Chat </a>
                </li>
              </ul> */}
            </div>
            <div>
              <p className="font-medium text-ui-shade transition opacity-95 hover:opacity-100">
                Lumore
              </p>

              <ul className="mt-6 space-y-4 text-sm">
                <li>
                  <Link
                    href="/blog"
                    className="text-ui-shade transition opacity-95 hover:opacity-100"
                  >
                    Blog
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <p className="font-medium text-ui-shade transition opacity-95 hover:opacity-100">
                Legal
              </p>

              <ul className="mt-6 space-y-4 text-sm">
                <li>
                  <a
                    href="/terms-of-use"
                    rel="noreferrer"
                    target="_blank"
                    className="text-ui-shade transition opacity-95 hover:opacity-100"
                  >
                    Terms of use
                  </a>
                </li>
                <li>
                  <a
                    href="/privacy-policy"
                    rel="noreferrer"
                    target="_blank"
                    className="text-ui-shade transition opacity-95 hover:opacity-100"
                  >
                    Privacy policy
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center border-t border-ui-shade/10 pt-4 max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2 px-4 mt-8">
        <p>© {currentYear} Lumore.xyz All rights reserved.</p>
        <p>
          Made In India{" "}
          <img
            src="/assets/india-flag.svg"
            alt="India"
            className="h-4 w-4 inline-flex"
          />
        </p>
      </div>
      {/* {isInstallable && (
        <InstallPrompt deferredPrompt={deferredPrompt} onInstall={install} />
      )} */}
    </footer>
  );
}
