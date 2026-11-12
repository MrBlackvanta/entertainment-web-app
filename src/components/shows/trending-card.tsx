import type { Show } from "@/data";
import BookmarkButton from "./bookmark-button";
import ShowMeta from "./show-meta";
import Thumbnail from "./thumbnail";

interface TrendingCardProps {
  show: Show;
  loading: "eager" | "lazy";
  fetchPriority?: "high";
}

export default function TrendingCard({
  show,
  loading,
  fetchPriority,
}: TrendingCardProps) {
  return (
    <article className="relative">
      <Thumbnail
        slug={show.slug}
        variant="trending"
        loading={loading}
        fetchPriority={fetchPriority}
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex h-17.5 flex-col justify-end gap-1 rounded-b-thumbnail bg-linear-to-b/srgb from-scrim/0 to-scrim/75 to-30% px-4 pb-4 md:h-25 md:gap-0.75 md:px-6 md:pb-6">
        <h3 className="order-last text-trending-title md:text-trending-title-lg">
          {show.title}
        </h3>
        <ShowMeta show={show} variant="trending" />
      </div>
      <BookmarkButton
        slug={show.slug}
        title={show.title}
        className="absolute top-2 right-2 md:top-4 md:right-6"
      />
    </article>
  );
}
