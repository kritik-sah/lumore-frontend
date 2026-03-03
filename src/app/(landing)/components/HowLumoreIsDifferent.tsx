import { Marquee } from "@/components/ui/marquee";

const reflectionCards = [
  {
    title: "Have you ever felt like you're performing on dating apps?",
    body: "Choosing photos carefully. Thinking about what sounds impressive. Editing yourself slightly.",
  },
  {
    title: "What if you didn't have to?",
    body: "No versioning yourself for approval. Just showing up as you are.",
  },
  {
    title: "Have you ever matched with someone and still felt unseen?",
    body: "Good photos. Decent chat. But something missing.",
  },
  {
    title: "Maybe alignment matters more than attraction.",
    body: "Shared direction creates steadier, more meaningful connection.",
  },
  {
    title: "Have you ever hesitated to say what you actually want?",
    body: "Because it might scare people away or it feels too serious or no one else seems clear.",
  },
  {
    title: "What if intent wasn't something you had to hide?",
    body: "Clarity can be quiet, honest, and still welcoming.",
  },
  {
    title: "Have you ever felt lonelier after using a dating app?",
    body: "Scrolling for hours. Collecting matches. Still feeling disconnected.",
  },
  {
    title: "Maybe more options isn't the answer.",
    body: "Sometimes fewer, better introductions lead to better outcomes.",
  },
  {
    title: "What if you could just talk first?",
    body: "No instant judgments. No pressure to impress. No public labels.",
  },
];

const transitionCards = [
  {
    title: "That's Why Lumore Works Differently.",
    body: "Your intent guides the match, but it's never displayed.",
  },
  {
    title: "Talk anonymously first.",
    body: "You can be yourself before appearances shape the interaction.",
  },
  {
    title: "Meet one aligned person.",
    body: "Not endless options. Not a loop of comparisons.",
  },
];

function StoryCard({ title, body }: { title: string; body: string }) {
  return (
    <article className="w-[320px] md:w-[360px] rounded-xl border border-ui-highlight/30 bg-gradient-to-br from-ui-highlight/5 to-ui-highlight/20 p-5 shadow-xs">
      <h3 className="text-lg font-semibold leading-snug text-ui-shade">
        {title}
      </h3>
      <p className="mt-3 text-sm md:text-base leading-relaxed text-ui-shade/80">
        {body}
      </p>
    </article>
  );
}

export default function HowLumoreIsDifferent() {
  return (
    <section id="how-lumore-is-different" className="my-20">
      <div className="mx-auto flex flex-col items-center justify-center">
        <span className=" text-ui-shade bg-ui-primary px-2 py-1 -skew-x-12  uppercase tracking-wide inline-block mb-2">
          How Lumore Is Different?
        </span>

        <h2 className=" text-3xl md:text-5xl font-bold text-ui-highlight">
          Maybe it&apos;s not you.
        </h2>
        <p className="mt-3 max-w-3xl text-base md:text-lg text-ui-shade/85">
          Maybe it&apos;s the way dating works right now.
        </p>

        <div className="mt-8 w-full overflow-hidden">
          <Marquee pauseOnHover className="[--duration:65s] [--gap:1.25rem]">
            {reflectionCards.map((card) => (
              <StoryCard key={card.title} title={card.title} body={card.body} />
            ))}
          </Marquee>
          <Marquee
            pauseOnHover
            reverse
            className="mt-2 [--duration:55s] [--gap:1.25rem]"
          >
            {transitionCards.map((card) => (
              <StoryCard key={card.title} title={card.title} body={card.body} />
            ))}
          </Marquee>
        </div>
      </div>
    </section>
  );
}
