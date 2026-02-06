import { imageUrl } from "@/sanity/client";
import { SanityDocument } from "next-sanity";
import Link from "next/link";
import React from "react";

const BlogPost = ({ post }: { post: SanityDocument }) => {
  const postImageUrl = imageUrl(post.featuredImage);
  return (
    <article className="group flex flex-col h-full">
      <div className="mb-5 overflow-hidden rounded-2xl border border-black/10 bg-white transition-all group-hover:-translate-y-1 group-hover:shadow-[8px_8px_0px_rgba(0,0,0,0.12)]">
        <Link href={`/blog/${post.slug.current}`}>
          <img
            src={postImageUrl}
            alt={post.title}
            className="w-full aspect-[16/9] object-cover"
            loading="lazy"
          />
        </Link>
      </div>

      <h3 className="leading-tight">
        <Link
          href={`/blog/${post.slug.current}`}
          className="block text-ui-shade font-bold text-xl md:text-2xl mb-3"
        >
          <span className="bg-linear-to-r from-ui-highlight/50 to-ui-highlight/40 bg-[length:0px_10px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500 hover:bg-[length:100%_3px] group-hover:bg-[length:100%_10px]">
            {post.title}
          </span>
        </Link>
      </h3>
      <p className="line-clamp-2 text-ui-shade/70">{post.excerpt}</p>

      <div className="mt-4 flex flex-wrap gap-3 items-center justify-between">
        <time
          className="text-sm text-ui-shade/70"
          dateTime={new Date(post.publishedAt).toISOString()}
        >
          {new Date(post.publishedAt).toLocaleDateString()}
        </time>
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
    </article>
  );
};

export default BlogPost;
