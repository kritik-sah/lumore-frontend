"use client";

import type { ReactNode } from "react";

interface SectionProps {
  title: string;
  description: string;
  children: ReactNode;
}

const Section = ({ title, description, children }: SectionProps) => (
  <div className="mt-6">
    <p className="text-xs uppercase text-ui-shade/70">{title}</p>
    <p className="text-xs text-ui-shade/60 mt-1">{description}</p>
    {children}
  </div>
);

export default Section;
