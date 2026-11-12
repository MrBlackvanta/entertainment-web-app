import { ShowGrid, ShowSearch } from "@/components/shows";
import { movies, SITE_NAME } from "@/data";
import { pageMetadata } from "@/lib";

export const metadata = pageMetadata({
  title: `${SITE_NAME} | Movies`,
  description:
    "Every movie in the catalogue with its year and rating. Search by title and bookmark the ones you want to watch next.",
  path: "/movies",
});

export default function MoviesPage() {
  return (
    <ShowSearch heading="Movies" label="Search for movies" shows={movies}>
      <ShowGrid shows={movies} headingLevel={2} priority />
    </ShowSearch>
  );
}
