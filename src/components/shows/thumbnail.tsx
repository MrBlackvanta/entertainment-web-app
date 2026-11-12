import { PlayIcon } from "@/components/icons";

interface ThumbnailProps {
  slug: string;
  loading: "eager" | "lazy";
  className?: string;
}

export default function Thumbnail({
  slug,
  loading,
  className = "",
}: ThumbnailProps) {
  const folder = `/thumbnails/${slug}/regular`;

  return (
    <div
      className={`group/thumbnail relative overflow-hidden rounded-thumbnail ${className}`}
    >
      <picture>
        <source
          media="(min-width: 64rem)"
          srcSet={`${folder}/large.webp`}
          width={560}
          height={348}
        />
        <source
          media="(min-width: 48rem)"
          srcSet={`${folder}/medium.webp`}
          width={440}
          height={280}
        />
        <img
          src={`${folder}/small.webp`}
          width={328}
          height={220}
          alt=""
          loading={loading}
          decoding="async"
          className="w-full"
        />
      </picture>
      <div
        aria-hidden="true"
        className="absolute inset-0 hidden place-items-center bg-scrim/75 group-hover/thumbnail:grid"
      >
        <span className="flex h-12 items-center gap-5 rounded-full bg-ink/25 pr-6 pl-2 text-card-title-lg">
          <PlayIcon className="size-7.5" />
          Play
        </span>
      </div>
    </div>
  );
}
