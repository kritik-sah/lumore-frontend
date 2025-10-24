import { client } from "@/sanity/client";
import type { MetadataRoute } from "next";
import { SanityDocument } from "next-sanity";

const POSTS_QUERY = `*[
  _type == "blog" && defined(slug.current)
]|order(publishedAt desc){
  slug,
  _updatedAt
}`;
const options = { next: { revalidate: 30 } };
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await client.fetch<SanityDocument[]>(POSTS_QUERY, {}, options);

  const baseUrl = "https://www.lumore.xyz";

  const blogUrls =
    posts?.map((post) => ({
      url: `${baseUrl}/blog/${post.slug.current}`,
      lastModified: post._updatedAt ? new Date(post._updatedAt) : new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })) || [];

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 1,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/terms-of-use`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...blogUrls,
  ];
}
