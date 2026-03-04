import {
  coreBenchmarkFeatures,
  compareAppSlugs,
  getCompareApp,
  type CompareAppConfig,
} from "@/lib/compareData";
import { TWITTER_CREATOR, withLandingKeywords } from "@/lib/landingSeo";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import ComparisonTable from "../../components/compare/ComparisonTable";
import CTA from "../../components/compare/CTA";
import Section from "../../components/compare/Section";

const SITE_URL = "https://www.lumore.xyz";
export const revalidate = 86400;
export const dynamic = "force-static";
export const dynamicParams = false;

type ComparePageProps = {
  params: Promise<{ app: string }>;
};

function createFaqItems(appName: string) {
  return [
    {
      question: `Is Lumore a good alternative to ${appName}?`,
      answer: `If you want dating without swiping and lower match volume with more depth, Lumore can be a strong alternative to ${appName}.`,
    },
    {
      question: "What is a no swipe dating app?",
      answer:
        "A no swipe dating app removes endless profile-card decisions and focuses on intentional introductions and conversations.",
    },
    {
      question: "How does swipeless dating work on Lumore?",
      answer:
        "Lumore uses swipeless dating with one aligned match at a time, anonymous-first chat, and mutual profile unlock by consent.",
    },
    {
      question: `Should I choose ${appName} or Lumore?`,
      answer: `Choose ${appName} if you enjoy high-volume browsing. Choose Lumore if you prefer conversation-first dating and less swipe fatigue.`,
    },
  ];
}

function getCanonicalUrl(slug: string) {
  return `${SITE_URL}/compare/${slug}`;
}

function createComparisonJsonLd(
  appName: string,
  appSlug: string,
  appData: CompareAppConfig,
) {
  const benchmarkFeatureList = coreBenchmarkFeatures.slice(0, 5);
  const lumoreFeatureList = benchmarkFeatureList.map(
    ({ label, lumoreValue }) => `${label}: ${lumoreValue}`,
  );
  const appFeatureList = benchmarkFeatureList.map(
    ({ id, label }) => `${label}: ${appData.benchmark.core[id]}`,
  );

  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `Lumore vs ${appName}: Which Dating App Is Better?`,
    description: `Comparing Lumore and ${appName} for people exploring dating without swiping.`,
    url: getCanonicalUrl(appSlug),
    isPartOf: {
      "@type": "WebSite",
      name: "Lumore",
      url: SITE_URL,
    },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          item: {
            "@type": "SoftwareApplication",
            name: "Lumore",
            applicationCategory: "DatingApplication",
            operatingSystem: "Android, iOS, Web",
            description:
              "Swipeless dating app with anonymous-first chat, one aligned match at a time, and mutual profile unlock.",
            featureList: lumoreFeatureList,
          },
        },
        {
          "@type": "ListItem",
          position: 2,
          item: {
            "@type": "SoftwareApplication",
            name: appName,
            applicationCategory: "DatingApplication",
            operatingSystem: "Android, iOS",
            description: appData.description,
            featureList: appFeatureList,
          },
        },
      ],
    },
  };
}

export function generateStaticParams() {
  return compareAppSlugs.map((app) => ({ app }));
}

export async function generateMetadata({
  params,
}: ComparePageProps): Promise<Metadata> {
  const { app } = await params;
  const appData = getCompareApp(app);

  if (!appData) {
    return {
      title: "Lumore Compare Pages",
      description:
        "Compare Lumore with leading dating apps and explore a swipeless alternative.",
      keywords: withLandingKeywords(["compare dating apps", "Lumore comparisons"]),
      alternates: {
        canonical: `${SITE_URL}/compare`,
      },
      openGraph: {
        title: "Lumore Compare Pages",
        description:
          "Compare Lumore with leading dating apps and explore a swipeless alternative.",
        url: `${SITE_URL}/compare`,
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: "Lumore Compare Pages",
        description:
          "Compare Lumore with leading dating apps and explore a swipeless alternative.",
        creator: TWITTER_CREATOR,
      },
    };
  }

  const canonicalUrl = getCanonicalUrl(app.toLowerCase());
  const title = `Lumore vs ${appData.name} - A Better Alternative to Swiping?`;
  const description = `Comparing Lumore and ${appData.name}. Discover why swipeless dating may be a better alternative to swipe-based apps.`;
  const ogImageUrl = `${SITE_URL}${appData.image}`;
  const ogImageAlt = `Lumore vs ${appData.name}`;

  return {
    title,
    description,
    keywords: withLandingKeywords([
      "compare dating apps",
      `Lumore vs ${appData.name}`,
      `${appData.name} alternative`,
      "swipeless dating alternative",
    ]),
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "website",
      images: [
        {
          url: ogImageUrl,
          alt: ogImageAlt,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: TWITTER_CREATOR,
      images: [ogImageUrl],
    },
  };
}

export default async function CompareAppPage({ params }: ComparePageProps) {
  const { app } = await params;
  const appSlug = app.toLowerCase();
  const appData = getCompareApp(app);

  if (!appData) {
    notFound();
  }

  const appName = appData.name;
  const faqItems = createFaqItems(appName);
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  const comparisonJsonLd = createComparisonJsonLd(appName, appSlug, appData);

  return (
    <main className="relative overflow-x-clip px-4 pb-14 pt-8 md:px-0 md:pb-24 md:pt-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(comparisonJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="mx-auto max-w-6xl">
        <section className="relative overflow-hidden rounded-[34px] bg-[linear-gradient(145deg,rgba(250,250,250,0.98),rgba(241,233,218,0.7))] px-6 py-8 shadow-[0_24px_58px_rgba(0,0,0,0.1)] ring-1 ring-ui-shade/10 md:px-11 md:py-12">
          <div className="pointer-events-none absolute -right-12 -top-16 h-48 w-48 rounded-full bg-ui-highlight/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 left-4 h-40 w-40 rounded-full bg-ui-primary/25 blur-3xl" />

          <p className="relative text-xs font-bold uppercase tracking-[0.14em] text-ui-highlight">
            Compare Dating Apps
          </p>
          <h1 className="relative mt-3 max-w-4xl text-4xl font-bold leading-[1.1] text-ui-shade md:text-6xl">
            Lumore vs {appName}: Which Dating App Is Better?
          </h1>
          <p className="relative mt-5 max-w-3xl text-base leading-relaxed text-ui-shade/80 md:text-xl">
            {appName} is a well-known dating app for swipe-based discovery.
            Lumore is built as a no swipe dating app for people who want dating
            without swiping, deeper conversations, and a calmer alternative to{" "}
            {appName}.
          </p>
          <p className="relative mt-4 max-w-3xl text-sm leading-relaxed text-ui-shade/75 md:text-base">
            Read the full flow on{" "}
            <Link
              href="/how-it-works"
              prefetch={false}
              className="font-semibold text-ui-highlight hover:underline"
            >
              how it works
            </Link>
            , learn our mission on{" "}
            <Link
              href="/about"
              prefetch={false}
              className="font-semibold text-ui-highlight hover:underline"
            >
              about
            </Link>
            , and explore practical guides on the{" "}
            <Link
              href="/blog"
              prefetch={false}
              className="font-semibold text-ui-highlight hover:underline"
            >
              blog
            </Link>
            .
          </p>
          <div className="relative mt-8 max-w-xl overflow-hidden rounded-2xl bg-ui-light/75 shadow-[0_16px_40px_rgba(0,0,0,0.12)] ring-1 ring-ui-shade/10">
            <div className="relative aspect-[16/9]">
              <Image
                src={appData.image}
                alt={`Lumore vs ${appName}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 640px"
                priority
                quality={80}
              />
            </div>
          </div>

          <CTA
            className="relative mt-8"
            note="Built for swipeless dating and conversation-first matching."
          />
        </section>

        <Section
          id="quick-comparison"
          tone="surface"
          eyebrow="Quick Comparison"
          title={`Lumore vs ${appName} at a glance`}
          description={`A fast feature-level comparison between Lumore and ${appName}.`}
        >
          <ComparisonTable appName={appName} benchmark={appData.benchmark} />
        </Section>

        <Section
          id="how-it-works"
          tone="alt"
          eyebrow={`How ${appName} works`}
          title={`How ${appName} works in practice`}
          description={`${appData.description} This model often fits people who prefer scale and constant profile browsing.`}
        >
          <div className="grid gap-5 md:grid-cols-[1.2fr_1fr_1fr]">
            <article className="rounded-2xl bg-ui-light/80 p-5 ring-1 ring-ui-shade/10">
              <h3 className="text-lg font-semibold text-ui-shade">
                Model overview
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-ui-shade/78">
                {appData.swipeModel
                  ? `${appName} mainly uses swipe-first discovery. People decide quickly from profile cards and only then move to chat after a match.`
                  : `${appName} uses a mixed discovery model where swiping is not the only interaction pattern.`}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-ui-shade/78">
                Across Tinder, Bumble, Hinge, and TrulyMadly, this swipe-first
                mechanic is common: fast profile decisions first, conversation
                second.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-ui-shade/78">
                Target audience: {appData.targetAudience}. Brand tone:{" "}
                {appData.brandTone}.
              </p>
            </article>

            <article className="rounded-2xl bg-ui-light/80 p-5 ring-1 ring-ui-shade/10">
              <h3 className="text-lg font-semibold text-ui-shade">Strengths</h3>
              <ul className="mt-3 space-y-2 text-sm leading-relaxed text-ui-shade/78">
                {appData.strengths.map((strength) => (
                  <li key={strength}>- {strength}</li>
                ))}
              </ul>
            </article>

            <article className="rounded-2xl bg-ui-light/80 p-5 ring-1 ring-ui-shade/10">
              <h3 className="text-lg font-semibold text-ui-shade">
                Trade-offs
              </h3>
              <ul className="mt-3 space-y-2 text-sm leading-relaxed text-ui-shade/78">
                {appData.weaknesses.map((weakness) => (
                  <li key={weakness}>- {weakness}</li>
                ))}
              </ul>
            </article>
          </div>
        </Section>

        <Section
          id="swipe-burnout"
          tone="surface"
          eyebrow="Swipe Fatigue"
          title="Why swiping can cause burnout"
          description="Swipe-first systems can work for quick discovery, but they can also create emotional and cognitive fatigue over time."
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <article className="rounded-2xl bg-ui-background/55 p-5 ring-1 ring-ui-shade/10">
              <h3 className="text-lg font-semibold text-ui-shade">
                Decision fatigue
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ui-shade/78">
                Repeated yes or no choices across many profiles can drain
                attention and reduce clarity.
              </p>
            </article>
            <article className="rounded-2xl bg-ui-background/55 p-5 ring-1 ring-ui-shade/10">
              <h3 className="text-lg font-semibold text-ui-shade">
                Validation loops
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ui-shade/78">
                Frequent checking for likes or matches can shift focus from real
                connection to app feedback cycles.
              </p>
            </article>
            <article className="rounded-2xl bg-ui-background/55 p-5 ring-1 ring-ui-shade/10">
              <h3 className="text-lg font-semibold text-ui-shade">Ghosting</h3>
              <p className="mt-2 text-sm leading-relaxed text-ui-shade/78">
                High match volume often means lower commitment per chat, which
                can increase sudden drop-offs.
              </p>
            </article>
            <article className="rounded-2xl bg-ui-background/55 p-5 ring-1 ring-ui-shade/10">
              <h3 className="text-lg font-semibold text-ui-shade">
                Appearance-first bias
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ui-shade/78">
                Fast visual filtering can overshadow personality, communication
                style, and long-term compatibility.
              </p>
            </article>
          </div>
        </Section>

        <Section
          id="lumore-difference"
          tone="contrast"
          eyebrow="How Lumore Is Different"
          title="Built for dating without swiping"
          description="Lumore is designed for people who want swipeless dating, lower noise, and better conversation quality from the first interaction."
        >
          <div className="grid gap-4 md:grid-cols-2">
            <article className="rounded-2xl bg-ui-light/10 p-5 ring-1 ring-ui-light/20 backdrop-blur-sm">
              <h3 className="text-lg font-semibold text-ui-light">
                Swipeless dating
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ui-light/82">
                Lumore removes endless card stacks and offers a no swipe dating
                app experience by design.
              </p>
            </article>
            <article className="rounded-2xl bg-ui-light/10 p-5 ring-1 ring-ui-light/20 backdrop-blur-sm">
              <h3 className="text-lg font-semibold text-ui-light">
                One aligned match at a time
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ui-light/82">
                Instead of juggling many low-context chats, you focus on one
                meaningful introduction at a time.
              </p>
            </article>
            <article className="rounded-2xl bg-ui-light/10 p-5 ring-1 ring-ui-light/20 backdrop-blur-sm">
              <h3 className="text-lg font-semibold text-ui-light">
                Anonymous-first chat
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ui-light/82">
                Conversation starts before identity reveal, helping reduce
                appearance-first pressure and bias.
              </p>
            </article>
            <article className="rounded-2xl bg-ui-light/10 p-5 ring-1 ring-ui-light/20 backdrop-blur-sm">
              <h3 className="text-lg font-semibold text-ui-light">
                Mutual unlock and consent-driven reveal
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ui-light/82">
                Profiles unlock only when both people choose to continue, which
                supports safer and more intentional dating without swiping.
              </p>
            </article>
          </div>
        </Section>

        <Section
          id="who-should-use-which"
          tone="alt"
          eyebrow="Who Should Use Which?"
          title={`Use ${appName} or Lumore based on your style`}
        >
          <div className="grid gap-5 md:grid-cols-2">
            <article className="rounded-2xl bg-ui-light/85 p-6 ring-1 ring-ui-shade/10">
              <h3 className="text-xl font-semibold text-ui-shade">
                Use {appName} if:
              </h3>
              <ul className="mt-4 space-y-2 text-sm leading-relaxed text-ui-shade/80 md:text-base">
                <li>- You enjoy browsing lots of profiles.</li>
                <li>- You prefer high-volume matching.</li>
                <li>- You want a broad discovery feed in less time.</li>
                <li>- You value {appData.strengths[0]?.toLowerCase()}.</li>
              </ul>
            </article>

            <article className="rounded-2xl bg-ui-light/85 p-6 ring-1 ring-ui-shade/10">
              <h3 className="text-xl font-semibold text-ui-shade">
                Use Lumore if:
              </h3>
              <ul className="mt-4 space-y-2 text-sm leading-relaxed text-ui-shade/80 md:text-base">
                <li>- You are tired of swipe fatigue.</li>
                <li>- You want depth over volume.</li>
                <li>- You prefer conversation-first matching.</li>
                <li>- You are looking for dating without swiping.</li>
              </ul>
            </article>
          </div>
        </Section>

        <Section
          id="faq"
          tone="surface"
          eyebrow="FAQ"
          title={`Frequently asked questions about Lumore vs ${appName}`}
          contentClassName="mt-6"
        >
          <dl className="rounded-2xl bg-ui-background/45 p-2 ring-1 ring-ui-shade/10">
            {faqItems.map((item) => (
              <div
                key={item.question}
                className="border-b border-ui-shade/10 px-4 py-5 last:border-b-0 md:px-6"
              >
                <dt className="text-base font-semibold text-ui-shade md:text-lg">
                  {item.question}
                </dt>
                <dd className="mt-2 text-sm leading-relaxed text-ui-shade/78 md:text-base">
                  {item.answer}
                </dd>
              </div>
            ))}
          </dl>
        </Section>

        <section className="py-8 md:py-10">
          <div className="relative overflow-hidden rounded-[34px] bg-[linear-gradient(130deg,rgba(84,19,136,0.95),rgba(217,3,104,0.88),rgba(255,212,0,0.82))] px-6 py-8 text-ui-light shadow-[0_30px_70px_rgba(32,18,48,0.36)] md:px-11 md:py-12">
            <div className="pointer-events-none absolute -right-10 -top-14 h-40 w-40 rounded-full bg-ui-light/20 blur-3xl" />
            <div className="pointer-events-none absolute -left-10 -bottom-16 h-44 w-44 rounded-full bg-ui-shade/35 blur-3xl" />

            <h2 className="relative max-w-2xl text-3xl font-bold leading-tight md:text-5xl">
              Ready to Try Dating Without Swiping?
            </h2>
            <p className="relative mt-4 max-w-2xl text-sm leading-relaxed text-ui-light/90 md:text-base">
              Switch from endless browsing to swipeless dating designed for
              intent, consent, and better conversations.
            </p>

            <CTA label="Try Lumore" className="relative mt-7" />
          </div>
        </section>
      </div>
    </main>
  );
}
