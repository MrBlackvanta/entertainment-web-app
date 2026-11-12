"use client";

import { BookmarkEmptyIcon, BookmarkFullIcon } from "@/components/icons";
import { toggleBookmark, useIsBookmarked } from "@/lib";

interface BookmarkButtonProps {
  slug: string;
  title: string;
  className?: string;
}

export default function BookmarkButton({
  slug,
  title,
  className = "",
}: BookmarkButtonProps) {
  const bookmarked = useIsBookmarked(slug);
  const Icon = bookmarked ? BookmarkFullIcon : BookmarkEmptyIcon;

  return (
    <button
      type="button"
      aria-label={`Bookmark ${title}`}
      aria-pressed={bookmarked}
      onClick={() => toggleBookmark(slug)}
      className={`grid size-8 place-items-center rounded-full bg-page/50 text-ink hover:bg-ink hover:text-page motion-safe:transition-[background-color,color] ${className}`}
    >
      <Icon />
    </button>
  );
}
