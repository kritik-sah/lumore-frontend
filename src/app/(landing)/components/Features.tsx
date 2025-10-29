// components/Features.tsx
const features = [
  {
    title: "Real-Time Anonymous Chat",
    description:
      "Instantly connect with matches without swiping, in real-time.",
    status: "live",
  },
  {
    title: "Intent-Based Matching",
    description: "Get paired based on shared hobbies and preferences.",
    status: "live",
  },
  {
    title: "Gender & Location Filters",
    description: "Control who you connect with. Not so random chats",
    status: "live",
  },
  {
    title: "Limited Daily Matches",
    description: "Prioritizing quality conversations over quantity.",
    status: "live",
  },
  {
    title: "Secure & Private",
    description:
      "All chats will be deleted in 24h, and end-to-end encrypted, complete profile control, we will never show your profile to anyone without your consent.",
    status: "live",
  },
  {
    title: "Feedback & Reporting system",
    description:
      "Your safety is our priority. Report inappropriate behavior easily. along with feedback to improve matching algorithms.",
    status: "live",
  },
  {
    title: "AI-Powered Conversation Starters",
    description: 'Never struggle with "what to say" again.',
    status: "pending",
  },
  {
    title: "Create, Find & Join Events in your city",
    description:
      "House parties, Diwali, Holi parties, Tech Events, find partners to go to anywhere",
    status: "pending",
  },
  {
    title: "AI Companion",
    description:
      "From dating advice to try your rizz our AI Companion is here to listen to you ;p",
    status: "pending",
  },
];

export default function Features() {
  return (
    <section id="features" className="py-20">
      <div className="px-4 lg:px-0 max-w-7xl mx-auto ">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-start gap-4">
          <span className="text-3xl font-bold text-ui-shade bg-ui-primary px-2 py-1 -skew-x-12">
            Features
          </span>
          <p className="max-w-2xl italic">
            We combine the excitement of live anonymous chat (like Omegle) with
            structured matchmaking (like Tinder/Bumble) while ensuring data
            security & privacy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          {features.map((service, index) => (
            <div
              key={index}
              className={`relative px-6 py-6 flex flex-col items-start justify-start gap-2 rounded-xl border border-black text-left
                ${index % 2 === 0 ? "bg-white text-black hover:shadow-[6px_6px_0px_0px_rgba(0,0,0)] " : "bg-black text-white hover:shadow-[6px_6px_0px_0px_rgba(255,212,0)] "}
               transition duration-200`}
            >
              {service.status === "pending" && (
                <span className="absolute top-0 right-0 bg-yellow-400 text-black text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
                  Upcoming
                </span>
              )}

              <h4 className="font-semibold text-lg">{service.title}</h4>
              <p className="text-sm opacity-75">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
