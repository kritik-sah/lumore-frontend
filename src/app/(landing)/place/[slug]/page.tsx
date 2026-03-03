import {
  getPlaceArticleBySlug,
  getPlaceArticleSlugs,
  toAbsolutePlaceUrl,
} from "@/lib/placeArticles";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PlaceHeroCarousel from "./PlaceHeroCarousel";

type PlaceArticlePageProps = {
  params: Promise<{ slug: string }>;
};

type MatchingStepFallback = {
  step: string;
  title: string;
  points: string[];
};

type AreaFallback = {
  name: string;
  description: string;
  dateIdeas: string[];
};

type ComparisonFallback = {
  label: string;
  typical: string;
  lumore: string;
};

type FaqFallback = {
  q: string;
  a: string;
};

function withFallback<T>(items: T[] | undefined, fallback: T[]): T[] {
  if (Array.isArray(items) && items.length > 0) {
    return items;
  }

  return fallback;
}

function defaultWhyBullets(placeName: string): string[] {
  return [
    `High volume dating in ${placeName} can create low attention per conversation.`,
    "Profile-first matching often ignores communication style and intent.",
    "People want local, practical plans, but most platforms optimize for scrolling.",
  ];
}

function defaultMatchingSteps(placeName: string): MatchingStepFallback[] {
  return [
    {
      step: "1",
      title: `Join the ${placeName} pool`,
      points: [
        "Share preferences and intent.",
        "Get placed into a local matching queue.",
      ],
    },
    {
      step: "2",
      title: "Receive your best fit",
      points: [
        "Compatibility and proximity are weighed together.",
        "You focus on one meaningful introduction at a time.",
      ],
    },
    {
      step: "3",
      title: "Talk first, unlock later",
      points: [
        "Start with anonymous-first chat.",
        "Unlock profiles only with mutual consent.",
      ],
    },
  ];
}

function defaultAreas(placeName: string): AreaFallback[] {
  return [
    {
      name: `${placeName} Central`,
      description:
        "A practical area for quick first meets and post-work conversations.",
      dateIdeas: ["Coffee meet", "Short walk and talk"],
    },
    {
      name: `${placeName} West`,
      description:
        "Social but not overwhelming, with many low-pressure date options.",
      dateIdeas: ["Cafe + dessert", "Sunset street walk"],
    },
  ];
}

function defaultComparisonRows(): ComparisonFallback[] {
  return [
    {
      label: "Discovery",
      typical: "Infinite swipes and quick filtering",
      lumore: "One aligned introduction at a time",
    },
    {
      label: "Conversation quality",
      typical: "Many shallow chat starts",
      lumore: "Fewer but deeper conversations",
    },
    {
      label: "Safety model",
      typical: "Immediate profile exposure",
      lumore: "Anonymous-first with mutual unlock",
    },
  ];
}

function defaultFaqs(placeName: string): FaqFallback[] {
  return [
    {
      q: `How can I meet serious singles in ${placeName}?`,
      a: "Use intent-led matching and prioritize one quality conversation at a time.",
    },
    {
      q: `Is dating in ${placeName} possible without swiping?`,
      a: "Yes. Lumore supports a swipeless flow with one best local match at a time.",
    },
  ];
}

export async function generateStaticParams() {
  const slugs = await getPlaceArticleSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PlaceArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getPlaceArticleBySlug(slug);

  if (!article) {
    return {
      title: "Place Article Not Found | Lumore",
      description: "This place guide could not be found.",
    };
  }

  const canonicalUrl = toAbsolutePlaceUrl(article.seo.canonical);
  const ogImage = article.seo.ogImage
    ? toAbsolutePlaceUrl(article.seo.ogImage)
    : undefined;

  return {
    title: article.seo.title,
    description: article.seo.description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: article.seo.title,
      description: article.seo.description,
      url: canonicalUrl,
      type: "article",
      images: ogImage
        ? [
            {
              url: ogImage,
              alt:
                article.hero.heroImages[0]?.alt ||
                `Dating in ${article.placeName}`,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: article.seo.title,
      description: article.seo.description,
      images: ogImage ? [ogImage] : undefined,
      creator: "@0xlumore",
    },
  };
}

export default async function PlaceArticlePage({
  params,
}: PlaceArticlePageProps) {
  const { slug } = await params;
  const article = await getPlaceArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  const whyBullets = withFallback(
    article.why.bullets,
    defaultWhyBullets(article.placeName),
  );
  const matchingSteps = withFallback(
    article.matching.steps,
    defaultMatchingSteps(article.placeName),
  );
  const scoringFactors = withFallback(article.matching.scoringFactors, [
    "Intent",
    "Lifestyle",
    "Preferences",
    "Distance",
  ]);
  const areas = withFallback(
    article.areas.items,
    defaultAreas(article.placeName),
  );
  const eventTypes = withFallback(article.events.types, [
    "Coffee meetups",
    "Community game nights",
    "Walk and talk circles",
  ]);
  const communityFeatures = withFallback(article.community.features, [
    "Local city circles",
    "Conversation-first intros",
    "Event-led social pathways",
  ]);
  const safetyItems = withFallback(article.community.safety, [
    "Report and block",
    "Blur/unlock identity flow",
    "Active moderation",
  ]);
  const comparisonRows = withFallback(
    article.comparison.rows,
    defaultComparisonRows(),
  );
  const faqItems = withFallback(
    article.faqs.items,
    defaultFaqs(article.placeName),
  );

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  const eventCta = article.events.cta ?? {
    label: `Explore ${article.placeName} events`,
    href: "/events",
  };
  const closingCta = article.closing.cta ?? {
    label: `Start matching in ${article.placeName}`,
    href: "/app",
  };

  return (
    <main className="px-4 py-8 md:py-12 lg:px-0">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="mx-auto max-w-7xl space-y-7">
        <section className="overflow-hidden rounded-[30px] border border-ui-shade/10 bg-ui-light p-5 shadow-[0_18px_45px_rgba(0,0,0,0.08)] md:p-9">
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <p className="inline-flex rounded-full bg-ui-primary px-3 py-1 text-xs font-bold uppercase tracking-wide text-ui-shade">
                Place Guide
              </p>
              <h1 className="mt-4 text-3xl font-bold leading-tight text-ui-shade md:text-5xl">
                {article.hero.headline}
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-relaxed text-ui-shade/80 md:text-lg">
                {article.hero.subheadline}
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href={article.hero.primaryCta.href}
                  className="inline-flex items-center justify-center rounded-xl bg-ui-shade px-5 py-3 text-sm font-semibold text-ui-light transition hover:opacity-90"
                >
                  {article.hero.primaryCta.label}
                </Link>
                <Link
                  href={article.hero.secondaryCta.href}
                  className="inline-flex items-center justify-center rounded-xl border border-ui-shade/20 bg-ui-background px-5 py-3 text-sm font-semibold text-ui-shade transition hover:border-ui-highlight"
                >
                  {article.hero.secondaryCta.label}
                </Link>
              </div>
            </div>

            <div className="relative min-h-[260px] overflow-hidden rounded-2xl border border-ui-shade/10 bg-ui-background md:min-h-[380px]">
              <PlaceHeroCarousel
                images={article.hero.heroImages}
                placeName={article.placeName}
              />
            </div>
          </div>
        </section>

        <section className="rounded-[24px] border border-ui-shade/10 bg-ui-background/45 p-5 md:p-8">
          <h2 className="text-2xl font-bold text-ui-shade md:text-4xl">
            {article.why.title}
          </h2>
          <p className="mt-3 max-w-4xl text-sm leading-relaxed text-ui-shade/80 md:text-base">
            {article.why.intro}
          </p>
          <div className="mt-6 grid gap-3 md:grid-cols-3">
            {whyBullets.map((bullet) => (
              <article
                key={bullet}
                className="rounded-xl border border-ui-shade/10 bg-ui-light p-4 text-sm leading-relaxed text-ui-shade/80"
              >
                {bullet}
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-[24px] border border-ui-shade/10 bg-ui-light p-5 md:p-8">
          <h2 className="text-2xl font-bold text-ui-shade md:text-4xl">
            {article.matching.title}
          </h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {scoringFactors.map((factor) => (
              <span
                key={factor}
                className="inline-flex rounded-full bg-ui-background px-3 py-1 text-xs font-semibold text-ui-shade/80 ring-1 ring-ui-shade/10"
              >
                {factor}
              </span>
            ))}
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {matchingSteps.map((step) => (
              <article
                key={`${step.step}-${step.title}`}
                className="rounded-xl border border-ui-shade/10 bg-ui-background/40 p-4"
              >
                <span className="inline-flex rounded-full bg-ui-highlight px-3 py-1 text-xs font-bold text-ui-light">
                  Step {step.step}
                </span>
                <h3 className="mt-3 text-lg font-semibold text-ui-shade">
                  {step.title}
                </h3>
                <ul className="mt-3 space-y-2 text-sm leading-relaxed text-ui-shade/80">
                  {step.points.map((point) => (
                    <li key={point}>- {point}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-[24px] border border-ui-shade/10 bg-ui-background/45 p-5 md:p-8">
          <h2 className="text-2xl font-bold text-ui-shade md:text-4xl">
            {article.areas.title}
          </h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {areas.map((area) => (
              <article
                key={area.name}
                className="rounded-xl border border-ui-shade/10 bg-ui-light p-4"
              >
                <h3 className="text-lg font-semibold text-ui-shade">
                  {area.name}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ui-shade/80">
                  {area.description}
                </p>
                <ul className="mt-3 space-y-1 text-sm text-ui-shade/75">
                  {area.dateIdeas.map((idea) => (
                    <li key={idea}>- {idea}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-[24px] border border-ui-shade/10 bg-ui-light p-5 md:p-8">
          <h2 className="text-2xl font-bold text-ui-shade md:text-4xl">
            {article.events.title}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-ui-shade/80 md:text-base">
            {article.events.intro}
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {eventTypes.map((eventType) => (
              <article
                key={eventType}
                className="rounded-xl border border-ui-shade/10 bg-ui-background/40 p-4 text-sm font-medium text-ui-shade/85"
              >
                {eventType}
              </article>
            ))}
          </div>
          <Link
            href={eventCta.href}
            className="mt-6 inline-flex rounded-xl bg-ui-shade px-5 py-3 text-sm font-semibold text-ui-light transition hover:opacity-90"
          >
            {eventCta.label}
          </Link>
        </section>

        <section className="rounded-[24px] border border-ui-shade/10 bg-ui-background/45 p-5 md:p-8">
          <h2 className="text-2xl font-bold text-ui-shade md:text-4xl">
            {article.community.title}
          </h2>
          <div className="mt-6 grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="space-y-3">
              {communityFeatures.map((feature) => (
                <article
                  key={feature}
                  className="rounded-xl border border-ui-shade/10 bg-ui-light p-4 text-sm leading-relaxed text-ui-shade/85"
                >
                  {feature}
                </article>
              ))}
            </div>
            <div className="rounded-xl border border-ui-shade/10 bg-ui-light p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-ui-highlight">
                Safety
              </p>
              <ul className="mt-3 space-y-2 text-sm text-ui-shade/80">
                {safetyItems.map((item) => (
                  <li
                    key={item}
                    className="rounded-lg bg-ui-background/50 px-3 py-2"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="rounded-[24px] border border-ui-shade/10 bg-ui-light p-5 md:p-8">
          <h2 className="text-2xl font-bold text-ui-shade md:text-4xl">
            {article.comparison.title}
          </h2>
          <div className="mt-6 overflow-x-auto rounded-xl border border-ui-shade/10">
            <table className="min-w-full divide-y divide-ui-shade/10">
              <thead className="bg-ui-background/65">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-ui-shade/75">
                    Criteria
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-ui-shade/75">
                    Typical apps
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-ui-shade/75">
                    Lumore
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ui-shade/10 bg-ui-light">
                {comparisonRows.map((row) => (
                  <tr key={row.label}>
                    <td className="px-4 py-3 text-sm font-semibold text-ui-shade">
                      {row.label}
                    </td>
                    <td className="px-4 py-3 text-sm text-ui-shade/75">
                      {row.typical}
                    </td>
                    <td className="px-4 py-3 text-sm text-ui-shade/90">
                      {row.lumore}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="rounded-[24px] border border-ui-shade/10 bg-ui-background/45 p-5 md:p-8">
          <h2 className="text-2xl font-bold text-ui-shade md:text-4xl">
            {article.faqs.title}
          </h2>
          <div className="mt-5 space-y-3">
            {faqItems.map((faq) => (
              <details
                key={faq.q}
                className="group rounded-xl border border-ui-shade/10 bg-ui-light px-4 py-3"
              >
                <summary className="cursor-pointer list-none pr-8 text-sm font-semibold text-ui-shade md:text-base">
                  {faq.q}
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-ui-shade/80">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </section>

        <section className="pb-6">
          <div className="rounded-[26px] bg-[linear-gradient(130deg,rgba(84,19,136,0.95),rgba(217,3,104,0.86),rgba(255,212,0,0.86))] p-6 text-ui-light shadow-[0_20px_50px_rgba(0,0,0,0.24)] md:p-10">
            <h2 className="text-3xl font-bold leading-tight md:text-5xl">
              {article.closing.title}
            </h2>
            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-ui-light/90 md:text-lg">
              {article.closing.subtext}
            </p>
            <Link
              href={closingCta.href}
              className="mt-7 inline-flex rounded-xl bg-ui-light px-5 py-3 text-sm font-semibold text-ui-shade transition hover:opacity-90"
            >
              {closingCta.label}
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
