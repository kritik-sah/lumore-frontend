import React from "react";

const Events = () => {
  return (
    <section className=" px-4 lg:px-0 mt-20">
      <div className="relative bg-[#F7F8F9] text-ui-shade/90 p-6 rounded-2xl max-w-7xl mx-auto border border-1 border-ui-shade/10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="">
            <h3 className="text-2xl font-semibold">Upcoming events.</h3>
            <p className="mt-2 max-w-lg">Join us in this exciting journey</p>
          </div>
        </div>

        <div className="rounded-2xl overflow-hidden">
          <iframe
            src="https://luma.com/embed/calendar/cal-yIjBmTVHsWlce0n/events?lt=light"
            width={"100%"}
            height={450}
            // frameBorder={0}
            // allowFullScreen
            aria-hidden="false"
            tabIndex={0}
          />
        </div>
      </div>
    </section>
  );
};

export default Events;
