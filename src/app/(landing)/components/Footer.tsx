"use client";
import Icon from "@/components/icon";
import { trackAnalytic } from "@/service/analytics";
import Link from "next/link";

export default function Footer() {
  const currentYear = new Date().getFullYear();

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
            <p className="mt-3 text-sm font-semibold text-ui-shade">
              Find Your Match, Your Way
            </p>
            <p className="mt-2 max-w-xs text-ui-shade/60">
              A community-first way to meet new people without endless swiping.
            </p>

            <ul className="mt-8 flex gap-6">
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
            <div className="hidden md:block"></div>

            <div className="hidden md:block"></div>
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
        <p>\u00A9 {currentYear} Lumore.xyz All rights reserved.</p>
        <p>
          Made In India{" "}
          <img
            src="/assets/india-flag.svg"
            alt="India"
            className="h-4 w-4 inline-flex"
          />
        </p>
      </div>
    </footer>
  );
}
