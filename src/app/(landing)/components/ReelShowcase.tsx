const ReelShowcase = () => {
  return (
    <section id="reel-showcase" className="my-6">
      <div className="px-4 lg:px-0 max-w-7xl mx-auto">
        <div className="relative w-full flex flex-col md:flex-row items-start justify-between bg-gradient-to-b from-ui-highlight/10 to-ui-highlight/30  border border-ui-highlight/30 overflow-hidden p-4 md:p-8 rounded-2xl shadow-2xl gap-6">
          <div className="relative z-10 h-auto w-full md:w-96 aspect-[9/16]">
            <video
              className="h-full w-full rounded-2xl object-cover shadow-2xl"
              autoPlay
              loop
              muted
              playsInline
              preload="none"
              poster="/assets/login-screen.webp"
            >
              <source
                src="https://ik.imagekit.io/rebel/reel/reel2.mp4?tr=q-55,vc-auto,w-540&updatedAt=1761736348210"
                type="video/mp4"
              />
            </video>
          </div>
          <div className="relative z-10 flex-1 h-full shrink-0 flex-grow pt-4 md:pt-8">
            <div className="flex flex-col items-start justify-center gap-6">
              <span className=" text-ui-shade bg-ui-primary px-2 py-1 -skew-x-12  uppercase tracking-wide inline-block">
                Watch a real moment
              </span>

              <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-ui-highlight text-balance">
                Feeling exhausted after using dating apps.
              </h2>
              <p className="text-lg italic text-ui-shade/80 max-w-2xl">
                Experience the magic of spontaneous connections through our
                reel. See how our platform brings people together in real-time,
                creating unforgettable moments and genuine interactions.
              </p>
            </div>
          </div>
          <span className="font-dmSans -tracking-[16px] leading-0 font-bold italic absolute bottom-16 right-4 text-[220px] text-ui-light/60">
            Lumore
          </span>
        </div>
      </div>
    </section>
  );
};

export default ReelShowcase;
