import { client } from "@/sanity/client";
import { type SanityDocument } from "next-sanity";

import BlogHero from "../components/blog/BlogHero";
import BlogPost from "../components/blog/BlogPost";
import LoadMorePosts from "../components/blog/LoadMorePosts";
import type { Metadata } from "next";

const POSTS_QUERY = `*[
  _type == "blog"
  && defined(slug.current)
]|order(publishedAt desc)[0...12]{_id, title, slug, excerpt, publishedAt, featuredImage , category[]->{
    title,
    slug,
    parent->{
      title
    }
  }}`;

const options = { next: { revalidate: 30 } };

export const metadata: Metadata = {
  title: "Lumore Blog | Real Connections, Real Stories",
  description:
    "Explore Lumore’s blog for thoughtful pieces on meaningful connection, community events, and social discovery—no endless swiping.",
  alternates: {
    canonical: "https://www.lumore.xyz/blog",
  },
  openGraph: {
    title: "Lumore Blog | Real Connections, Real Stories",
    description:
      "Explore Lumore’s blog for thoughtful pieces on meaningful connection, community events, and social discovery—no endless swiping.",
    url: "https://www.lumore.xyz/blog",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Lumore Blog | Real Connections, Real Stories",
    description:
      "Explore Lumore’s blog for thoughtful pieces on meaningful connection, community events, and social discovery—no endless swiping.",
  },
};

export default async function IndexPage() {
  const posts = await client.fetch<SanityDocument[]>(POSTS_QUERY, {}, options);

  return (
    <main className="container mx-auto min-h-screen px-4 py-6 lg:py-10">
      {posts?.length ? (
        <>
          <header className="max-w-[1170px] mx-auto mb-8">
            <p className="text-xs uppercase tracking-wide text-ui-shade/70">
              Lumore Blog
            </p>
            <h1 className="text-3xl md:text-5xl font-bold text-ui-shade mt-2">
              Real connections. Real stories.
            </h1>
            <p className="mt-3 max-w-2xl text-base md:text-lg text-ui-shade/70">
              Updates, insights, and community moments from Lumore—designed for
              people who want more than swipes.
            </p>
          </header>
          <BlogHero posts={posts} />
          <section className="pt-16 lg:pt-20 pb-12" aria-labelledby="all-posts">
            <div className="max-w-[1170px] mx-auto">
              <div className="flex items-center justify-between mb-6">
                <h2 id="all-posts" className="text-2xl font-bold text-ui-shade">
                  All posts
                </h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-12 gap-x-7.5">
                {posts.slice(3).map((post) => (
                  <BlogPost key={post?._id} post={post} />
                ))}
              </div>

              <LoadMorePosts initialCount={12} />
            </div>
          </section>
        </>
      ) : null}
    </main>
  );
}

// {posts.map((post) => {
//           const postImageUrl = imageUrl(post.featuredImage);
//           return (
//             <li className="hover:underline" key={post._id}>
//               <Link href={`/blog/${post.slug.current}`}>
//                 {postImageUrl && (
//                   <img
//                     src={postImageUrl}
//                     alt={post.title}
//                     className="aspect-video rounded-xl"
//                     width="550"
//                     height="310"
//                   />
//                 )}
//                 {post.category.map((cat: any) => (
//                   <span key={cat.slug.current} className="category">
//                     {cat.title}
//                   </span>
//                 ))}
//                 <h2 className="text-xl font-semibold">{post.title}</h2>
//                 <p>{post.excerpt}</p>
//                 <p>{new Date(post.publishedAt).toLocaleDateString()}</p>
//               </Link>
//             </li>
//           );
//         })}
