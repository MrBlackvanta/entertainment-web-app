"use client";

import { ShowSearch } from "@/components/shows";
import { movies, shows, tvSeries } from "@/data";
import { useBookmarks } from "@/lib";
import BookmarkedSection from "./bookmarked-section";

export default function BookmarkedShows() {
  const bookmarks = useBookmarks();

  return (
    <ShowSearch
      heading="Bookmarks"
      headingHidden
      label="Search for bookmarked shows"
      shows={shows.filter((show) => bookmarks.has(show.slug))}
    >
      <BookmarkedSection
        heading="Bookmarked Movies"
        emptyMessage="No bookmarked movies yet."
        shows={movies}
        bookmarks={bookmarks}
        priority
      />
      <BookmarkedSection
        heading="Bookmarked TV Series"
        emptyMessage="No bookmarked TV series yet."
        shows={tvSeries}
        bookmarks={bookmarks}
        className="mt-6 md:mt-12 lg:mt-10"
      />
    </ShowSearch>
  );
}
