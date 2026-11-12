export type ThumbnailVariant = "regular" | "trending";

interface ThumbnailCrop {
  name: string;
  width: number;
  height: number;
}

interface ThumbnailSource extends ThumbnailCrop {
  media: string;
}

interface ArtDirectedCrops {
  sources: readonly ThumbnailSource[];
  fallback: ThumbnailCrop;
}

export const thumbnailCrops: Record<ThumbnailVariant, ArtDirectedCrops> = {
  regular: {
    sources: [
      { media: "(min-width: 64rem)", name: "large", width: 560, height: 348 },
      { media: "(min-width: 48rem)", name: "medium", width: 440, height: 280 },
    ],
    fallback: { name: "small", width: 328, height: 220 },
  },
  trending: {
    sources: [
      { media: "(min-width: 48rem)", name: "large", width: 940, height: 460 },
    ],
    fallback: { name: "small", width: 480, height: 280 },
  },
};

export function thumbnailSrc(
  slug: string,
  variant: ThumbnailVariant,
  crop: string,
) {
  return `/thumbnails/${slug}/${variant}/${crop}.webp`;
}
