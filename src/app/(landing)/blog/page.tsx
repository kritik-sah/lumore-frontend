import { client } from "@/sanity/client";
import { type SanityDocument } from "next-sanity";

import BlogHero from "../components/blog/BlogHero";
import BlogPost from "../components/blog/BlogPost";
import LoadMorePosts from "../components/blog/LoadMorePosts";

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

export default async function IndexPage() {
  const posts = await client.fetch<SanityDocument[]>(POSTS_QUERY, {}, options);

  return (
    <main className="container mx-auto min-h-screen p-1 lg:p-6">
      {posts?.length ? (
        <>
          <BlogHero posts={posts} />
          <section className="pt-20 lg:pt-25 pb-15">
            <div className="max-w-[1170px] mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-11 gap-x-7.5">
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
