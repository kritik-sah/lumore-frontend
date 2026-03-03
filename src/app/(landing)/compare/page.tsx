import { compareAppSlugs, compareData } from "@/lib/compareData";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

const COMPARE_URL = "https://www.lumore.xyz/compare";

const dummyImages = [
  "/assets/1.png",
  "/assets/2.png",
  "/assets/3.png",
  "/assets/tired-of-endless-swiping.png",
];

const compareList = compareAppSlugs.map((slug, index) => {
  const app = compareData[slug];
  return {
    slug,
    name: app.name,
    description: app.description,
    audience: app.targetAudience,
    image: dummyImages[index % dummyImages.length],
  };
});

export const metadata: Metadata = {
  title: "Compare Dating Apps | Lumore",
  description:
    "Explore Lumore comparisons with Tinder, Bumble, Hinge, and TrulyMadly. Find a better way to date without swiping.",
  alternates: {
    canonical: COMPARE_URL,
  },
  openGraph: {
    title: "Compare Dating Apps | Lumore",
    description:
      "Compare Lumore with popular dating apps and discover a swipeless, conversation-first alternative.",
    url: COMPARE_URL,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Compare Dating Apps | Lumore",
    description:
      "Browse Lumore comparison pages for Tinder, Bumble, Hinge, and TrulyMadly.",
    creator: "@0xlumore",
  },
};

export default function CompareListingPage() {
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Lumore comparison pages",
    itemListElement: compareList.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: `Lumore vs ${item.name}`,
      url: `${COMPARE_URL}/${item.slug}`,
    })),
  };

  return (
    <main className="px-4 py-8 md:py-12 lg:px-0">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />

      <div className="mx-auto max-w-7xl">
        <section className="rounded-[28px] border border-ui-shade/10 bg-ui-light p-6 shadow-[0_14px_35px_rgba(0,0,0,0.06)] md:p-8">
          <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-2">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-ui-highlight">
                Compare Lumore
              </p>
              <h1 className="mt-2 text-3xl font-bold text-ui-shade md:text-4xl">
                Find the right app for your dating style.
              </h1>
            </div>
            <p className="text-sm leading-relaxed text-ui-shade/80 md:text-base">
              Explore detailed comparisons between Lumore and popular dating
              apps. See how swipeless dating differs from swipe-first products
              across privacy, safety, intent, and overall experience.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {compareList.map((item) => (
              <Link
                key={item.slug}
                href={`/compare/${item.slug}`}
                className="group rounded-xl border border-ui-shade/10 bg-ui-light p-4 transition hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(0,0,0,0.09)]"
              >
                <div className="relative overflow-hidden rounded-xl border border-ui-shade/10 bg-ui-background/45">
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={item.image}
                      alt={`Lumore vs ${item.name}`}
                      fill
                      className="object-cover transition duration-300 group-hover:scale-[1.03]"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                  </div>
                </div>
                <h2 className="mt-4 text-base font-semibold text-ui-shade">
                  Lumore vs {item.name}
                </h2>
                <p className="mt-1 text-xs uppercase tracking-wide text-ui-highlight/80">
                  Compare Guide
                </p>
                <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ui-shade/75">
                  {item.description}
                </p>
                <p className="mt-2 line-clamp-2 text-xs text-ui-shade/65">
                  Best for: {item.audience}
                </p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
