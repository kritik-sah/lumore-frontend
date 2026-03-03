"use client";

import { useState } from "react";
import BlogPostClient from "./BlogPostClient";
import type { BlogListPost } from "./types";

const POSTS_PER_PAGE = 6;

export default function LoadMorePosts({
  initialCount = 12,
}: {
  initialCount?: number;
}) {
  const [posts, setPosts] = useState<BlogListPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(initialCount);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadMore = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/blog/load-more?start=${offset}&end=${offset + POSTS_PER_PAGE}`,
      );

      if (!response.ok) {
        throw new Error("Unable to load additional posts.");
      }

      const newPosts: BlogListPost[] = await response.json();

      if (newPosts.length === 0) {
        setHasMore(false);
      } else {
        setPosts((prev) => [...prev, ...newPosts]);
        setOffset((prev) => prev + POSTS_PER_PAGE);
      }
    } catch {
      setError("Could not load more posts. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-12 flex flex-col items-center">
      {posts.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-12 gap-x-7.5 w-full">
          {posts.map((post) => (
            <BlogPostClient key={post._id} post={post} />
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

      {error ? (
        <p className="mt-4 text-sm text-ui-shade/70" role="status">
          {error}
        </p>
      ) : null}

      {!hasMore && (
        <p className="mt-6 text-ui-shade/60">You&apos;ve reached the end!</p>
      )}
    </div>
  );
}

