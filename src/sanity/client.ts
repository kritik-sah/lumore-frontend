import imageUrlBuilder from "@sanity/image-url";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { createClient } from "next-sanity";

export const client = createClient({
  projectId: "rbpc2sfo",
  dataset: "production",
  apiVersion: "2025-10-21",
  useCdn: true,
});

export const urlFor = (source: SanityImageSource) =>
  imageUrlBuilder(client).image(source);

type ImageUrlOptions = {
  width?: number;
  height?: number;
  quality?: number;
};

export const imageUrl = (
  image: SanityImageSource,
  options: ImageUrlOptions = {},
) => {
  const { width = 550, height = 310, quality = 70 } = options;

  return urlFor(image)
    ?.width(width)
    .height(height)
    .quality(quality)
    .fit("max")
    .auto("format")
    .url();
};
