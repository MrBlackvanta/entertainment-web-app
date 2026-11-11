import type { Show } from "@/data";

interface ShowCardProps {
  show: Show;
  headingLevel: 2 | 3;
}

export default function ShowCard({ show, headingLevel }: ShowCardProps) {
  const Heading = headingLevel === 2 ? "h2" : "h3";

  return (
    <article>
      <Heading>{show.title}</Heading>
    </article>
  );
}
