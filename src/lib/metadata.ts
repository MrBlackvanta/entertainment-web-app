import { SITE_NAME } from "@/data";
import type { Metadata } from "next";

const shareImage = {
  url: "/opengraph-image.jpg",
  width: 1200,
  height: 630,
  alt: "Matinee, beside the app's trending row and grid of movie and TV series thumbnails.",
};

export const openGraphBase = {
  siteName: SITE_NAME,
  locale: "en_US",
  type: "website",
  images: [shareImage],
} satisfies Metadata["openGraph"];

export const twitterBase = {
  card: "summary_large_image",
  images: [shareImage],
} satisfies Metadata["twitter"];

type PageMetadata = {
  title: string;
  description: string;
  path: string;
};

export function pageMetadata({
  title,
  description,
  path,
}: PageMetadata): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { ...openGraphBase, title, description, url: path },
    twitter: { ...twitterBase, title, description },
  };
}
