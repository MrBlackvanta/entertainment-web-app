import { ShowGrid, ShowSearch } from "@/components/shows";
import { SITE_NAME, tvSeries } from "@/data";
import { pageMetadata } from "@/lib";

export const metadata = pageMetadata({
  title: `${SITE_NAME} | TV Series`,
  description:
    "Every TV series in the catalogue with its year and rating. Search by title and bookmark the ones you want to watch next.",
  path: "/tv-series",
});

export default function TvSeriesPage() {
  return (
    <ShowSearch
      heading="TV Series"
      label="Search for TV series"
      shows={tvSeries}
    >
      <ShowGrid shows={tvSeries} headingLevel={2} priority />
    </ShowSearch>
  );
}
