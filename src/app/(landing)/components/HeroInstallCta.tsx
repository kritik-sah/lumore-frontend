"use client";

import { cn } from "@/lib/utils";
import { trackAnalytic } from "@/service/analytics";
import { AiFillAndroid } from "react-icons/ai";

type HeroInstallCtaProps = {
  className?: string;
};

export default function HeroInstallCta({ className }: HeroInstallCtaProps) {
  return (
    <a
      href="https://play.google.com/store/apps/details?id=xyz.lumore.www.twa"
      target="_blank"
      rel="noopener noreferrer"
      onClick={() =>
        trackAnalytic({
          activity: "android_install",
          label: "Android Install",
        })
      }
      className={cn(
        "inline-flex items-center justify-center gap-0 rounded-xl border border-ui-shade bg-ui-light text-ui-shade text-base transition duration-200 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0)]",
        className,
      )}
    >
      <AiFillAndroid className="mr-2 text-3xl shrink-0" aria-hidden="true" />
      <span>Install Lumore</span>
    </a>
  );
}
