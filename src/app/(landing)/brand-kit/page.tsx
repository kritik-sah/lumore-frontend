import { TWITTER_CREATOR, withLandingKeywords } from "@/lib/landingSeo";
import type { Metadata } from "next";
import Image from "next/image";

const BRAND_KIT_URL = "https://www.lumore.xyz/brand-kit";

type LogoAsset = {
  name: string;
  file: string;
  previewClassName: string;
  usage: string;
};

const logoAssets: LogoAsset[] = [
  {
    name: "Logo Primary",
    file: "logo.svg",
    previewClassName: "bg-ui-background",
    usage: "Use for default light-background placements.",
  },
  {
    name: "Logo Black",
    file: "logo-black.svg",
    previewClassName: "bg-ui-light",
    usage: "Use for print or high-contrast light surfaces.",
  },
  {
    name: "Logo White",
    file: "logo-white.svg",
    previewClassName: "bg-ui-shade",
    usage: "Use on dark or image-heavy backgrounds.",
  },
  {
    name: "Icon Colour",
    file: "icon-colour.svg",
    previewClassName: "bg-ui-background",
    usage: "Use as app icon or compact brand marker.",
  },
  {
    name: "Icon Black",
    file: "icon-black.svg",
    previewClassName: "bg-ui-light",
    usage: "Use for one-color monochrome layouts.",
  },
  {
    name: "Icon White",
    file: "icon-white.svg",
    previewClassName: "bg-ui-shade",
    usage: "Use on dark containers and overlays.",
  },
];

const colors = [
  {
    name: "Brand Primary",
    token: "--color-brand-primary",
    hex: "#FFD400",
    swatchClassName: "bg-ui-primary",
  },
  {
    name: "Brand Secondary",
    token: "--color-brand-secondary",
    hex: "#D90368",
    swatchClassName: "bg-ui-accent",
  },
  {
    name: "Action Highlight",
    token: "--color-action-primary",
    hex: "#541388",
    swatchClassName: "bg-ui-highlight",
  },
  {
    name: "Canvas",
    token: "--color-bg-canvas",
    hex: "#FAFAFA",
    swatchClassName: "bg-ui-light",
  },
  {
    name: "Surface Muted",
    token: "--color-bg-muted",
    hex: "#F1E9DA",
    swatchClassName: "bg-ui-background",
  },
  {
    name: "Text Primary",
    token: "--color-text-primary",
    hex: "#0A0A09",
    swatchClassName: "bg-ui-shade",
  },
];

const fonts = [
  {
    name: "DM Sans",
    token: "--font-dm-sans",
    role: "Headings (h1-h6)",
    sample: "Build trust-first introductions.",
    className: "font-dmSans",
  },
  {
    name: "Work Sans",
    token: "--font-work-sans",
    role: "Body and interface copy",
    sample: "One thoughtful match at a time.",
    className: "font-workSans",
  },
];

export const metadata: Metadata = {
  title: "Brand Kit | Lumore",
  description:
    "Download official Lumore logos, explore approved color palette, and review typography guidelines.",
  keywords: withLandingKeywords([
    "Lumore brand kit",
    "Lumore logo",
    "brand guidelines",
    "brand assets",
    "press kit",
  ]),
  alternates: {
    canonical: BRAND_KIT_URL,
  },
  openGraph: {
    title: "Brand Kit | Lumore",
    description:
      "Official Lumore brand kit with logo variants, typography, and color specifications.",
    url: BRAND_KIT_URL,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Brand Kit | Lumore",
    description:
      "Access Lumore logos and brand design specifications in one place.",
    creator: TWITTER_CREATOR,
  },
};

export default function BrandKitPage() {
  return (
    <main className="px-4 py-8 md:py-12 lg:px-0">
      <div className="mx-auto max-w-7xl space-y-10">
        <section className="relative overflow-hidden rounded-[30px] border border-ui-shade/10 bg-ui-light p-6 shadow-[0_20px_55px_rgba(0,0,0,0.08)] md:p-10">
          <div className="pointer-events-none absolute -top-14 -right-10 h-48 w-48 rounded-full bg-ui-primary/30 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 left-0 h-56 w-56 rounded-full bg-ui-highlight/15 blur-3xl" />

          <p className="relative text-xs font-bold uppercase tracking-[0.16em] text-ui-highlight">
            Lumore Brand Kit
          </p>
          <h1 className="relative mt-3 max-w-3xl text-4xl font-bold leading-tight text-ui-shade md:text-6xl">
            Logos, colors, and fonts in one place.
          </h1>
          <p className="relative mt-4 max-w-3xl text-sm leading-relaxed text-ui-shade/80 md:text-base">
            Use these assets for press, partnerships, and community materials.
            Do not distort, recolor, or alter the logo proportions.
          </p>

          <div className="relative mt-7 flex flex-wrap gap-3">
            <a
              href="/assets/lumore-brand-kit/logo.svg"
              download
              className="inline-flex items-center justify-center rounded-xl bg-ui-highlight px-5 py-3 text-sm font-semibold text-ui-light transition hover:opacity-95"
            >
              Download Primary Logo
            </a>
            <a
              href="/assets/lumore-brand-kit/icon-colour.svg"
              download
              className="inline-flex items-center justify-center rounded-xl border border-ui-shade bg-ui-light px-5 py-3 text-sm font-semibold text-ui-shade transition hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)]"
            >
              Download App Icon
            </a>
          </div>
        </section>

        <section className="rounded-[28px] border border-ui-shade/10 bg-ui-light p-6 shadow-[0_14px_35px_rgba(0,0,0,0.06)] md:p-8">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-ui-highlight">
                Logos
              </p>
              <h2 className="mt-2 text-3xl font-bold text-ui-shade md:text-4xl">
                Approved variants
              </h2>
            </div>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {logoAssets.map((asset) => (
              <article
                key={asset.file}
                className="rounded-2xl border border-ui-shade/10 bg-ui-light p-4"
              >
                <div
                  className={`flex min-h-[180px] items-center justify-center overflow-hidden rounded-xl border border-ui-shade/10 p-6 ${asset.previewClassName}`}
                >
                  <Image
                    src={`/assets/lumore-brand-kit/${asset.file}`}
                    alt={asset.name}
                    width={260}
                    height={100}
                    className="h-auto w-auto max-h-[100px] max-w-full"
                  />
                </div>

                <h3 className="mt-4 text-lg font-semibold text-ui-shade">
                  {asset.name}
                </h3>
                <p className="mt-1 text-sm text-ui-shade/70">{asset.usage}</p>

                <a
                  href={`/assets/lumore-brand-kit/${asset.file}`}
                  download
                  className="mt-4 inline-flex items-center justify-center rounded-lg border border-ui-shade/20 bg-ui-background px-3 py-2 text-xs font-semibold text-ui-shade transition hover:bg-ui-light"
                >
                  Download {asset.file}
                </a>
              </article>
            ))}
          </div>
        </section>

        <section className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <article className="rounded-[24px] border border-ui-shade/10 bg-ui-light p-6 shadow-[0_14px_35px_rgba(0,0,0,0.05)]">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-ui-highlight">
              Typography
            </p>
            <h2 className="mt-2 text-3xl font-bold text-ui-shade">Fonts</h2>
            <div className="mt-6 space-y-4">
              {fonts.map((font) => (
                <div
                  key={font.name}
                  className="rounded-xl border border-ui-shade/10 bg-ui-background/45 p-4"
                >
                  <p className="text-xs uppercase tracking-wide text-ui-shade/60">
                    {font.token}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-ui-shade">
                    {font.name} · {font.role}
                  </p>
                  <p className={`mt-3 text-2xl text-ui-shade ${font.className}`}>
                    {font.sample}
                  </p>
                </div>
              ))}
            </div>
          </article>

          <article className="rounded-[24px] border border-ui-shade/10 bg-ui-light p-6 shadow-[0_14px_35px_rgba(0,0,0,0.05)]">
            <p className="text-xs font-bold uppercase tracking-[0.14em] text-ui-highlight">
              Color System
            </p>
            <h2 className="mt-2 text-3xl font-bold text-ui-shade">Palette</h2>
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {colors.map((color) => (
                <div
                  key={color.token}
                  className="rounded-xl border border-ui-shade/10 bg-ui-background/45 p-3"
                >
                  <div
                    className={`h-16 w-full rounded-lg border border-ui-shade/10 ${color.swatchClassName}`}
                  />
                  <p className="mt-3 text-sm font-semibold text-ui-shade">
                    {color.name}
                  </p>
                  <p className="text-xs text-ui-shade/65">{color.token}</p>
                  <p className="text-xs font-semibold text-ui-shade/85">
                    {color.hex}
                  </p>
                </div>
              ))}
            </div>
          </article>
        </section>
      </div>
    </main>
  );
}
