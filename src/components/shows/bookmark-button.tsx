"use client";

import { BookmarkEmptyIcon, BookmarkFullIcon } from "@/components/icons";
import { toggleBookmark, updateKeepingFocus, useIsBookmarked } from "@/lib";

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

  return (
    <button
      type="button"
      aria-label={`Bookmark ${title}`}
      aria-pressed={bookmarked}
      data-bookmark={slug}
      onClick={(event) =>
        updateKeepingFocus(event.currentTarget, () => toggleBookmark(slug))
      }
      className={`group/bookmark grid size-8 place-items-center rounded-full bg-page/50 text-ink hover:bg-ink hover:text-page motion-safe:transition-[background-color,color] ${className}`}
    >
      <BookmarkEmptyIcon className="group-aria-pressed/bookmark:hidden" />
      <BookmarkFullIcon className="hidden group-aria-pressed/bookmark:block" />
    </button>
  );
}
