import { SITE_NAME } from "@/data";
import {
  BOOKMARKS_PREPAINT_SCRIPT,
  BOOKMARKS_PREPAINT_SCRIPT_ID,
  pageMetadata,
} from "@/lib";
import { BookmarkedShows } from "@/views/bookmarked";

export const metadata = pageMetadata({
  title: `${SITE_NAME} | Bookmarks`,
  description:
    "The movies and TV series you have bookmarked, saved in this browser and waiting for you when you come back.",
  path: "/bookmarked",
});

export default function BookmarkedPage() {
  return (
    <>
      <link
        rel="expect"
        href={`#${BOOKMARKS_PREPAINT_SCRIPT_ID}`}
        blocking="render"
      />
      <BookmarkedShows />
      <script
        id={BOOKMARKS_PREPAINT_SCRIPT_ID}
        dangerouslySetInnerHTML={{ __html: BOOKMARKS_PREPAINT_SCRIPT }}
      />
    </>
  );
}
