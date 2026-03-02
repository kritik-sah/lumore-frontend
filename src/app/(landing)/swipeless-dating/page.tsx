import Icon from "@/components/icon";
import type { Metadata } from "next";
import Link from "next/link";

const PAGE_URL = "https://www.lumore.xyz/swipeless-dating";
const PLAYSTORE_URL =
  "https://play.google.com/store/apps/details?id=xyz.lumore.www.twa";

const heroBenefits = [
  "No swipe dating app experience",
  "One aligned match at a time",
  "Anonymous-first conversation",
  "Unlock only if both choose",
];

const burnoutPoints = [
  {
    title: "Decision Fatigue",
    body: "Endless profiles overwhelm the brain. Too many options often reduce satisfaction and make clear choices harder.",
  },
  {
    title: "Validation Loops",
    body: "Matches become dopamine hits. Conversations become disposable, and depth gets replaced by quick feedback cycles.",
  },
  {
    title: "Appearance-First Bias",
    body: "Swipe culture trains users to judge in seconds, before intent, values, or communication style can be understood.",
  },
  {
    title: "Emotional Exhaustion",
    body: "When people feel replaceable, ghosting rises and genuine connection starts to feel harder each week.",
  },
];

const lumoreSteps = [
  {
    title: "Step 1 - Set Your Intent",
    body: "Tell us what you're looking for.",
  },
  {
    title: "Step 2 - Enter the Matching Pool",
    body: "Tap Start Matching.",
  },
  {
    title: "Step 3 - Get One Aligned Match",
    body: "We match by goals, preferences, and location context.",
  },
  {
    title: "Step 4 - Chat Anonymously First",
    body: "No instant profile judgment.",
  },
  {
    title: "Step 5 - Unlock Only If It Feels Right",
    body: "Profiles reveal by mutual consent.",
  },
];

const faqItems = [
  {
    question: "What is swipeless dating?",
    answer:
      "Swipeless dating is a model where you do not scroll through endless profiles. You receive one curated introduction at a time and decide through conversation.",
  },
  {
    question: "Is there a dating app without swiping?",
    answer:
      "Yes. Lumore is a no swipe dating app built around focused introductions and conversation-first matching.",
  },
  {
    question: "How does a no swipe dating app work?",
    answer:
      "You set intent, join the pool, receive one aligned match, chat anonymously first, then unlock profiles only if both users choose.",
  },
  {
    question: "Is dating without swiping better?",
    answer:
      "For many people, yes. It often reduces decision fatigue, lowers pressure, and increases conversation depth.",
  },
  {
    question: "Does swipeless dating reduce ghosting?",
    answer:
      "It can reduce ghosting by removing volume-driven behavior and emphasizing intent-based, one-at-a-time introductions.",
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
  title:
    "What Is Swipeless Dating? A Better Way to Date Without Swiping | Lumore",
  description:
    "Swipeless dating is a better way to date without swiping. Learn how no swipe dating apps reduce burnout, improve conversations, and help you find aligned matches.",
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    title: "What Is Swipeless Dating? A Better Way to Date Without Swiping",
    description:
      "Learn why dating without swiping can reduce burnout and improve alignment through conversation-first matching.",
    url: PAGE_URL,
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "What Is Swipeless Dating? A Better Way to Date Without Swiping",
    description:
      "A practical guide to swipeless dating, swipe fatigue, and a healthier no-swipe dating app model.",
    creator: "@0xlumore",
  },
};

export default function WhatIsSwipelessDatingPage() {
  return (
    <main className="bg-ui-light">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <article className="mx-auto max-w-5xl px-4 py-10 md:py-16">
        <section className="rounded-[28px] bg-[linear-gradient(180deg,rgba(84,19,136,0.08)_0%,rgba(255,212,0,0.08)_100%)] p-7 md:p-10">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-ui-highlight">
            Swipeless Dating Guide
          </p>
          <h1 className="mt-3 text-4xl font-bold leading-[1.1] text-ui-shade md:text-6xl">
            What Is Swipeless Dating? A Better Way to Date Without Swiping
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-ui-shade/80 md:text-xl">
            Swipeless dating replaces endless profile scrolling with one
            meaningful introduction at a time. No swiping. No decision fatigue.
            Just focused conversations.
          </p>

          <ul className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {heroBenefits.map((item) => (
              <li
                key={item}
                className="inline-flex items-center gap-2 rounded-full bg-ui-light/75 px-4 py-2 text-sm font-medium text-ui-shade ring-1 ring-ui-shade/10"
              >
                <Icon
                  name="HiOutlineCheck"
                  className="h-4 w-4 flex-shrink-0 text-ui-highlight"
                />
                {item}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href={PLAYSTORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-xl bg-ui-highlight px-5 py-3 font-semibold text-ui-light transition hover:bg-ui-highlight/90"
            >
              Try Swipeless Dating
            </a>
            <Link
              href="/about"
              className="text-sm font-semibold text-ui-shade underline-offset-4 hover:underline"
            >
              Learn About Lumore
            </Link>
          </div>
        </section>

        <section className="mt-16 border-t border-ui-shade/10 pt-12">
          <h2 className="text-3xl font-bold text-ui-shade md:text-4xl">
            What Is Swipeless Dating?
          </h2>
          <div className="mt-5 max-w-3xl space-y-4 text-base leading-relaxed text-ui-shade/80">
            <p>
              Swipeless dating is a model of dating without swiping. Instead of
              browsing hundreds of profiles, you receive one curated
              introduction at a time based on intent, compatibility, and
              context.
            </p>
            <p>
              Unlike swipe-based apps that prioritize engagement and endless
              scrolling, the swipeless dating model prioritizes alignment and
              conversation depth.
            </p>
            <p>
              For people searching for a no swipe dating app, this creates a
              calmer and more intentional way to connect.
            </p>
          </div>
        </section>

        <section className="mt-16 border-t border-ui-shade/10 pt-12">
          <h2 className="text-3xl font-bold text-ui-shade md:text-4xl">
            Why Swipe-Based Dating Causes Burnout
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
            {burnoutPoints.map((point) => (
              <article key={point.title} className="space-y-2">
                <h3 className="text-xl font-semibold text-ui-shade">
                  {point.title}
                </h3>
                <p className="text-sm leading-relaxed text-ui-shade/80 md:text-base">
                  {point.body}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-16 rounded-[28px] bg-ui-background/45 p-7 md:p-10">
          <h2 className="text-3xl font-bold text-ui-shade md:text-4xl">
            What Is the Alternative to Swiping?
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-ui-shade/80">
            Swipeless dating flips the model: one introduction at a time,
            conversation before profile reveal, mutual unlock, and graceful exit
            without pressure.
          </p>
          <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <li className="rounded-xl bg-ui-light px-4 py-3 text-sm text-ui-shade">
              Lower anxiety
            </li>
            <li className="rounded-xl bg-ui-light px-4 py-3 text-sm text-ui-shade">
              Higher conversation depth
            </li>
            <li className="rounded-xl bg-ui-light px-4 py-3 text-sm text-ui-shade">
              Less ghosting behavior
            </li>
            <li className="rounded-xl bg-ui-light px-4 py-3 text-sm text-ui-shade">
              Better alignment
            </li>
          </ul>
        </section>

        <section className="mt-16 border-t border-ui-shade/10 pt-12">
          <h2 className="text-3xl font-bold text-ui-shade md:text-4xl">
            How Lumore Makes Swipeless Dating Real
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-ui-shade/80">
            Lumore is a swipeless dating app built for people who want dating
            without swiping and a no swipe dating app experience with clearer
            intent.
          </p>
          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
            {lumoreSteps.map((step) => (
              <article
                key={step.title}
                className="rounded-2xl bg-ui-background/35 px-5 py-4 ring-1 ring-ui-shade/10"
              >
                <h3 className="text-base font-semibold text-ui-shade">
                  {step.title}
                </h3>
                <p className="mt-1 text-sm text-ui-shade/80">{step.body}</p>
              </article>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-4 text-sm font-medium">
            <Link href="/how-it-works" className="text-ui-highlight underline">
              See full process
            </Link>
            <Link href="/about" className="text-ui-highlight underline">
              Why we built this
            </Link>
          </div>
        </section>

        <section className="mt-16 border-t border-ui-shade/10 pt-12">
          <h2 className="text-3xl font-bold text-ui-shade md:text-4xl">
            Swipeless Dating vs Swipe Dating Apps
          </h2>
          <div className="mt-6 overflow-hidden rounded-2xl ring-1 ring-ui-shade/10">
            <table className="w-full border-collapse text-left text-sm md:text-base">
              <thead className="bg-ui-background/55">
                <tr>
                  <th className="px-4 py-3 font-semibold text-ui-shade">
                    Swipe Apps
                  </th>
                  <th className="px-4 py-3 font-semibold text-ui-shade">
                    Swipeless Dating
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t border-ui-shade/10">
                  <td className="px-4 py-3 text-ui-shade/80">
                    Endless profiles
                  </td>
                  <td className="px-4 py-3 text-ui-shade/80">
                    One introduction at a time
                  </td>
                </tr>
                <tr className="border-t border-ui-shade/10">
                  <td className="px-4 py-3 text-ui-shade/80">
                    Appearance-first
                  </td>
                  <td className="px-4 py-3 text-ui-shade/80">
                    Conversation-first
                  </td>
                </tr>
                <tr className="border-t border-ui-shade/10">
                  <td className="px-4 py-3 text-ui-shade/80">High ghosting</td>
                  <td className="px-4 py-3 text-ui-shade/80">
                    Intent-based alignment
                  </td>
                </tr>
                <tr className="border-t border-ui-shade/10">
                  <td className="px-4 py-3 text-ui-shade/80">
                    Addictive scrolling
                  </td>
                  <td className="px-4 py-3 text-ui-shade/80">
                    Focused interaction
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-16 border-t border-ui-shade/10 pt-12">
          <h2 className="text-3xl font-bold text-ui-shade md:text-4xl">
            Who Is Swipeless Dating For?
          </h2>
          <ul className="mt-6 space-y-3 text-base text-ui-shade/80">
            <li>Professionals tired of swipe fatigue</li>
            <li>People who want depth over volume</li>
            <li>Introverts who prefer conversation-first flow</li>
            <li>Women seeking safer introductions</li>
          </ul>
        </section>

        <section className="mt-16 rounded-[28px] bg-[linear-gradient(180deg,rgba(84,19,136,0.06)_0%,rgba(255,212,0,0.10)_100%)] p-7 md:p-10">
          <h2 className="text-3xl font-bold text-ui-shade md:text-4xl">
            Frequently Asked Questions About Swipeless Dating
          </h2>
          <div className="mt-7 space-y-5">
            {faqItems.map((item) => (
              <article key={item.question}>
                <h3 className="text-lg font-semibold text-ui-shade">
                  {item.question}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ui-shade/80 md:text-base">
                  {item.answer}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-16 border-t border-ui-shade/10 pt-12">
          <h2 className="text-3xl font-bold text-ui-shade md:text-4xl">
            Ready to Try Dating Without Swiping?
          </h2>
          <p className="mt-3 text-base leading-relaxed text-ui-shade/80 md:text-lg">
            You don&apos;t need 100 matches. You need one aligned introduction.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <a
              href={PLAYSTORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-xl bg-ui-highlight px-5 py-3 font-semibold text-ui-light transition hover:bg-ui-highlight/90"
            >
              Try Lumore - The Swipeless Dating App
            </a>
            <p className="text-xs text-ui-shade/70">
              Privacy-first flow. Consent-based unlock. One match at a time.
            </p>
          </div>
        </section>

        <section className="mt-14 border-t border-ui-shade/10 pt-8">
          <h2 className="text-xl font-semibold text-ui-shade">Read Next</h2>
          <div className="mt-4 flex flex-wrap gap-4 text-sm">
            <Link href="/blog" className="text-ui-highlight underline">
              Blog hub
            </Link>
          </div>
        </section>
      </article>
    </main>
  );
}
