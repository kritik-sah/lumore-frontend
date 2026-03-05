import React from "react";
import type { Metadata } from "next";
import {
  TWITTER_CREATOR,
  toAbsoluteUrl,
  withLandingKeywords,
} from "@/lib/landingSeo";

const SAFETY_EMAIL = "safety@lumore.xyz";
const CHILD_SAFETY_URL = toAbsoluteUrl("/child-safety");

export const metadata: Metadata = {
  title: "Child Safety Standards | Lumore: Swipeless Dating App",
  description:
    "Read the Child Safety Standards for Lumore: Swipeless Dating App, including our zero-tolerance policy against CSAE/CSAM, reporting channels, and law-enforcement cooperation.",
  keywords: withLandingKeywords([
    "child safety standards",
    "CSAE policy",
    "CSAM policy",
    "dating app safety policy",
    "Lumore child safety",
  ]),
  alternates: {
    canonical: CHILD_SAFETY_URL,
  },
  openGraph: {
    title: "Child Safety Standards | Lumore: Swipeless Dating App",
    description:
      "Lumore: Swipeless Dating App child safety standards with explicit CSAE/CSAM prohibition, reporting process, and safety contact.",
    url: CHILD_SAFETY_URL,
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Child Safety Standards | Lumore: Swipeless Dating App",
    description:
      "Child Safety Standards for Lumore: Swipeless Dating App.",
    creator: TWITTER_CREATOR,
  },
};

const ChildSafetyPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-10 text-ui-shade">
      <h1 className="text-3xl font-bold mb-4">
        Child Safety Standards (CSAE/CSAM) &ndash; Lumore
      </h1>
      <p className="mb-2">
        <strong>Last updated:</strong> 2026-03-06
      </p>
      <p className="mb-8">
        These Child Safety Standards apply to{" "}
        <strong>Lumore: Swipeless Dating App</strong>.
      </p>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">
          1. Zero tolerance for CSAE/CSAM
        </h2>
        <p>
          Lumore: Swipeless Dating App has zero tolerance for child sexual abuse
          and exploitation (CSAE), including child sexual abuse material
          (CSAM). Any account involved in CSAE/CSAM activity or child
          exploitation is subject to immediate enforcement action, including
          content removal, account suspension or termination, and escalation to
          relevant authorities where required.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">2. Prohibited content</h2>
        <p className="mb-3">The following is strictly prohibited on Lumore:</p>
        <ul className="list-disc ml-5 space-y-2 text-ui-shade/90">
          <li>Any CSAM content or links to CSAM.</li>
          <li>
            Sexual content involving minors, including real, fictional, edited,
            or AI-generated depictions.
          </li>
          <li>
            Grooming behavior, sexualization of minors, or attempts to build
            exploitative relationships with minors.
          </li>
          <li>
            Trafficking, coercion, sextortion, or any exploitation of children.
          </li>
          <li>
            Solicitation, promotion, or facilitation of child sexual abuse or
            exploitation.
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">3. 18+ requirement</h2>
        <p>
          Lumore is for adults only. You must be 18 years or older to create or
          use an account. We may remove accounts that appear to be underage or
          that provide false age information.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">4. Reporting</h2>
        <p className="mb-3">
          Users can report concerning behavior and content in-app using the
          report features. We also support reports through our child safety
          contact:
        </p>
        <p>
          Email:{" "}
          <a
            href={`mailto:${SAFETY_EMAIL}`}
            className="underline text-blue-600"
          >
            {SAFETY_EMAIL}
          </a>
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">
          5. Child safety point of contact
        </h2>
        <p>
          Our designated child safety point of contact is{" "}
          <a
            href={`mailto:${SAFETY_EMAIL}`}
            className="underline text-blue-600"
          >
            {SAFETY_EMAIL}
          </a>
          . We review safety reports and prioritize urgent CSAE/CSAM-related
          escalations.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">
          6. Cooperation with law enforcement
        </h2>
        <p>
          Where legally required, Lumore cooperates with law enforcement and
          child protection authorities, including preserving and disclosing
          relevant data for investigations related to CSAE/CSAM and child
          exploitation.
        </p>
      </section>
    </div>
  );
};

export default ChildSafetyPage;
