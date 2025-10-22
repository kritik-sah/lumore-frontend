import { SanityDocument } from "next-sanity";
import React from "react";
import HeroPrimary from "./HeroPrimary";
import HeroSecondary from "./HeroSecondary";

const BlogHero = ({ posts }: { posts: SanityDocument[] }) => {
  return (
    <section
      id="blog-hero"
      className="rounded-b-[50px] relative overflow-hidden z-10 py-4 lg:py-10"
    >
      <div>
        <div className="absolute bottom-0 left-0 rounded-b-[50px] w-full h-full bg-gray"></div>
        <div className="hidden lg:block absolute bottom-0 left-0 rounded-b-[50px] w-full h-full">
          <img src="/assets/hero-bg.svg" alt="hero" />
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
