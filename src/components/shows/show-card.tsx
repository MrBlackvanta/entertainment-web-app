import type { Show } from "@/data";
import BookmarkButton from "./bookmark-button";
import ShowMeta from "./show-meta";
import Thumbnail from "./thumbnail";

interface ShowCardProps {
  show: Show;
  headingLevel: 2 | 3;
  loading: "eager" | "lazy";
}

export default function ShowCard({
  show,
  headingLevel,
  loading,
}: ShowCardProps) {
  const Heading = headingLevel === 2 ? "h2" : "h3";

  return (
    <article className="relative flex flex-col">
      <Heading className="order-last mt-1 text-card-title md:text-card-title-lg">
        {show.title}
      </Heading>
      <ShowMeta show={show} />
      <Thumbnail
        slug={show.slug}
        loading={loading}
        className="order-first mb-2"
      />
      <BookmarkButton
        slug={show.slug}
        title={show.title}
        className="absolute top-2 right-2 md:top-4 md:right-4"
      />
    </article>
  );
}
