export type BlogCategory = {
  title: string;
  slug?: {
    current?: string;
  };
};

export type BlogListPost = {
  _id: string;
  title: string;
  slug: {
    current: string;
  };
  excerpt?: string;
  publishedAt: string;
  category: BlogCategory[];
  featuredImageUrl?: string;
};
