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
  const { slug } = await params;
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
    : "https://www.lumore.xyz/";

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
      creator: "@lumoreapp",
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
  const summary = post.summary || post.excerpt;
  const publishedAt = new Date(post.publishedAt);
  const postUrl = `https://www.lumore.xyz/blog/${post.slug.current}`;

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: summary,
    image: postImageUrl ? [postImageUrl] : undefined,
    datePublished: post.publishedAt,
    mainEntityOfPage: postUrl,
    author: {
      "@type": "Organization",
      name: "Lumore",
      url: "https://www.lumore.xyz",
    },
    publisher: {
      "@type": "Organization",
      name: "Lumore",
      logo: {
        "@type": "ImageObject",
        url: "https://www.lumore.xyz/apple-touch-icon.png",
      },
    },
  };

  return (
    <main className="container mx-auto min-h-screen max-w-4xl px-4 py-8 md:py-12 flex flex-col gap-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      <nav className="text-sm text-ui-shade/70">
        <Link href="/blog" className="hover:underline">
          \u2190 Back to posts
        </Link>
      </nav>

      <header className="text-center">
        <div className="flex flex-wrap items-center justify-center gap-2">
          {post.category?.map((cat: any) => (
            <span
              key={cat.slug?.current}
              className="inline-flex text-ui-highlight bg-ui-highlight/[0.08] font-medium text-sm py-1 px-3 rounded-full"
            >
              {cat.title}
            </span>
          ))}
        </div>

        <h1 className="font-bold text-3xl sm:text-4xl lg:text-5xl text-ui-shade mt-4">
          {post.title}
        </h1>
        {summary ? (
          <p className="mt-4 text-base md:text-lg text-ui-shade/70">
            {summary}
          </p>
        ) : null}

        <div className="flex items-center justify-center gap-4 mt-6 text-ui-shade/70">
          <time dateTime={publishedAt.toISOString()}>
            Published {publishedAt.toLocaleDateString()}
          </time>
        </div>
      </header>

      {postImageUrl ? (
        <figure className="my-6">
          <img
            src={postImageUrl}
            alt={post.title}
            className="w-full rounded-2xl border border-black/5 shadow-[10px_10px_0px_rgba(0,0,0,0.08)]"
          />
        </figure>
      ) : null}

      <section className="max-w-3xl mx-auto w-full">
        <article
          className="prose prose-lg md:prose-xl max-w-none prose-headings:font-dmSans prose-a:text-ui-highlight prose-a:no-underline"
          itemScope
          itemType="https://schema.org/Article"
        >
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
        <Separator className="mt-8 lg:mt-16" />
        <Newsletter />
      </section>
    </main>
  );
}
