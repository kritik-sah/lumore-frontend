import { client, imageUrl } from "@/sanity/client";
import { NextResponse } from "next/server";

const LOAD_MORE_QUERY = `*[_type == "blog" && defined(slug.current)]
  | order(publishedAt desc)[$start...$end]{
    _id,
    title,
    slug,
    excerpt,
    publishedAt,
    featuredImage,
    category[]->{
      title,
      slug
    }
  }`;

const FETCH_OPTIONS = { next: { revalidate: 300 } };
const MAX_BATCH_SIZE = 18;

type QueryPost = {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt?: string;
  publishedAt: string;
  featuredImage?: unknown;
  category?: Array<{
    title: string;
    slug?: { current?: string };
  }>;
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const start = Number.parseInt(searchParams.get("start") || "0", 10);
  const end = Number.parseInt(searchParams.get("end") || "0", 10);

  if (
    Number.isNaN(start) ||
    Number.isNaN(end) ||
    start < 0 ||
    end <= start ||
    end - start > MAX_BATCH_SIZE
  ) {
    return NextResponse.json({ error: "Invalid range" }, { status: 400 });
  }

  const posts = await client.fetch<QueryPost[]>(
    LOAD_MORE_QUERY,
    { start, end },
    FETCH_OPTIONS,
  );

  const response = posts.map((post) => ({
    _id: post._id,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    publishedAt: post.publishedAt,
    category: post.category ?? [],
    featuredImageUrl: post.featuredImage
      ? imageUrl(post.featuredImage, {
          width: 760,
          height: 428,
          quality: 60,
        })
      : undefined,
  }));

  return NextResponse.json(response);
}
