import { imageUrl } from "@/sanity/client";
import { SanityDocument } from "next-sanity";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const HeroSecondary = ({ post }: { post: SanityDocument }) => {
  const postImageUrl = imageUrl(post.featuredImage, {
    width: 640,
    height: 640,
    quality: 62,
  });

  return (
    <article className="lg:max-w-[570px] w-full flex flex-col sm:flex-row sm:items-center gap-6 bg-ui-light shadow-[8px_8px_0px_rgba(0,0,0,0.08)] rounded-2xl p-3 border border-ui-shade/10">
      <div className="lg:max-w-[238px] w-full">
        <Link href={`/blog/${post.slug.current}`} prefetch={false}>
          <div className="relative w-full overflow-hidden rounded-2xl aspect-square bg-ui-background/40">
            {postImageUrl ? (
              <Image
                className="object-cover"
                src={postImageUrl}
                alt={post.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 45vw, 238px"
                quality={65}
              />
            ) : null}
          </div>
        </Link>
      </div>

      <div className="lg:max-w-[272px] w-full">
        <div className="flex flex-wrap gap-2">
          {post.category.slice(0, 2).map((cat: any) => (
            <span
              key={cat.slug.current}
              className="inline-flex text-ui-highlight bg-ui-highlight/[0.08] font-medium text-xs py-1 px-2 rounded-full"
            >
              {cat.title}
            </span>
          ))}
          {post.category.length > 2 && (
            <span className="inline-flex text-ui-highlight bg-ui-highlight/[0.08] font-medium text-xs py-1 px-2 rounded-full">
              +{post.category.length - 2}
            </span>
          )}
        </div>
        <h3 className="font-semibold text-lg md:text-xl text-ui-shade my-3 leading-tight">
          <Link href={`/blog/${post.slug.current}`} prefetch={false}>
            {post.title}
          </Link>
        </h3>
        <time
          className="text-sm text-ui-shade/70"
          dateTime={new Date(post.publishedAt).toISOString()}
        >
          {new Date(post.publishedAt).toLocaleDateString()}
        </time>
      </div>
    </article>
  );
};

export default HeroSecondary;

