import { SanityDocument } from "next-sanity";
import React from "react";
import HeroPrimary from "./HeroPrimary";
import HeroSecondary from "./HeroSecondary";

const BlogHero = ({ posts }: { posts: SanityDocument[] }) => {
  return (
    <section
      id="blog-hero"
      className="rounded-3xl relative overflow-hidden z-10 py-6 lg:py-10 bg-[radial-gradient(circle_at_15%_15%,rgba(255,212,0,0.18),transparent_45%),radial-gradient(circle_at_85%_0%,rgba(84,19,136,0.12),transparent_40%)]"
      aria-label="Featured posts"
    >
      <div className="absolute inset-0">
        <div className="absolute bottom-0 left-0 rounded-3xl w-full h-full bg-ui-light/40"></div>
        <div className="hidden lg:block absolute bottom-0 left-0 rounded-3xl w-full h-full opacity-70">
          <img src="/assets/hero-bg.svg" alt="" aria-hidden="true" />
        </div>
      </div>

      <div className="mx-auto max-w-[1170px] px-4 sm:px-8 xl:px-0 relative z-1">
        <div className="flex flex-wrap gap-x-7.5 gap-y-9">
          {posts[0]?.title ? <HeroPrimary post={posts[0]} /> : null}
          {posts[1]?.title ? <HeroSecondary post={posts[1]} /> : null}
          {posts[2]?.title ? <HeroSecondary post={posts[2]} /> : null}
        </div>
      </div>
    </section>
  );
};

export default BlogHero;
