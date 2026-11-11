import { ShowSearch } from "@/components/shows";
import { SITE_NAME, shows } from "@/data";
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
    />
  );
}
