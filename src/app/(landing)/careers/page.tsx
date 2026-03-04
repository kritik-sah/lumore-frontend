import CopyEmailButton from "@/components/careers/CopyEmailButton";
import OpenRolesSection from "@/components/careers/OpenRolesSection";
import PieceCard from "@/components/careers/PieceCard";
import Badge from "@/components/shared/Badge";
import Button from "@/components/shared/Button";
import Card from "@/components/shared/Card";
import Container from "@/components/shared/Container";
import ImagePlaceholder from "@/components/shared/ImagePlaceholder";
import InlineIcon from "@/components/shared/InlineIcon";
import Section from "@/components/shared/Section";
import {
  benefits,
  corePrinciples,
  evaluationCriteria,
  faqs,
  mission,
  pieces,
  principles,
  roles,
  socialProofItems,
  successionStages,
  vision,
} from "@/lib/careers-data";
import { TWITTER_CREATOR, withLandingKeywords } from "@/lib/landingSeo";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

const CAREERS_URL = "https://www.lumore.xyz/careers";
const CAREERS_EMAIL = "careers@lumore.xyz";

const principleIcons = ["rocket", "shield", "spark"] as const;

export const metadata: Metadata = {
  title: "Careers | Lumore",
  description:
    "Join Lumore and help build the future of swipeless dating. Explore our vision, culture, succession doctrine, and open roles for interns and full-time builders.",
  keywords: withLandingKeywords([
    "Lumore careers",
    "startup jobs",
    "internships",
    "product jobs",
    "engineering jobs",
  ]),
  alternates: {
    canonical: CAREERS_URL,
  },
  openGraph: {
    title: "Careers | Lumore",
    description:
      "We are building a compact, elite team to solve urban loneliness through swipeless dating. View culture, hiring philosophy, and open roles.",
    url: CAREERS_URL,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Careers | Lumore",
    description:
      "Build with Lumore: mission-first culture, merit-based growth, and high ownership roles.",
    creator: TWITTER_CREATOR,
  },
};

export default function CareersPage() {
  return (
    <div className="pb-8 pt-4 md:pt-8">
      <section className="py-6 md:py-8">
        <Container>
          <div className="relative overflow-hidden rounded-[32px] border border-ui-shade/10 bg-ui-light p-6 shadow-[0_22px_55px_rgba(0,0,0,0.08)] md:p-10">
            <div className="pointer-events-none absolute -right-10 -top-20 h-52 w-52 rounded-full bg-ui-primary/25 blur-3xl" />
            <div className="pointer-events-none absolute -left-8 bottom-0 h-44 w-44 rounded-full bg-ui-highlight/14 blur-3xl" />

            <div className="relative grid grid-cols-1 items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
              <div>
                <Badge variant="highlight">Careers at Lumore</Badge>
                <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-[1.08] text-ui-shade md:text-6xl">
                  Build the future of dating without swiping.
                </h1>
                <p className="mt-5 max-w-2xl text-sm leading-relaxed text-ui-shade/80 md:text-lg">
                  We are solving urban loneliness for young professionals by
                  building one thoughtful connection at a time. Join a small
                  elite team that ships fast and teaches deeply.
                </p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <Button href="#roles">View Open Roles</Button>
                  <Button href="#culture" variant="secondary">
                    Our Culture
                  </Button>
                </div>
              </div>

              <div className="relative w-full aspect-square min-h-[220px] overflow-hidden rounded-[24px] border border-ui-shade/10">
                <Image
                  src="/assets/chess.jpg"
                  alt="Chessboard visual for Lumore careers"
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 45vw"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-4 md:py-6">
        <Container>
          <div className="rounded-2xl border border-ui-shade/12 bg-ui-background/55 px-4 py-3 md:px-6">
            <p className="text-center text-sm font-medium text-ui-shade/80">
              {socialProofItems.join(" \u2022 ")}
            </p>
          </div>
        </Container>
      </section>

      <Section
        eyebrow="Vision & Mission"
        title="We design for real connection, not endless scrolling."
        description="Lumore exists to replace swipe fatigue with meaningful, compatible introductions."
        tone="muted"
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Card>
            <h3 className="text-xl font-semibold text-ui-shade">Vision</h3>
            <p className="mt-2 text-sm leading-relaxed text-ui-shade/78">
              {vision}
            </p>
          </Card>
          <Card>
            <h3 className="text-xl font-semibold text-ui-shade">Mission</h3>
            <p className="mt-2 text-sm leading-relaxed text-ui-shade/78">
              {mission}
            </p>
          </Card>
        </div>

        <div className="mt-4 flex flex-wrap gap-2.5">
          {corePrinciples.map((principle) => (
            <Badge key={principle} variant="soft" className="text-xs">
              {principle}
            </Badge>
          ))}
        </div>
      </Section>

      <Section
        eyebrow="Principles"
        title="How we work every day"
        description="We run with ambition, clarity, and discipline."
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {principles.map((principle, index) => (
            <Card key={principle.title} className="h-full">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-ui-background text-ui-highlight">
                <InlineIcon
                  name={principleIcons[index] ?? "check"}
                  className="h-4.5 w-4.5"
                />
              </span>
              <h3 className="mt-4 text-lg font-semibold text-ui-shade">
                {principle.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ui-shade/76">
                {principle.description}
              </p>
            </Card>
          ))}
        </div>
      </Section>

      <section id="culture" className="py-6 md:py-8">
        <Container>
          <div className="relative overflow-hidden rounded-[30px] border border-ui-shade/10 bg-ui-light p-6 shadow-[0_16px_42px_rgba(0,0,0,0.07)] md:p-10">
            <div className="pointer-events-none absolute inset-0 opacity-35 [background-image:linear-gradient(to_right,rgba(10,10,9,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(10,10,9,0.06)_1px,transparent_1px)] [background-size:34px_34px]" />
            <div className="relative grid grid-cols-1 gap-8 lg:grid-cols-[0.95fr_1.05fr]">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-ui-highlight">
                  The 18-piece company
                </p>
                <h2 className="mt-3 text-3xl font-bold leading-tight text-ui-shade md:text-5xl">
                  We run like a focused board, not a bloated org chart.
                </h2>
                <p className="mt-4 text-sm leading-relaxed text-ui-shade/80 md:text-base">
                  Every role has a clear purpose. Strategy and execution move
                  together. We hire for hunger, craft, and growth potential.
                </p>
                <p className="mt-5 text-sm font-semibold text-ui-shade">
                  Pawns who prove themselves get promoted.
                </p>

                <div className="relative mt-6 w-full max-w-[280px] aspect-square overflow-hidden rounded-2xl border border-ui-shade/10">
                  <Image
                    src="/assets/lets-play.jpg"
                    alt="Chessboard motif visual"
                    fill
                    sizes="(max-width: 768px) 70vw, 280px"
                    className="object-cover"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {pieces.map((piece) => (
                  <PieceCard key={piece.name} piece={piece} />
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      <Section
        eyebrow="Succession Doctrine"
        title="Mentorship at Lumore has one outcome: replacement."
        description="Every intern and junior is trained to replace their mentor within six months."
        tone="muted"
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {successionStages.map((stage) => (
            <Card key={stage.phase}>
              <p className="text-xs font-bold uppercase tracking-[0.1em] text-ui-highlight">
                {stage.months}
              </p>
              <h3 className="mt-2 text-xl font-semibold text-ui-shade">
                {stage.phase}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ui-shade/76">
                {stage.details}
              </p>
            </Card>
          ))}
        </div>

        <div className="mt-4 rounded-2xl border border-ui-highlight/25 bg-ui-highlight/8 p-4 md:p-5">
          <p className="text-base font-bold text-ui-shade md:text-lg">
            We don&apos;t hire assistants. We hire future leaders.
          </p>
        </div>

        <div className="mt-5 grid gap-5 md:grid-cols-[1fr_1fr]">
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.08em] text-ui-shade/75">
              How we evaluate growth
            </h3>
            <ul className="mt-3 space-y-2">
              {evaluationCriteria.map((item) => (
                <li
                  key={item}
                  className="inline-flex w-full items-center gap-2 rounded-xl border border-ui-shade/10 bg-ui-light px-3 py-2 text-sm text-ui-shade/80"
                >
                  <InlineIcon name="check" className="text-ui-highlight" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <Card className="h-full bg-ui-light/85">
            <h3 className="text-lg font-semibold text-ui-shade">
              Leaders must produce successors.
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-ui-shade/76">
              Promotion is not a title change. It is earned proof that you can
              run your role and elevate others into it.
            </p>
          </Card>
        </div>
      </Section>

      <Section
        id="roles"
        eyebrow="Open Roles"
        title="Join the board"
        description="We hire freshers with skills and hunger. Pick your role and apply directly."
      >
        <OpenRolesSection roles={roles} />
      </Section>

      <Section
        eyebrow="Benefits & Working Style"
        title="High trust. High ownership. High learning."
        description="You will work close to founders, ship for real users, and grow on merit."
        tone="muted"
      >
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
          {benefits.map((benefit) => (
            <Card key={benefit} className="flex items-start gap-3 p-4">
              <span className="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-full bg-ui-background text-ui-highlight">
                <InlineIcon name="check" className="h-4 w-4" />
              </span>
              <p className="text-sm text-ui-shade/78">{benefit}</p>
            </Card>
          ))}
        </div>
        <p className="mt-5 text-sm font-semibold text-ui-shade">
          Freshers welcome if you can ship.
        </p>
      </Section>

      <Section
        id="faq"
        eyebrow="FAQ"
        title="Before you apply"
        description="Clear expectations, clear growth path."
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {faqs.map((faq) => (
            <Card key={faq.question} className="h-full">
              <h3 className="text-base font-semibold text-ui-shade md:text-lg">
                {faq.question}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ui-shade/78">
                {faq.answer}
              </p>
            </Card>
          ))}
        </div>
      </Section>

      {/* <Section
        id="apply"
        eyebrow="Final Move"
        title="If you want to build something that matters, join the board."
        description="We are looking for builders who can execute, learn fast, and raise the bar."
        tone="accent"
      >
        <div className="grid grid-cols-1 gap-6">
          <ImagePlaceholder
            label="Team photo placeholder"
            aspect="21/9"
            className="rounded-[20px] border-ui-light/30 bg-ui-light/10 text-ui-light/85"
          />
          <div className="flex flex-wrap items-center gap-3">
            <CopyEmailButton
              email={CAREERS_EMAIL}
              className="bg-ui-highlight text-ui-light hover:bg-ui-light/15"
            />
            <Button
              href="/"
              variant="ghost"
              className="text-ui-light hover:bg-ui-light/15"
            >
              Back to homepage
            </Button>
          </div>
          <p className="text-xs text-ui-light/80">{CAREERS_EMAIL}</p>
          <Link
            href="/"
            className="inline-flex w-fit items-center text-sm font-medium text-ui-light/90 underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ui-light/60"
          >
            Return to Lumore home
          </Link>
        </div>
      </Section> */}
    </div>
  );
}
