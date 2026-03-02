export default function HowLumoreWorks() {
  return (
    <section id="how-lumore-works" className="my-6 px-4 lg:px-0">
      <div className="max-w-7xl mx-auto rounded-2xl border border-ui-highlight/30 bg-gradient-to-t from-ui-highlight/10 to-ui-highlight/30 p-6 md:p-8">
        <span className=" text-ui-shade bg-ui-primary px-2 py-1 -skew-x-12  uppercase tracking-wide inline-block mb-2">
          Dating, Curated
        </span>
        <h3 className="text-2xl font-semibold">How Lumore Works?</h3>
        <h3 className="hidden">How Lumore a swipeless dating app Works?</h3>

        <p className="max-w-lg">
          A more considered way to meet like minded people, without wasting time
          on endless swiping.
        </p>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <article className="relative overflow-hidden rounded-xl border border-ui-shade/10 bg-ui-light p-5 shadow-[0_12px_30px_rgba(0,0,0,0.06)]">
            <p className="text-lg font-semibold uppercase tracking-wide text-ui-highlight">
              Define Your Intent
            </p>
            <p className="mt-3 text-ui-shade/90">
              Tell us who you are and what kind of relationship you're looking
              for.
            </p>
            <span className="font-dmSans -tracking-[16px] leading-0 font-bold italic absolute bottom-16 right-10 text-[220px] text-ui-highlight/10">
              1
            </span>
          </article>

          <article className="relative overflow-hidden rounded-xl border border-ui-shade/10 bg-ui-light p-5 shadow-[0_12px_30px_rgba(0,0,0,0.06)]">
            <p className="text-lg font-semibold uppercase tracking-wide text-ui-highlight">
              Receive One Introduction
            </p>
            <p className="mt-3 text-ui-shade/90">
              When you tap Start Matching, we connect you with one highly
              compatible person nearby.
            </p>
            <span className="font-dmSans -tracking-[16px] leading-0 font-bold italic absolute bottom-16 right-10 text-[220px] text-ui-highlight/10">
              2
            </span>
          </article>

          <article className="relative overflow-hidden rounded-xl border border-ui-shade/10 bg-ui-light p-5 shadow-[0_12px_30px_rgba(0,0,0,0.06)]">
            <p className="text-lg font-semibold uppercase tracking-wide text-ui-highlight">
              Connect Before You Reveal
            </p>
            <p className="mt-2 text-ui-shade/80">
              Chat anonymously first, and unlock profiles only if the connection
              feels right.
            </p>
            <span className="font-dmSans -tracking-[16px] leading-0 font-bold italic absolute bottom-16 right-10 text-[220px] text-ui-highlight/10">
              3
            </span>
          </article>
        </div>

        <p className="mt-8 text-base md:text-lg italic text-ui-shade/80">
          Because meaningful connections don&apos;t begin with scrolling.
        </p>
      </div>
    </section>
  );
}
