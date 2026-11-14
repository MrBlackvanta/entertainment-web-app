import { PlayIcon } from "@/components/icons";
import { thumbnailCrops, thumbnailSrc, type ThumbnailVariant } from "@/data";

interface ThumbnailProps {
  slug: string;
  variant?: ThumbnailVariant;
  loading: "eager" | "lazy";
  fetchPriority?: "high";
  className?: string;
}

export default function Thumbnail({
  slug,
  variant = "regular",
  loading,
  fetchPriority,
  className = "",
}: ThumbnailProps) {
  const { sources, fallback } = thumbnailCrops[variant];

  return (
    <div
      className={`group/thumbnail relative overflow-hidden rounded-thumbnail ${className}`}
    >
      <picture>
        {sources.map(({ media, name, width, height }) => (
          <source
            key={name}
            media={media}
            srcSet={thumbnailSrc(slug, variant, name)}
            width={width}
            height={height}
          />
        ))}
        <img
          src={thumbnailSrc(slug, variant, fallback.name)}
          width={fallback.width}
          height={fallback.height}
          alt=""
          loading={loading}
          fetchPriority={fetchPriority}
          decoding="async"
          className="w-full"
        />
      </picture>
      <div
        aria-hidden="true"
        className="absolute inset-0 grid place-items-center bg-scrim/75 opacity-0 group-hover/thumbnail:opacity-100 motion-safe:transition-opacity motion-safe:duration-300"
      >
        <span className="flex h-12 scale-90 items-center gap-5 rounded-full bg-ink/25 pr-6 pl-2 text-card-title-lg group-hover/thumbnail:scale-100 motion-safe:transition-transform motion-safe:duration-300">
          <PlayIcon className="size-7.5" />
          Play
        </span>
      </div>
    </div>
  );
}
