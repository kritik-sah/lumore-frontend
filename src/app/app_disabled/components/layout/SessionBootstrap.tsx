"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { bootstrapAuthSession } from "@/service/auth-session";

const PUBLIC_APP_PATHS = new Set(["/app/login", "/app/referral"]);

export default function SessionBootstrap() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || PUBLIC_APP_PATHS.has(pathname)) {
      return;
    }

    bootstrapAuthSession().catch((error) => {
      console.error("Session bootstrap failed", error);
    });
  }, [pathname]);

  return null;
}
