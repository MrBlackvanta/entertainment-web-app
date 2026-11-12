import {
  ShowGrid,
  ShowSearch,
  ShowSection,
  TrendingRow,
} from "@/components/shows";
import { recommendedShows, shows, SITE_NAME, trendingShows } from "@/data";
import { pageMetadata } from "@/lib";

export const metadata = pageMetadata({
  title: `${SITE_NAME} | Find your next movie or TV series`,
  description:
    "Browse trending movies and TV series, search the whole catalogue, and bookmark the shows you want to watch next.",
  path: "/",
});

export default function HomePage() {
  return (
    <ShowSearch
      heading={SITE_NAME}
      headingHidden
      label="Search for movies or TV series"
      shows={shows}
    >
      <ShowSection heading="Trending" headingClassName="mb-4 md:mb-6.25">
        <TrendingRow shows={trendingShows} />
      </ShowSection>
      <ShowSection heading="Recommended for you" className="mt-4 md:mt-8">
        <ShowGrid shows={recommendedShows} headingLevel={3} priority />
      </ShowSection>
    </ShowSearch>
  );
}
