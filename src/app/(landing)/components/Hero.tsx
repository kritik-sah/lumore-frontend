import Image from "next/image";
import ProductHuntBadge from "./ProductHuntBadge";
import HeroAnimatedWords from "./HeroAnimatedWords";
import HeroInstallCta from "./HeroInstallCta";
import HeroParticles from "./HeroParticles";

export default function Hero() {
  return (
    <section className="overflow-hidden">
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_20%_20%,rgba(255,212,0,0.25),transparent_45%),radial-gradient(circle_at_80%_0%,rgba(84,19,136,0.20),transparent_40%)]" />
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-20 [background-image:radial-gradient(rgba(10,10,9,0.12)_1px,transparent_1px)] [background-size:20px_20px]" />
      <h1 className="hidden">Swipeless Dating App for Real Connections</h1>
      <div className="max-w-7xl min-h-[70vh] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center py-10 lg:py-20 px-5 text-center lg:text-left">
        <div className="flex flex-col items-center lg:items-start gap-4">
          <span className="inline-flex items-center gap-2 rounded-full border-2 border-ui-shade px-3 py-1 text-xs font-semibold uppercase tracking-wide text-ui-shade">
            New way to meet people
          </span>
          <h2 className="text-4xl md:text-6xl lg:text-7xl text-center lg:text-left font-bold uppercase tracking-tight">
            Meet <span className="text-ui-highlight">People</span>,
            <br className="hidden md:block" />
            <HeroAnimatedWords
              className="text-center lg:text-left"
              words={[
                "Not Profiles.",
                "Not Their Best Selfie.",
                "Not AI-Generated Prompts.",
                "Not Job Titles in Bios.",
                `Not "Here for a Good Time" Clich\u00E9s.`,
                "Not Catfish Filters.",
                "Not Swipe Leftovers.",
                `Not "Hey" Collectors.`,
                "Not Ghost Stories.",
                "Not Algorithm Mistakes.",
              ]}
            />
          </h2>
          <p className="text-ui-shade text-center lg:text-left max-w-xl text-base md:text-lg">
            Lumore helps you meet new people, not just swipe on them. We&apos;re
            building a more meaningful, less awkward way to socialize.
          </p>

          <div className="flex flex-col md:flex-row items-start justify-center lg:justify-start gap-4 w-full">
            <div className="flex flex-col items-center lg:items-start w-full md:w-auto">
              <HeroInstallCta className="w-full md:w-auto py-3 px-6" />
              <span className="mt-2 text-xs font-medium text-ui-shade/70">
                Free on Google Play
              </span>
            </div>

            <ProductHuntBadge />
          </div>

          <p className="text-sm text-ui-shade/70">
            Real-time chat. No swipes. 24h auto-chat-delete.
          </p>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="relative w-full max-w-sm md:max-w-md">
            <div className="absolute -inset-6 rounded-[2.5rem] bg-ui-light/70 blur-2xl" />
            <div className="relative rounded-[2rem] border border-ui-shade/20 bg-ui-light p-3 shadow-[0_25px_60px_rgba(0,0,0,0.15)] rotate-2">
              <Image
                src="/assets/login-screen.webp"
                width={480}
                height={960}
                alt="Lumore app screen"
                priority
                fetchPriority="high"
                loading="eager"
                sizes="(max-width: 768px) 86vw, (max-width: 1200px) 42vw, 480px"
                className="w-full h-auto rounded-[1.5rem] object-cover"
              />
            </div>
          </div>
        </div>
      </div>

      <HeroParticles />
    </section>
  );
}
