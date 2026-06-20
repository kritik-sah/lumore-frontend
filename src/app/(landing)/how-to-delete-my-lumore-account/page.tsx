import React from "react";
import type { Metadata } from "next";
import { TWITTER_CREATOR, toAbsoluteUrl, withLandingKeywords } from "@/lib/landingSeo";

const DELETE_ACCOUNT_URL = toAbsoluteUrl("/how-to-delete-my-lumore-account");
const PRIVACY_POLICY_URL = "/privacy-policy";
const TERMS_OF_USE_URL = "/terms-of-use";

export const metadata: Metadata = {
  title: "Delete Your Lumore Account | Lumore",
  description:
    "Learn how to delete your Lumore account and associated data from the app, or by email if you no longer have access.",
  keywords: withLandingKeywords([
    "delete Lumore account",
    "Lumore account deletion",
    "remove Lumore profile",
    "Lumore data deletion",
  ]),
  alternates: {
    canonical: DELETE_ACCOUNT_URL,
  },
  openGraph: {
    title: "Delete Your Lumore Account | Lumore",
    description:
      "Step-by-step instructions to delete your Lumore account and request removal of your personal data.",
    url: DELETE_ACCOUNT_URL,
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Delete Your Lumore Account | Lumore",
    description:
      "How to permanently delete your Lumore account and personal data.",
    creator: TWITTER_CREATOR,
  },
};

const DeleteAccountPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-10 text-ui-shade">
      <h1 className="text-3xl font-bold mb-8">Delete Your Lumore Account</h1>

      <p className="mb-8">
        Lumore users can request deletion of their account and associated data.
      </p>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">Delete from the Lumore app</h2>
        <ol className="list-decimal ml-5 space-y-1 text-ui-shade/90">
          <li>Open the Lumore app.</li>
          <li>
            Go to <strong>Profile / Settings</strong>.
          </li>
          <li>
            Tap <strong>Delete Account</strong>.
          </li>
          <li>Confirm your request.</li>
        </ol>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">
          If you no longer have the app
        </h2>
        <p className="mb-3">
          Email us at{" "}
          <a
            href="mailto:support@lumore.xyz"
            className="underline text-blue-600"
          >
            support@lumore.xyz
          </a>{" "}
          from your registered email address with the subject:
        </p>
        <p className="font-semibold mb-3">Delete my Lumore account</p>
        <p>
          We will verify your request and process account deletion.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">Data deleted</h2>
        <p className="mb-3">
          When your account is deleted, we delete:
        </p>
        <ul className="list-disc ml-5 space-y-2 text-ui-shade/90">
          <li>Profile information</li>
          <li>Photos and media uploaded by you</li>
          <li>Match and preference data</li>
          <li>Chat/account-related user data</li>
          <li>Authentication/account identifiers linked to your Lumore account</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-3">Data we may retain</h2>
        <p className="mb-3">
          We may retain limited data only where required for security, fraud
          prevention, legal compliance, dispute resolution, or financial/accounting
          obligations.
        </p>
        <p className="mb-3">
          Such data may be retained for up to <strong>90 days</strong>, unless a
          longer period is required by law.
        </p>
        <p>
          After deletion, your account cannot be restored.
        </p>
      </section>

      <section className="mb-4 pt-6 border-t border-ui-shade/10">
        <p className="text-sm text-ui-shade/80 italic">
          <strong>Disclaimer:</strong> For more information, please read our{" "}
          <a
            href={PRIVACY_POLICY_URL}
            className="underline text-blue-600"
            target="_blank"
            rel="noopener noreferrer"
          >
            Privacy Policy
          </a>{" "}
          and{" "}
          <a
            href={TERMS_OF_USE_URL}
            className="underline text-blue-600"
            target="_blank"
            rel="noopener noreferrer"
          >
            Terms of Use
          </a>
          .
        </p>
      </section>
    </div>
  );
};

export default DeleteAccountPage;