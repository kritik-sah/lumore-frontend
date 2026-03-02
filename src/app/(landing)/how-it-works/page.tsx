import Icon from "@/components/icon";
import { MultiStepLoader } from "@/components/ui/multi-step-loader";
import type { Metadata } from "next";

const HOW_IT_WORKS_URL = "https://www.lumore.xyz/how-it-works";
const PLAYSTORE_URL =
  "https://play.google.com/store/apps/details?id=xyz.lumore.www.twa";

const heroHighlights = [
  { label: "One thoughtful intro", value: "01" },
  { label: "Anonymous-first start", value: "Lower bias" },
  { label: "Auto-delete chats", value: "24h" },
];

const stepNav = [
  { label: "Intent", href: "#intent" },
  { label: "Anonymous chat", href: "#anonymous-chat" },
  { label: "Unlock", href: "#unlock-later" },
];

const processOfFindingRightMatch = [
  { text: "Credits check" },
  { text: "Matchmaking queue start" },
  { text: "Location + profile readiness check" },
  { text: "Preferences normalized" },
  { text: "Nearby candidates fetched" },
  { text: "Mutual interest filter" },
  { text: "Mutual age-range filter" },
  { text: "Fallback pass (if pool is low)" },
  { text: "Compatibility scoring (intent + profile + distance)" },
  { text: "Fairness boost for longer waiters" },
  { text: "Recent rematch penalty applied" },
  { text: "Best match picked + room created + both notified" },
];

const anonymousBenefits = [
  {
    title: "Less bias at the start",
    description:
      "Conversation begins without immediate visual judgment, so people can connect through tone and values first.",
    icon: "HiOutlineHeart",
  },
  {
    title: "More honest communication",
    description:
      "When the pressure to perform is lower, people tend to express what they actually want more clearly.",
    icon: "HiOutlineSparkles",
  },
  {
    title: "Calmer emotional pace",
    description:
      "Anonymous-first chat reduces social noise and helps both people decide with more clarity.",
    icon: "HiMiniClock",
  },
];

const unlockSteps = [
  {
    title: "Start anonymously",
    description: "Talk first and assess comfort without profile pressure.",
  },
  {
    title: "Mutual intent check",
    description: "Continue only if both people feel the connection.",
  },
  {
    title: "Unlock or exit respectfully",
    description: "Reveal profiles by consent, or part ways without friction.",
  },
];

const algorithmPrinciples = [
  {
    title: "Intent compatibility",
    description: "We prioritize alignment in what both people are looking for.",
    microcopy: "Applied before volume-based ranking.",
    icon: "HiOutlineHeart",
  },
  {
    title: "Context and readiness",
    description:
      "Signals about current context and openness improve timing quality.",
    microcopy: "Designed to reduce awkward mismatches.",
    icon: "HiMiniClock",
  },
  {
    title: "Local relevance",
    description: "City and proximity context support practical compatibility.",
    microcopy: "Built for people who can actually meet.",
    icon: "FaLocationDot",
  },
  {
    title: "Quality and safety signals",
    description:
      "Safety and quality cues help reduce poor introductions early.",
    microcopy: "Continuously tuned for healthier outcomes.",
    icon: "HiOutlineCheckBadge",
  },
];

const safetyControls = [
  {
    title: "Anonymous-first protective layer",
    description:
      "People chat before profile reveal, reducing instant pressure and identity-based bias.",
    icon: "LuVenetianMask",
  },
  {
    title: "24h auto chat deletion",
    description:
      "Conversations are designed with privacy in mind through automatic deletion windows.",
    icon: "HiMiniClock",
  },
  {
    title: "Report and moderation controls",
    description:
      "In-app reporting and moderation pathways help maintain safer community standards.",
    icon: "HiOutlineInformationCircle",
  },
  {
    title: "Consent-based profile unlock",
    description:
      "Profiles unlock later only when both people choose to continue.",
    icon: "HiOutlineLockOpen",
  },
];

const faqItems = [
  {
    question: "How swipeless dating works?",
    answer:
      "Swipeless dating replaces endless profile browsing with one thoughtful introduction at a time, guided by intent and conversation quality.",
  },
  {
    question: "Can I try dating without swiping?",
    answer:
      "Yes. Lumore is built for dating without swiping, so you focus on one aligned conversation instead of scrolling through volume.",
  },
  {
    question: "Do we chat anonymously first?",
    answer:
      "Yes. The first stage is anonymous-first chat, helping both people connect without immediate appearance-driven pressure.",
  },
  {
    question: "When do profiles unlock?",
    answer:
      "Profiles unlock later when both people choose to continue. If the fit is not right, either side can move on respectfully.",
  },
];

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

export const metadata: Metadata = {
  title: "How Swipeless Dating Works | Lumore",
  description:
    "Learn how swipeless dating works on Lumore: dating without swiping, anonymous first chat, unlock later flow, matching principles, and safety controls.",
  alternates: {
    canonical: HOW_IT_WORKS_URL,
  },
  openGraph: {
    title: "How Swipeless Dating Works | Lumore",
    description:
      "Understand dating without swiping: anonymous-first chat, profile unlock later, high-level matching algorithm, and safety-first controls.",
    url: HOW_IT_WORKS_URL,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "How Swipeless Dating Works | Lumore",
    description:
      "A clear guide to how swipeless dating works, from anonymous-first chat to consent-based profile unlock.",
    creator: "@0xlumore",
  },
};

export default function HowItWorksPage() {
  return (
    <main className="relative overflow-x-clip px-4 py-8 md:py-12 lg:px-0">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="mx-auto max-w-7xl">
        <section className="relative rounded-[32px] bg-ui-light/85 p-7 shadow-[0_24px_60px_rgba(0,0,0,0.08)] ring-1 ring-ui-shade/8 backdrop-blur-sm md:p-12">
          <div className="pointer-events-none absolute -top-20 -right-10 h-56 w-56 rounded-full bg-ui-primary/35 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 left-0 h-56 w-56 rounded-full bg-ui-highlight/20 blur-3xl" />

          <p className="relative text-xs font-bold uppercase tracking-[0.18em] text-ui-highlight">
            How It Works
          </p>
          <h1 className="relative mt-4 max-w-4xl text-4xl font-bold leading-[1.08] text-ui-shade md:text-6xl">
            How swipeless dating works
          </h1>
          <p className="relative mt-5 max-w-3xl text-base leading-relaxed text-ui-shade/80 md:text-xl">
            Lumore is built for dating without swiping. Instead of endless
            options, you move through a focused flow designed for clarity,
            comfort, and better conversations.
          </p>

          <div className="relative mt-8 flex flex-wrap gap-3">
            {heroHighlights.map((item) => (
              <div
                key={item.label}
                className="inline-flex items-center gap-3 rounded-full bg-ui-background/75 px-4 py-2 ring-1 ring-ui-shade/10"
              >
                <span className="text-sm font-bold text-ui-highlight">
                  {item.value}
                </span>
                <span className="text-sm font-medium text-ui-shade/85">
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          <div className="relative mt-8 overflow-hidden rounded-2xl bg-ui-background/40 p-4 ring-1 ring-ui-shade/10">
            <MultiStepLoader
              loadingStates={processOfFindingRightMatch}
              loading
              duration={1800}
              inline
            />
          </div>
        </section>

        <section className="py-6 md:py-8">
          <nav
            aria-label="How it works steps"
            className="w-full md:sticky md:top-24 md:z-30"
          >
            <div className="overflow-x-auto">
              <ul className="flex min-w-max items-center justify-start gap-2 md:justify-center">
                {stepNav.map((step, index) => (
                  <li key={step.label} className="flex items-center gap-2">
                    <a
                      href={step.href}
                      className="inline-flex items-center rounded-xl px-4 py-2 text-sm font-semibold text-ui-shade/80 transition hover:bg-ui-background/70 hover:text-ui-shade focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ui-highlight/60"
                    >
                      {step.label}
                    </a>
                    {index < stepNav.length - 1 ? (
                      <Icon
                        name="HiArrowLongRight"
                        className="hidden h-4 w-4 text-ui-shade/40 md:block"
                      />
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>
          </nav>
        </section>

        <section id="intent" className="py-12 md:py-16">
          <div className="grid items-start gap-10 md:grid-cols-[1.1fr_1fr]">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-ui-highlight">
                What is swipeless dating?
              </p>
              <h2 className="mt-3 max-w-xl text-3xl font-bold leading-tight text-ui-shade md:text-5xl">
                A calmer model than endless swipe loops.
              </h2>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-ui-shade/80 md:text-lg">
                Swipeless dating means you do not browse an endless stack of
                profiles. You get one thoughtful introduction at a time and
                decide through conversation, not rapid visual sorting.
              </p>
            </div>

            <div className="overflow-hidden rounded-3xl bg-ui-light shadow-[0_16px_40px_rgba(0,0,0,0.07)] ring-1 ring-ui-shade/10">
              <div className="grid md:grid-cols-2">
                <article className="bg-ui-background/55 p-6">
                  <p className="text-xs font-bold uppercase tracking-wide text-ui-accent">
                    Swipe-first dating
                  </p>
                  <ul className="mt-4 space-y-2 text-sm leading-relaxed text-ui-shade/80">
                    <li>High volume and constant comparison</li>
                    <li>Quick judgments based on appearance first</li>
                    <li>Decision fatigue from endless options</li>
                  </ul>
                </article>
                <article className="bg-[linear-gradient(180deg,rgba(84,19,136,0.08),rgba(255,212,0,0.14))] p-6">
                  <p className="text-xs font-bold uppercase tracking-wide text-ui-highlight">
                    Swipeless dating on Lumore
                  </p>
                  <ul className="mt-4 space-y-2 text-sm leading-relaxed text-ui-shade/85">
                    <li>Intent-first matching</li>
                    <li>One aligned introduction at a time</li>
                    <li>Depth-first conversation before profile reveal</li>
                  </ul>
                </article>
              </div>
            </div>
          </div>
        </section>

        <section id="anonymous-chat" className="py-12 md:py-16">
          <div className="rounded-[30px] bg-[linear-gradient(145deg,rgba(84,19,136,0.92),rgba(39,20,58,0.95))] p-7 text-ui-light shadow-[0_20px_55px_rgba(0,0,0,0.25)] md:p-10">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-ui-primary/90">
              Anonymous first chat
            </p>
            <h2 className="mt-3 max-w-2xl text-3xl font-bold leading-tight md:text-5xl">
              Connect with intention before appearance takes over.
            </h2>
            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-ui-light/85 md:text-base">
              Every introduction starts with anonymous chat. This creates space
              to understand vibe, intent, and communication style before
              identity details shape the interaction.
            </p>

            <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
              {anonymousBenefits.map((item) => (
                <article
                  key={item.title}
                  className="rounded-2xl bg-ui-light/8 p-5 ring-1 ring-ui-light/15 backdrop-blur-sm"
                >
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-ui-primary text-ui-shade">
                    <Icon name={item.icon} className="h-4 w-4" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ui-light/80">
                    {item.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="unlock-later" className="py-12 md:py-16">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-ui-highlight">
            Unlock later
          </p>
          <h2 className="mt-3 max-w-2xl text-3xl font-bold leading-tight text-ui-shade md:text-5xl">
            Reveal profiles only when both people want to continue.
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-relaxed text-ui-shade/80 md:text-base">
            Profile reveal happens later, only when both people want to
            continue. If alignment is not there, you can part respectfully
            without pressure.
          </p>

          <div className="relative mt-10 space-y-8 md:hidden">
            <div className="absolute left-5 top-3 h-[calc(100%-1.5rem)] w-px bg-ui-shade/20" />
            {unlockSteps.map((step, index) => (
              <article key={step.title} className="relative pl-14">
                <span className="absolute left-0 top-0 inline-flex h-10 w-10 items-center justify-center rounded-full bg-ui-highlight font-semibold text-ui-light shadow-[0_8px_20px_rgba(84,19,136,0.35)]">
                  {(index + 1).toString().padStart(2, "0")}
                </span>
                <h3 className="text-lg font-semibold text-ui-shade">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ui-shade/75">
                  {step.description}
                </p>
              </article>
            ))}
          </div>

          <div className="relative mt-12 hidden md:block">
            <div className="absolute left-[10%] right-[10%] top-7 h-px bg-gradient-to-r from-transparent via-ui-shade/25 to-transparent" />
            <div className="grid grid-cols-3 gap-8">
              {unlockSteps.map((step, index) => (
                <article key={step.title} className="relative">
                  <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-ui-highlight text-lg font-semibold text-ui-light shadow-[0_12px_24px_rgba(84,19,136,0.35)]">
                    {(index + 1).toString().padStart(2, "0")}
                  </span>
                  <h3 className="mt-5 text-xl font-semibold text-ui-shade">
                    {step.title}
                  </h3>
                  <p className="mt-3 max-w-xs text-sm leading-relaxed text-ui-shade/75">
                    {step.description}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="grid items-end gap-6 md:grid-cols-[1fr_auto]">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-ui-highlight">
                Matching algorithm
              </p>
              <h2 className="mt-3 max-w-3xl text-3xl font-bold leading-tight text-ui-shade md:text-5xl">
                High-level principles, not black-box hype.
              </h2>
              <p className="mt-4 max-w-3xl text-sm leading-relaxed text-ui-shade/80 md:text-base">
                We keep the model transparent at a principle level. Lumore does
                not optimize for endless swiping behavior; it optimizes for
                better introductions.
              </p>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2">
            {algorithmPrinciples.map((item) => (
              <article
                key={item.title}
                className="group relative overflow-hidden rounded-2xl bg-ui-light p-6 shadow-[0_14px_36px_rgba(0,0,0,0.06)] ring-1 ring-ui-shade/10"
              >
                <div className="pointer-events-none absolute -top-12 -right-10 h-28 w-28 rounded-full bg-ui-primary/25 blur-2xl transition group-hover:scale-110" />
                <div className="relative inline-flex h-10 w-10 items-center justify-center rounded-full bg-ui-highlight text-ui-light">
                  <Icon name={item.icon} className="h-4 w-4" />
                </div>
                <h3 className="relative mt-4 text-xl font-semibold text-ui-shade">
                  {item.title}
                </h3>
                <p className="relative mt-2 text-sm leading-relaxed text-ui-shade/78">
                  {item.description}
                </p>
                <p className="relative mt-4 text-xs font-medium uppercase tracking-wide text-ui-highlight/80">
                  {item.microcopy}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="py-12 md:py-16">
          <div className="relative overflow-hidden rounded-[30px] bg-ui-shade p-7 text-ui-light shadow-[0_20px_55px_rgba(0,0,0,0.22)] md:p-10">
            <div className="pointer-events-none absolute -top-24 left-1/2 h-56 w-56 -translate-x-1/2 rounded-full bg-ui-highlight/25 blur-3xl" />
            <div className="pointer-events-none absolute -right-14 bottom-0 h-48 w-48 rounded-full bg-ui-primary/20 blur-2xl" />

            <span className="relative inline-flex items-center rounded-full bg-ui-primary px-3 py-1 text-xs font-bold uppercase tracking-wide text-ui-shade">
              Trust and safety controls
            </span>
            <div className="relative mt-6 grid gap-8 md:grid-cols-[0.95fr_1.05fr] md:items-start">
              <div>
                <h2 className="text-3xl font-bold leading-tight md:text-5xl">
                  Built to protect the quality of every introduction.
                </h2>
                <p className="mt-4 max-w-md text-sm leading-relaxed text-ui-light/80 md:text-base">
                  Safety is not a separate mode. It is embedded across matching,
                  chat flow, and profile reveal decisions.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {safetyControls.map((item) => (
                  <article
                    key={item.title}
                    className="rounded-2xl bg-ui-light/8 p-5 ring-1 ring-ui-light/15 backdrop-blur-sm"
                  >
                    <div className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-ui-primary text-ui-shade">
                      <Icon name={item.icon} className="h-4 w-4" />
                    </div>
                    <h3 className="mt-3 text-sm font-semibold text-ui-light">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-xs leading-relaxed text-ui-light/78">
                      {item.description}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="faq" className="py-12 md:py-16">
          <div className="mx-auto max-w-4xl">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-ui-highlight">
              FAQ
            </p>
            <h2 className="mt-3 text-3xl font-bold text-ui-shade md:text-5xl">
              Quick answers before you try it.
            </h2>
            <dl className="mt-8 divide-y divide-ui-shade/12 rounded-2xl bg-ui-light/75 px-6 py-2 shadow-[0_12px_30px_rgba(0,0,0,0.05)] ring-1 ring-ui-shade/8 backdrop-blur-sm md:px-8">
              {faqItems.map((faq) => (
                <div key={faq.question} className="py-5 md:py-6">
                  <dt className="text-lg font-semibold text-ui-shade">
                    {faq.question}
                  </dt>
                  <dd className="mt-2 text-sm leading-relaxed text-ui-shade/78 md:text-base">
                    {faq.answer}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>

        <section className="pb-8 md:pb-14">
          <div className="relative overflow-hidden rounded-[34px] bg-[linear-gradient(135deg,rgba(84,19,136,0.96)_0%,rgba(217,3,104,0.9)_55%,rgba(255,212,0,0.88)_100%)] p-8 text-ui-light shadow-[0_28px_65px_rgba(40,20,60,0.35)] md:p-12">
            <div className="pointer-events-none absolute -top-14 right-12 h-36 w-36 rounded-full bg-ui-light/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-16 left-0 h-40 w-40 rounded-full bg-ui-shade/25 blur-3xl" />

            <h2 className="relative max-w-2xl text-3xl font-bold leading-tight md:text-5xl">
              Ready to try swipeless dating?
            </h2>
            <p className="relative mt-4 max-w-2xl text-sm leading-relaxed text-ui-light/90 md:text-lg">
              Built for real conversations, clear intent, and better outcomes
              than endless scrolling.
            </p>

            <div className="relative mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
              <a
                href={PLAYSTORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-xl bg-ui-light px-6 py-3 text-sm font-semibold text-ui-shade shadow-[0_10px_20px_rgba(0,0,0,0.2)] transition hover:translate-y-[-1px] hover:shadow-[0_14px_24px_rgba(0,0,0,0.22)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ui-light/80"
              >
                Install Lumore
              </a>
              <p className="inline-flex items-center gap-2 text-xs text-ui-light/85">
                <Icon name="HiOutlineLockClosed" className="h-4 w-4" />
                Privacy-first chat flow with consent-based unlock.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
