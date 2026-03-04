import Icon from "@/components/icon";
import { compareAppSlugs, compareData } from "@/lib/compareData";
import Image from "next/image";
import Link from "next/link";

type FooterPlaceLink = {
  slug: string;
  placeName: string;
};

type FooterProps = {
  placeLinks: FooterPlaceLink[];
};

export default function Footer({ placeLinks }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const compareLinks = compareAppSlugs.map((slug) => ({
    slug,
    name: compareData[slug].name,
  }));

  return (
    <footer className="bg-ui-light text-ui-shade border-t border-ui-shade/10">
      <div className="mx-auto max-w-screen-xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3 lg:gap-12">
          <div>
            <Image
              src="/assets/lumore-hr.svg"
              alt="lumore"
              width={112}
              height={56}
              className="h-14 w-28"
            />
            <p className="mt-3 text-sm font-semibold tracking-wide text-ui-shade">
              Find Your Match, Your Way
            </p>
            <p className="mt-2 max-w-xs text-sm leading-6 text-ui-shade/70">
              A community-first way to meet new people without endless swiping.
            </p>

            <ul className="mt-6 flex gap-4">
              <li>
                <a
                  href="https://www.instagram.com/0xlumore/"
                  rel="noreferrer"
                  target="_blank"
                  className="text-ui-shade transition opacity-95 hover:opacity-100"
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
                >
                  <span className="sr-only">GitHub</span>

                  <Icon name="FaGithub" className="h-6 w-6" />
                </a>
              </li>
            </ul>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:col-span-2 lg:grid-cols-4">
            <div>
              <p className="text-sm font-semibold text-ui-shade transition opacity-95 hover:opacity-100">
                Lumore
              </p>

              <ul className="mt-4 space-y-2.5 text-sm leading-6">
                <li>
                  <Link
                    href="/about"
                    className="text-ui-shade transition opacity-95 hover:opacity-100"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    href="/how-it-works"
                    className="text-ui-shade transition opacity-95 hover:opacity-100"
                  >
                    How It Works
                  </Link>
                </li>
                <li>
                  <Link
                    href="/swipeless-dating"
                    className="text-ui-shade transition opacity-95 hover:opacity-100"
                  >
                    What Is Swipeless Dating?
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blog"
                    className="text-ui-shade transition opacity-95 hover:opacity-100"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="/brand-kit"
                    className="text-ui-shade transition opacity-95 hover:opacity-100"
                  >
                    Brand Kit
                  </Link>
                </li>
                <li>
                  <Link
                    href="/place"
                    className="text-ui-shade transition opacity-95 hover:opacity-100"
                  >
                    Place Guides
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <p className="text-sm font-semibold text-ui-shade transition opacity-95 hover:opacity-100">
                Place Guides
              </p>

              <ul className="mt-4 space-y-2.5 text-sm leading-6">
                <li>
                  <Link
                    href="/place"
                    className="text-ui-shade transition opacity-95 hover:opacity-100"
                  >
                    All Place Guides
                  </Link>
                </li>
                {placeLinks.map((place) => (
                  <li key={place.slug}>
                    <Link
                      href={`/place/${place.slug}`}
                      className="text-ui-shade transition opacity-95 hover:opacity-100"
                    >
                      Dating in {place.placeName}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-sm font-semibold text-ui-shade transition opacity-95 hover:opacity-100">
                Compare
              </p>

              <ul className="mt-4 space-y-2.5 text-sm leading-6">
                <li>
                  <Link
                    href="/compare"
                    className="text-ui-shade transition opacity-95 hover:opacity-100"
                  >
                    All Comparisons
                  </Link>
                </li>
                {compareLinks.map((link) => (
                  <li key={link.slug}>
                    <Link
                      href={`/compare/${link.slug}`}
                      className="text-ui-shade transition opacity-95 hover:opacity-100"
                    >
                      Lumore vs {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-sm font-semibold text-ui-shade transition opacity-95 hover:opacity-100">
                Legal
              </p>

              <ul className="mt-4 space-y-2.5 text-sm leading-6">
                <li>
                  <a
                    href="/terms-of-use"
                    rel="noreferrer"
                    target="_blank"
                    className="text-ui-shade transition opacity-95 hover:opacity-100"
                  >
                    Terms of Use
                  </a>
                </li>
                <li>
                  <a
                    href="/privacy-policy"
                    rel="noreferrer"
                    target="_blank"
                    className="text-ui-shade transition opacity-95 hover:opacity-100"
                  >
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-8 flex max-w-screen-xl flex-col items-center justify-between gap-2 border-t border-ui-shade/10 px-4 py-5 text-center text-sm text-ui-shade/80 sm:px-6 md:flex-row md:text-left lg:px-8">
        <p>&copy; {currentYear} Lumore.xyz. All rights reserved.</p>
        <p className="inline-flex items-center gap-1">
          Made in India
          <Image
            src="/assets/india-flag.svg"
            alt="India"
            width={16}
            height={16}
            className="h-4 w-4 inline-flex"
          />
        </p>
      </div>
    </footer>
  );
}
