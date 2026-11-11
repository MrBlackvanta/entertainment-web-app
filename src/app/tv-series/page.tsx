import { SITE_NAME } from "@/data";
import { pageMetadata } from "@/lib";

export const metadata = pageMetadata({
  title: `${SITE_NAME} | TV Series`,
  description:
    "Every TV series in the catalogue with its year and rating. Search by title and bookmark the ones you want to watch next.",
  path: "/tv-series",
});

export default function TvSeriesPage() {
  return <h1 className="text-heading md:text-heading-lg">TV Series</h1>;
}
