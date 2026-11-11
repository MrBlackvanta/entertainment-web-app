import { SITE_NAME } from "@/data";
import { pageMetadata } from "@/lib";

export const metadata = pageMetadata({
  title: `${SITE_NAME} | Bookmarks`,
  description:
    "The movies and TV series you have bookmarked, saved in this browser and waiting for you when you come back.",
  path: "/bookmarked",
});

export default function BookmarkedPage() {
  return <h1 className="sr-only">Bookmarks</h1>;
}
