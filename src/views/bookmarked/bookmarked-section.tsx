import {
  EAGER_CARDS,
  ShowCard,
  ShowList,
  ShowSection,
} from "@/components/shows";
import type { Show } from "@/data";

interface BookmarkedSectionProps {
  heading: string;
  emptyMessage: string;
  shows: readonly Show[];
  bookmarks: ReadonlySet<string>;
  priority?: boolean;
  className?: string;
}

export default function BookmarkedSection({
  heading,
  emptyMessage,
  shows,
  bookmarks,
  priority = false,
  className,
}: BookmarkedSectionProps) {
  const prerenderedShows = shows.filter((show) => show.isBookmarked);
  const eagerSlugs = new Set(
    prerenderedShows
      .slice(0, priority ? EAGER_CARDS : 0)
      .map((show) => show.slug),
  );
  const isEmpty = !shows.some((show) => bookmarks.has(show.slug));

  return (
    <ShowSection heading={heading} className={className}>
      <ShowList data-bookmarked-list hidden={isEmpty} className="peer/list">
        {shows.map((show) => (
          <li key={show.slug} hidden={!bookmarks.has(show.slug)}>
            <ShowCard
              show={show}
              headingLevel={3}
              loading={eagerSlugs.has(show.slug) ? "eager" : "lazy"}
            />
          </li>
        ))}
      </ShowList>
      <p className="hidden text-search text-ink/75 peer-[[hidden]]/list:block md:text-search-lg">
        {emptyMessage}
      </p>
    </ShowSection>
  );
}
