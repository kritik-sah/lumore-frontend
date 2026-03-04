export type RoleType = "Intern" | "Full-time";

export type RoleLocation = "Remote" | "Mumbai";

export type RoleDepartment =
  | "Engineering"
  | "Product & Design"
  | "Growth"
  | "Ops";

export interface Principle {
  title: string;
  description: string;
}

export interface Piece {
  name: string;
  meaning: string;
}

export interface SuccessionStage {
  phase: string;
  months: string;
  details: string;
}

export interface Role {
  title: string;
  department: RoleDepartment;
  location: RoleLocation;
  type: RoleType;
  description: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export const socialProofItems = [
  "Android app live",
  "Early community",
  "Mumbai-first",
] as const;

export const vision =
  "A world where young professionals in cities feel less alone, and more seen through intentional connections.";

export const mission =
  "Build swipeless, talk-first dating experiences that prioritize compatibility, emotional safety, and real outcomes over endless browsing.";

export const corePrinciples = [
  "Talk-first connections",
  "Safety by design",
  "Respectful exits",
] as const;

export const principles: Principle[] = [
  {
    title: "Build for outcomes, not attention loops",
    description:
      "We remove swipe fatigue and design for meaningful progress in every interaction.",
  },
  {
    title: "Ship fast with high standards",
    description:
      "Speed matters, but craft quality, reliability, and user trust are non-negotiable.",
  },
  {
    title: "Teach deeply, learn aggressively",
    description:
      "Leaders transfer context. Juniors absorb fast, own their lane, and earn scope through execution.",
  },
];

export const pieces: Piece[] = [
  {
    name: "King",
    meaning:
      "Protects mission clarity. Keeps the company aligned on the long game.",
  },
  {
    name: "Queen",
    meaning:
      "Highest leverage operator. Bridges product, growth, and execution under pressure.",
  },
  {
    name: "Rooks",
    meaning:
      "System builders. Create stable foundations in engineering, operations, and process.",
  },
  {
    name: "Bishops",
    meaning:
      "Strategic specialists. Drive depth in product, design, and domain excellence.",
  },
  {
    name: "Knights",
    meaning:
      "Problem solvers. Navigate ambiguity and unlock progress through unconventional moves.",
  },
  {
    name: "Pawns",
    meaning:
      "High-upside builders. Closest to execution and user reality, with real promotion pathways.",
  },
  {
    name: "Gambit",
    meaning:
      "Calculated risk role. Tests bold ideas quickly when upside is worth the tradeoff.",
  },
  {
    name: "Timekeeper",
    meaning:
      "Tempo owner. Protects focus, deadlines, and decision velocity across the board.",
  },
];

export const successionStages: SuccessionStage[] = [
  {
    phase: "Shadow",
    months: "Month 1-2",
    details: "Observe the role end-to-end, absorb context, and map decision patterns.",
  },
  {
    phase: "Assist",
    months: "Month 3-4",
    details:
      "Ship scoped tasks with mentor review while taking ownership of clear deliverables.",
  },
  {
    phase: "Lead",
    months: "Month 5-6",
    details:
      "Run the function independently, present decisions, and own outcomes with minimal oversight.",
  },
];

export const evaluationCriteria = [
  "Ownership",
  "Learning velocity",
  "Communication",
  "Craft quality",
  "User empathy",
] as const;

export const roles: Role[] = [
  {
    title: "Frontend Engineer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    description:
      "Build responsive, high-performance interfaces across the core matching and chat experience.",
  },
  {
    title: "Backend Engineer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    description:
      "Design APIs, data models, and reliability systems that power low-latency, trust-first interactions.",
  },
  {
    title: "Mobile Engineer",
    department: "Engineering",
    location: "Mumbai",
    type: "Full-time",
    description:
      "Own Android product quality and ship polished mobile flows for real-world dating use cases.",
  },
  {
    title: "Product Designer",
    department: "Product & Design",
    location: "Remote",
    type: "Full-time",
    description:
      "Craft premium user journeys that balance clarity, emotional safety, and conversion.",
  },
  {
    title: "Product Generalist",
    department: "Product & Design",
    location: "Mumbai",
    type: "Intern",
    description:
      "Work across research, QA, copy, and shipping to accelerate product decisions.",
  },
  {
    title: "Growth Intern",
    department: "Growth",
    location: "Mumbai",
    type: "Intern",
    description:
      "Run fast experiments across channels and convert insights into repeatable growth loops.",
  },
  {
    title: "Content / Community",
    department: "Growth",
    location: "Remote",
    type: "Intern",
    description:
      "Shape Lumore voice, engage early users, and build founder-led community momentum.",
  },
  {
    title: "Ops Intern",
    department: "Ops",
    location: "Mumbai",
    type: "Intern",
    description:
      "Support operational workflows, execution tracking, and process discipline across teams.",
  },
  {
    title: "Partnerships",
    department: "Ops",
    location: "Mumbai",
    type: "Full-time",
    description:
      "Build strategic partnerships that unlock distribution, trust, and city-level expansion.",
  },
];

export const benefits = [
  "High ownership from day one",
  "Fast learning in a compact elite team",
  "Direct founder mentorship",
  "Real product impact, not shadow work",
  "Merit-based growth and promotions",
] as const;

export const faqs: FaqItem[] = [
  {
    question: "Do I need prior startup experience?",
    answer:
      "No. Proof of skill, execution quality, and learning speed matter more than previous startup logos.",
  },
  {
    question: "What does replace your mentor mean?",
    answer:
      "It means you can independently run that role at a high bar, while your mentor moves to a bigger scope.",
  },
  {
    question: "What if I fail?",
    answer:
      "We coach with tight feedback loops and clear expectations, but standards remain high.",
  },
  {
    question: "Is this intense?",
    answer:
      "Yes. We operate with healthy intensity, clear boundaries, and zero tolerance for toxic culture.",
  },
];
