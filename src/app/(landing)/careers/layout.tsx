import Container from "@/components/shared/Container";
import Link from "next/link";
import type { ReactNode } from "react";

export default function CareersLayout({ children }: { children: ReactNode }) {
  const year = new Date().getFullYear();

  return (
    <>
      <main id="careers-main">{children}</main>
    </>
  );
}
