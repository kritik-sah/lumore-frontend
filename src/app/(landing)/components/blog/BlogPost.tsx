import { imageUrl } from "@/sanity/client";
import { SanityDocument } from "next-sanity";
import Link from "next/link";
import React from "react";

const BlogPost = ({ post }: { post: SanityDocument }) => {
  const postImageUrl = imageUrl(post.featuredImage);
  return (
    <div className="group">
      <div className="mb-6 overflow-hidden rounded-[10px] transition-all group-hover:scale-105">
        <Link href={`/blog/${post.slug.current}`}>
          <img src={postImageUrl} alt="image" className="w-full rounded-xl" />
        </Link>
      </div>

      <h3>
        <Link
          href={`/blog/${post.slug.current}`}
          className="block text-dark font-bold text-xl mb-3.5"
        >
          <span className="bg-linear-to-r from-ui-highlight/50 to-ui-highlight/40 bg-[length:0px_10px] bg-left-bottom bg-no-repeat transition-[background-size] duration-500 hover:bg-[length:100%_3px] group-hover:bg-[length:100%_10px]">
            {post.title}
          </span>
        </Link>
      </h3>
      <p className="line-clamp-2">{post.excerpt}</p>

      <div className="flex flex-wrap gap-3 items-center justify-between mt-4.5">
        <div className="flex items-center gap-2.5">
          <p className="text-sm">
            {new Date(post.publishedAt).toLocaleDateString()}
          </p>
        </div>
        {post.category.map((cat: any) => (
          <span
            key={cat.slug.current}
            className="inline-flex text-ui-highlight bg-ui-highlight/[0.08] font-medium text-sm py-1 px-3 rounded-full"
          >
            {cat.title}
          </span>
        ))}
      </div>
    </div>
  );
};

export default BlogPost;
