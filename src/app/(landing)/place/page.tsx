import { getAllPlaceArticles, toAbsolutePlaceUrl } from "@/lib/placeArticles";
import type { Metadata } from "next";
import Link from "next/link";

const PLACE_INDEX_URL = toAbsolutePlaceUrl("/place");

export const metadata: Metadata = {
  title: "Dating by City | Lumore Place Guides",
  description:
    "Explore local dating guides by city and neighborhood with swipeless matching, community events, and practical dating insights.",
  alternates: {
    canonical: PLACE_INDEX_URL,
  },
  openGraph: {
    title: "Dating by City | Lumore Place Guides",
    description:
      "Browse Lumore place landing pages for local dating insights, nearby neighborhoods, and offline singles events.",
    url: PLACE_INDEX_URL,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dating by City | Lumore Place Guides",
    description:
      "City-based dating guides for swipeless matching, local insights, and better real-world connections.",
    creator: "@0xlumore",
  },
};

export default async function PlaceIndexPage() {
  const placeArticles = await getAllPlaceArticles();

  return (
    <main className="px-4 py-8 md:py-12 lg:px-0">
      <div className="mx-auto max-w-6xl space-y-6">
        <section className="rounded-[30px] border border-ui-shade/10 bg-ui-light p-6 shadow-[0_16px_42px_rgba(0,0,0,0.08)] md:p-9">
          <p className="text-xs font-bold uppercase tracking-wide text-ui-highlight">
            Place Articles
          </p>
          <h1 className="mt-3 text-3xl font-bold text-ui-shade md:text-5xl">
            Dating Guides by City and Neighborhood
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-ui-shade/80 md:text-base">
            Choose your local guide to explore swipeless dating in your area,
            nearby neighborhoods, offline events, and practical first-date
            ideas.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          {placeArticles.map((article) => (
            <article
              key={article.slug}
              className="rounded-2xl border border-ui-shade/10 bg-ui-background/45 p-5"
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-ui-highlight">
                {article.region}, {article.country}
              </p>
              <h2 className="mt-2 text-2xl font-bold text-ui-shade">
                {article.placeName}
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-ui-shade/78">
                {article.seo.description}
              </p>
              <Link
                href={`/place/${article.slug}`}
                className="mt-5 inline-flex rounded-xl bg-ui-shade px-4 py-2 text-sm font-semibold text-ui-light transition hover:opacity-90"
              >
                Read guide
              </Link>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
