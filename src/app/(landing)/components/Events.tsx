import React from "react";

const Events = () => {
  return (
    <section className="px-4 lg:px-0 mt-20">
      <div className="relative bg-[#F7F8F9] text-ui-shade/90 p-6 rounded-2xl max-w-7xl mx-auto border border-1 border-ui-shade/10">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-start gap-4">
          <span className="text-3xl font-bold text-ui-shade bg-ui-primary px-2 py-1 -skew-x-12">
            Events
          </span>
          <div className="max-w-2xl">
            <h3 className="text-2xl font-semibold">Upcoming events.</h3>
            <p className="mt-2 text-sm text-ui-shade/70">
              Curated meetups, board games, and spontaneous hangs in your city.
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-2xl overflow-hidden border border-ui-shade/10 bg-white shadow-[0_18px_40px_rgba(0,0,0,0.08)] p-2">
          <iframe
            src="https://luma.com/embed/calendar/cal-yIjBmTVHsWlce0n/events?lt=light"
            width={"100%"}
            height={450}
            aria-hidden="false"
            tabIndex={0}
          />
        </div>
      </div>
    </section>
  );
};

export default Events;
