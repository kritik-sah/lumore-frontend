// components/Features.tsx
const features = [
  {
    title: "Real-Time Anonymous Chat",
    description: "Instantly connect with matches without swiping.",
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
    title: "Limited Chat Slots",
    description: "Prioritizing quality conversations over quantity.",
    status: "live",
  },
  {
    title: "Secure & Private",
    description: "All chats will be deleted in 24h, and end-to-end encrypted",
    status: "live",
  },
  {
    title: "Gender & Location Filters",
    description: "Control who you connect with. Not so random chats",
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
              className={`group relative block before:absolute before:inset-0 before:rounded-xl before:border-2 before:border-dashed before:border-ui-shade min-h-32`}
            >
              <div
                className={`min-h-32 p-6 rounded-xl border-2 border-gray-900 transition group-hover:-translate-y-2 group-hover:-translate-x-2 overflow-hidden
        ${
          index % 2 === 0
            ? "bg-ui-light text-ui-shade"
            : "bg-ui-shade text-ui-light"
        }`}
              >
                {service.status === "pending" && (
                  <div className="absolute top-0 right-0 bg-ui-primary text-black text-xs font-bold px-3 py-1 rounded-bl-lg rounded-tr-lg">
                    Upcoming
                  </div>
                )}
                <h4 className="font-semibold">{service.title}</h4>
                <p className="text-sm opacity-75">{service.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
