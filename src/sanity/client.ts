import imageUrlBuilder from "@sanity/image-url";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { createClient } from "next-sanity";

export const client = createClient({
  projectId: "rbpc2sfo",
  dataset: "production",
  apiVersion: "2025-10-21",
  useCdn: false,
});

export const urlFor = (source: SanityImageSource) =>
  imageUrlBuilder(client).image(source);

export const imageUrl = (image: any) => {
  return urlFor(image)?.width(550).height(310).url();
};
