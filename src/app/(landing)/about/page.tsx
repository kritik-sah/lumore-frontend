import Icon from "@/components/icon";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

const ABOUT_URL = "https://www.lumore.xyz/about";

const founder = {
  name: "Kritik Sah",
  role: "Founder, CTO",
  story:
    "I started Lumore after watching how quickly modern dating turned into performance. In crowded cities, people are connected to everyone and known by no one. Lumore is my attempt to rebuild trust in how people meet: clear intent, calm introductions, and conversations that feel human before they feel judged.",
  imageSrc: "/assets/founder-portrait.png",
};

const trustStats = [
  {
    value: "01",
    label: "One introduction",
    note: "A focused, swipeless flow",
  },
  {
    value: "24h",
    label: "Private conversations",
    note: "Auto-delete chat for emotional safety",
  },
  {
    value: "City-first",
    label: "Local alignment",
    note: "People nearby with shared direction",
  },
];

const swipelessReasons = [
  {
    title: "Conversation before comparison",
    icon: "HiOutlineHeart",
    description:
      "Most platforms start with instant visual judgment. We start with intent and conversation, so people can show up with less pressure.",
  },
  {
    title: "Fewer, better introductions",
    icon: "IoMagnet",
    description:
      "Endless options can dilute attention. We focus on one aligned introduction at a time so each connection can be treated with care.",
  },
  {
    title: "Less fatigue, less performance",
    icon: "HiOutlineSparkles",
    description:
      "When every profile feels like a pitch, people burn out. Swipeless flow reduces decision fatigue and makes authenticity easier.",
  },
  {
    title: "Intent-led matching",
    icon: "FaRegChessKnight",
    description:
      "Your intent guides introductions quietly in the background, so the connection starts with meaning, not labels.",
  },
  {
    title: "Calmer social experience",
    icon: "HiMiniClock",
    description:
      "We remove endless scroll loops so people can slow down, be present, and engage with more emotional clarity.",
  },
  {
    title: "Built for modern city life",
    icon: "FaLocationDot",
    description:
      "Designed for dense urban lives where people need better social infrastructure, not more digital noise.",
  },
];

const offlineVision = [
  {
    title: "Curated small-group meetups",
    subtitle: "Hosted circles",
    icon: "FaRegFaceSmile",
    description:
      "Intimate, well-hosted gatherings where people can interact without the pressure of large, impersonal crowds.",
  },
  {
    title: "City-based social circles",
    subtitle: "Neighborhood community",
    icon: "FaLocationDot",
    description:
      "Local community touchpoints that help people build real familiarity over time, not just one-off interactions.",
  },
  {
    title: "Safer online-to-offline pathways",
    subtitle: "Trust-first transitions",
    icon: "HiOutlineCheckBadge",
    description:
      "A thoughtful transition from private intent-based chats to real-world meetings, with consent and comfort at every step.",
  },
  {
    title: "Shared experiences over small talk",
    subtitle: "Activity-led bonding",
    icon: "FaAddressBook",
    description:
      "Board games, social dinners, and city experiences that help people connect naturally beyond profile performance.",
  },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export const metadata: Metadata = {
  title: "About Us | Lumore",
  description:
    "Learn why Lumore exists: to solve urban loneliness through swipeless, intent-led introductions, founder-led trust, and offline community vision.",
  alternates: {
    canonical: ABOUT_URL,
  },
  openGraph: {
    title: "About Us | Lumore",
    description:
      "People trust dating apps when they trust the people building them. See Lumore's mission, swipeless philosophy, founder story, and community vision.",
    url: ABOUT_URL,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Us | Lumore",
    description:
      "Why Lumore is building a swipeless, trust-first way to meet: mission, founder story, and offline community vision.",
    creator: "@0xlumore",
  },
};

export default function AboutPage() {
  return (
    <main className=" px-4 py-8 md:py-12 lg:px-0">
      <div className="mx-auto max-w-7xl space-y-10">
        <section className="rounded-[28px] border border-ui-shade/10 bg-ui-light p-4 shadow-[0_20px_50px_rgba(0,0,0,0.08)] md:p-6">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,430px)_1fr]">
            <article className="relative min-h-[320px] overflow-hidden rounded-2xl border border-ui-shade/10 bg-ui-background/60 md:min-h-[360px]">
              {founder.imageSrc ? (
                <Image
                  src={founder.imageSrc}
                  alt={`${founder.name} portrait`}
                  className="h-full w-full object-cover"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 430px"
                />
              ) : (
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,212,0,0.35),transparent_45%),radial-gradient(circle_at_80%_0%,rgba(84,19,136,0.25),transparent_40%),linear-gradient(135deg,rgba(250,250,250,1),rgba(241,233,218,0.9))]" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-ui-shade/70 via-ui-shade/10 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-ui-light/40 bg-ui-highlight text-xl font-bold text-ui-light">
                  {getInitials(founder.name)}
                </div>
                <p className="mt-3 text-sm font-semibold text-ui-light">
                  {founder.name}
                </p>
                <p className="text-xs text-ui-light/85">{founder.role}</p>
              </div>
            </article>

            <div className="flex flex-col justify-between">
              <div>
                <span className="inline-flex items-center rounded-full bg-ui-primary px-2 py-1 text-xs font-bold uppercase tracking-wide text-ui-shade">
                  About Us
                </span>
                <h1 className="mt-4 text-3xl font-bold leading-tight text-ui-shade md:text-5xl">
                  Building a trust-first way to meet in modern cities.
                </h1>
                <p className="mt-4 max-w-2xl text-base leading-relaxed text-ui-shade/80 md:text-lg">
                  People trust dating apps only when they trust the people
                  building them. Lumore is built around one mission: solving
                  urban loneliness through calm, intentional introductions.
                </p>

                <div className="mt-5 rounded-xl border border-ui-shade/10 bg-ui-background/45 p-4">
                  <p className="text-xs font-bold uppercase tracking-wide text-ui-highlight">
                    Mission
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-ui-shade/80 md:text-base">
                    Reduce loneliness by replacing endless browsing with a
                    simpler human path: clear intent, one aligned introduction,
                    and emotionally safer conversations.
                  </p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
                {trustStats.map((item) => (
                  <article
                    key={item.label}
                    className="rounded-xl border border-ui-shade/10 bg-ui-background/45 p-4"
                  >
                    <p className="text-2xl font-bold text-ui-shade">
                      {item.value}
                    </p>
                    <h2 className="mt-1 text-sm font-semibold text-ui-shade">
                      {item.label}
                    </h2>
                    <p className="mt-1 text-xs text-ui-shade/70">{item.note}</p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[28px] border border-ui-shade/10 bg-ui-background/45 p-6 shadow-[0_14px_35px_rgba(0,0,0,0.06)] md:p-10">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-bold uppercase tracking-wide text-ui-highlight">
              Why Swipeless?
            </p>
            <h2 className="mt-2 text-3xl font-bold text-ui-shade md:text-4xl">
              Designed to feel less performative, more human.
            </h2>
            <p className="mt-3 text-sm text-ui-shade/75 md:text-base">
              Our matching philosophy is simple: reduce noise, increase
              alignment, and give people room to talk like people again.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {swipelessReasons.map((item, index) => (
              <article
                key={item.title}
                className="rounded-xl border border-ui-shade/10 bg-ui-light p-5"
              >
                <div className="inline-flex items-center gap-2 rounded-lg bg-ui-background px-3 py-2">
                  <Icon
                    name={item.icon}
                    className="h-4 w-4 flex-shrink-0 text-ui-highlight"
                  />
                  <span className="text-xs font-semibold text-ui-shade/75">
                    {(index + 1).toString().padStart(2, "0")}
                  </span>
                </div>
                <h3 className="mt-4 text-lg font-semibold text-ui-shade">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-ui-shade/75">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="my-20">
          <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-2">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-ui-highlight">
                Founder Story
              </p>
              <h2 className="mt-2 text-3xl font-bold text-ui-shade md:text-4xl">
                Lumore started from a lived frustration.
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-ui-shade/80 md:text-base">
              {founder.story}
            </p>
          </div>

          <article className="relative mt-6 min-h-[260px] overflow-hidden rounded-2xl border border-ui-shade/10 bg-ui-background md:min-h-[420px]">
            <Image
              src={"/assets/lumore-featured.png"}
              alt="Lumore founder and community context"
              className="h-full w-full object-cover"
              fill
              sizes="(max-width: 768px) 100vw, 100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ui-shade/70 via-ui-shade/25 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 flex items-end justify-between p-5 md:p-7">
              <div>
                <p className="text-sm font-semibold text-ui-light">
                  Join the lumore community
                </p>
                <p className="text-xs text-ui-light/80">@0xlumore</p>
              </div>
              <Link
                href="https://www.instagram.com/0xlumore"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 w-12 shrink-0 aspect-square items-center justify-center rounded-full border border-ui-light/40 bg-ui-light/10 backdrop-blur-sm"
              >
                <Icon name="FaInstagram" className="h-5 w-5 text-ui-light" />
              </Link>
            </div>
          </article>
        </section>

        <section className="rounded-[28px] border border-ui-shade/10 bg-ui-light p-6 shadow-[0_14px_35px_rgba(0,0,0,0.06)] md:p-8">
          <div className="grid grid-cols-1 items-start gap-6 md:grid-cols-2">
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-ui-highlight">
                Vision for Offline Community
              </p>
              <h2 className="mt-2 text-3xl font-bold text-ui-shade md:text-4xl">
                A social layer that extends beyond the app.
              </h2>
            </div>
            <p className="text-sm leading-relaxed text-ui-shade/80 md:text-base">
              We are building real social infrastructure around intentional
              dating. Not just chats, but trusted community spaces where people
              can meet with context, comfort, and continuity.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {offlineVision.map((item) => (
              <article
                key={item.title}
                className="rounded-xl border border-ui-shade/10 bg-ui-light p-4"
              >
                <div className="flex items-center justify-center rounded-xl border border-ui-shade/10 bg-ui-background/45 p-5">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-ui-highlight text-ui-light">
                    <Icon name={item.icon} className="h-5 w-5" />
                  </span>
                </div>
                <h3 className="mt-4 text-base font-semibold text-ui-shade">
                  {item.title}
                </h3>
                <p className="mt-1 text-xs uppercase tracking-wide text-ui-highlight/80">
                  {item.subtitle}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-ui-shade/75">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-[28px] border border-ui-highlight/30 bg-gradient-to-b from-ui-highlight/10 to-ui-highlight/30 p-6 text-center md:p-8">
          <h2 className="text-2xl font-semibold text-ui-highlight md:text-3xl">
            Because connection should feel like belonging.
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-base text-ui-shade/85 md:text-lg">
            We are building Lumore with the community, not apart from it. Follow
            along and join upcoming circles, gatherings, and city events.
          </p>
          <a
            href="https://www.instagram.com/0xlumore/"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center justify-center rounded-xl border border-ui-shade bg-ui-light px-5 py-3 font-semibold text-ui-shade transition hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)]"
          >
            Join the Community
          </a>
        </section>
      </div>
    </main>
  );
}
