"use client";

import { client } from "@/sanity/client";
import { type SanityDocument } from "next-sanity";
import { useState } from "react";
import toast from "react-hot-toast";
import BlogPost from "./BlogPost";

const POSTS_PER_PAGE = 6;

export default function LoadMorePosts({
  initialCount = 12,
}: {
  initialCount?: number;
}) {
  const [posts, setPosts] = useState<SanityDocument[]>([]);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(initialCount);
  const [hasMore, setHasMore] = useState(true);

  const loadMore = async () => {
    setLoading(true);
    try {
      const newPosts = await client.fetch<SanityDocument[]>(
        `*[_type == "blog" && defined(slug.current)]
        | order(publishedAt desc)[$start...$end]{
          _id,
          title,
          slug,
          excerpt,
          publishedAt,
          featuredImage,
          category[]->{
            title,
            slug,
            parent->{ title }
          }
        }`,
        { start: offset, end: offset + POSTS_PER_PAGE },
      );

      if (newPosts.length === 0) {
        setHasMore(false);
      } else {
        setPosts((prev) => [...prev, ...newPosts]);
        setOffset((prev) => prev + POSTS_PER_PAGE);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load more posts");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-12 flex flex-col items-center">
      {posts.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-12 gap-x-7.5 w-full">
          {posts.map((post) => (
            <BlogPost key={post._id} post={post} />
          ))}
        </div>
      )}

      {hasMore && (
        <button
          onClick={loadMore}
          disabled={loading}
          className="mt-8 px-6 py-3 rounded-full bg-ui-primary text-ui-shade font-semibold border border-ui-shade/20 shadow-[6px_6px_0px_rgba(0,0,0,0.1)] hover:-translate-y-0.5 transition disabled:opacity-50"
          aria-busy={loading}
        >
          {loading ? "Loading..." : "Load More"}
        </button>
      )}

      {!hasMore && (
        <p className="mt-6 text-ui-shade/60">You&apos;ve reached the end!</p>
      )}
    </div>
  );
}
