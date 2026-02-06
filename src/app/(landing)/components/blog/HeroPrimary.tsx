import { imageUrl } from "@/sanity/client";
import { SanityDocument } from "next-sanity";
import Link from "next/link";
import React from "react";

const HeroPrimary = ({ post }: { post: SanityDocument }) => {
  const postImageUrl = imageUrl(post.featuredImage);
  return (
    <article className="max-w-[1170px] w-full flex flex-col lg:flex-row lg:items-center gap-7.5 lg:gap-11 bg-white shadow-[10px_10px_0px_rgba(0,0,0,0.08)] rounded-2xl p-4 lg:p-3 border border-black/5">
      <div className="lg:max-w-[536px] w-full">
        <Link href={`/blog/${post.slug.current}`}>
          <img
            className="w-full rounded-2xl aspect-[16/9] object-cover"
            src={postImageUrl}
            alt={post.title}
          />
        </Link>
      </div>

      <div className="lg:max-w-[540px] w-full">
        {post.category.map((cat: any) => (
          <span
            key={cat.slug.current}
            className="inline-flex text-ui-highlight bg-ui-highlight/[0.08] font-medium text-sm py-1 px-3 rounded-full mb-4"
          >
            {cat.title}
          </span>
        ))}

        <h2 className="font-bold text-2xl sm:text-3xl lg:text-4xl text-ui-shade mb-4 leading-tight">
          <Link href={`/blog/${post.slug.current}`}>{post.title}</Link>
        </h2>
        <p className="max-w-[524px] line-clamp-2 text-ui-shade/70">
          {post.excerpt}
        </p>
        <div className="flex items-center gap-2.5 mt-5 text-ui-shade/70">
          {/* <a href="author.html" className="flex items-center gap-3">
            <div className="flex w-6 h-6 rounded-full overflow-hidden">
              <img src="images/user-01.png" alt="user" />
            </div>
            <p className="text-sm">Adrio Devid</p>
          </a>

          <span className="flex w-[3px] h-[3px] rounded-full bg-dark-2"></span> */}

          <time
            className="text-sm"
            dateTime={new Date(post.publishedAt).toISOString()}
          >
            {new Date(post.publishedAt).toLocaleDateString()}
          </time>
        </div>
      </div>
    </article>
  );
};

export default HeroPrimary;
