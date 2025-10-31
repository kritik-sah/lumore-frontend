import Newsletter from "@/components/NewsLetter";
import { LinkPreview } from "@/components/ui/link-preview";
import { Separator } from "@/components/ui/separator";
import { client, imageUrl } from "@/sanity/client";
import type { Metadata, ResolvingMetadata } from "next";
import { PortableText, type SanityDocument } from "next-sanity";
import Link from "next/link";

const POST_QUERY = `*[_type == "blog" && slug.current == $slug][0]{
  _id,
  title,
  slug,
  excerpt,
  summary,
  publishedAt,
  featuredImage,
  content,
  category[]->{
    title,
    slug,
    parent->{
      title
    }
  }
}`;

const options = { next: { revalidate: 30 } };

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { slug } = await params; // 👈 unwrap params if it's a Promise
  const post = await client.fetch<SanityDocument>(
    POST_QUERY,
    { slug },
    options
  );
  if (!post) {
    return {
      title: "Post not found | Lumore Blog",
      description: "This post could not be found.",
    };
  }

  const postUrl = `https://www.lumore.xyz/blog/${post.slug.current}`;
  const postImageUrl = post.featuredImage
    ? imageUrl(post.featuredImage)
    : "https://www.lumore.xyz/"; // fallback OG image

  const description =
    post.summary || post.excerpt || "Read this insightful article on Lumore.";

  return {
    title: `${post.title} | Lumore Blog`,
    description,
    openGraph: {
      title: post.title,
      description,
      url: postUrl,
      type: "article",
      publishedTime: post.publishedAt,
      images: [
        {
          url: postImageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      images: [postImageUrl],
      creator: "@lumoreapp", // change to your handle
    },
    alternates: {
      canonical: postUrl,
    },
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const post = await client.fetch<SanityDocument>(
    POST_QUERY,
    await params,
    options
  );

  if (!post) {
    return (
      <main className="container mx-auto min-h-screen flex items-center justify-center">
        <p>Post not found</p>
      </main>
    );
  }

  const postImageUrl = imageUrl(post.featuredImage);

  return (
    <main className="container mx-auto min-h-screen max-w-3xl p-3 md:p-8 flex flex-col gap-6">
      <Link href="/blog" className="hover:underline">
        ← Back to posts
      </Link>

      <section className="py-6">
        <div className="max-w-[1030px] mx-auto px-4 sm:px-8 xl:px-0">
          <div className="max-w-[770px] mx-auto text-center">
            {post.category?.map((cat: any) => (
              <span
                key={cat.slug?.current}
                className="inline-flex text-ui-highlight bg-ui-highlight/[0.08] font-medium text-sm py-1 px-3 rounded-full"
              >
                {cat.title}
              </span>
            ))}

            <h1 className="font-bold text-2xl sm:text-4xl lg:text-custom-2 text-dark my-5">
              {post.title}
            </h1>
            <p className="text-body">{post.summary}</p>

            <div className="flex items-center justify-center gap-4 mt-7.5">
              <p>
                Published: {new Date(post.publishedAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <img
            src={postImageUrl}
            alt={post.title}
            className="my-20 w-full scale-125 rounded-xl"
          />

          <div className="max-w-[770px] mx-auto">
            <article className="prose prose-lg max-w-none">
              {Array.isArray(post.content) && (
                <PortableText
                  value={post.content}
                  components={{
                    types: {
                      image: ({ value }) => (
                        <img
                          src={imageUrl(value)}
                          alt={value.alt || "Blog image"}
                          className="rounded-lg my-4"
                        />
                      ),
                    },
                    marks: {
                      link: ({ value, children }) => (
                        <LinkPreview url={value.href}>
                          <Link
                            href={value.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-ui-highlight no-underline"
                          >
                            {children}
                          </Link>
                        </LinkPreview>
                      ),
                    },
                  }}
                />
              )}
            </article>
            <Separator className="mt-8 lg:mt-24" />
            <Newsletter />
          </div>
        </div>
      </section>
    </main>
  );
}
