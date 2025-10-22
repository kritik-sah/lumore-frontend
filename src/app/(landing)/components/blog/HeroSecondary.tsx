import { imageUrl } from "@/sanity/client";
import { SanityDocument } from "next-sanity";
import Link from "next/link";
import React from "react";

const HeroSecondary = ({ post }: { post: SanityDocument }) => {
  const postImageUrl = imageUrl(post.featuredImage);
  return (
    <div className="lg:max-w-[570px] w-full flex flex-col sm:flex-row sm:items-center gap-6 bg-white shadow-1 rounded-xl p-2.5">
      <div className="lg:max-w-[238px] w-full">
        <Link href={`/blog/${post.slug.current}`}>
          <img className="w-full rounded-xl" src={postImageUrl} alt="hero" />
        </Link>
      </div>

      <div className="lg:max-w-[272px] w-full">
        {post.category.map((cat: any) => (
          <span
            key={cat.slug.current}
            className="inline-flex text-ui-highlight bg-ui-highlight/[0.08] font-medium text-sm py-1 px-3 rounded-full mb-4"
          >
            {cat.title}
          </span>
        ))}
        <h2 className="font-semibold text-custom-lg text-dark mb-3">
          <Link href={`/blog/${post.slug.current}`}>{post.title}</Link>
        </h2>
        <div className="flex items-center gap-2.5">
          <p className="text-sm">
            {new Date(post.publishedAt).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default HeroSecondary;
