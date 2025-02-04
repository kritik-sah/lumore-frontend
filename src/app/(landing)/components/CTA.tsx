"use client";
// components/CTA.tsx
import { PopupButton } from "@typeform/embed-react";

export default function CTA() {
  return (
    <section className="mb-10 px-4 lg:px-0">
      <div className="bg-ui-background p-16 rounded-2xl text-center max-w-7xl mx-auto border border-2 border-ui-shade">
        <h3 className="text-xl font-semibold">
          Let&apos;s make things happen.
        </h3>
        <p className="text-gray-600 my-4 max-w-lg mx-auto">
          🚀 Join the Waitlist! Fill out the form to secure early access and
          help us tailor Lumore to your needs. 💙
        </p>
        <PopupButton id="ITzseckk" className="mt-4">
          <div className="relative md:ext-md lg:text-lg rounded-lg border border-ui-shade px-5 py-3 bg-ui-primary text-ui-shade">
            Help us to understand you !!
            <span className="absolute -top-1 -right-1 flex size-4">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ui-accent opacity-75"></span>
              <span className="relative inline-flex size-4 rounded-full bg-ui-accent"></span>
            </span>
          </div>
        </PopupButton>
      </div>
    </section>
  );
}
