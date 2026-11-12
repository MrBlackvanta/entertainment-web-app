import type { Show } from "@/data";
import ShowCard from "./show-card";

const EAGER_CARDS = 4;

interface ShowGridProps extends React.ComponentProps<"ul"> {
  shows: readonly Show[];
  headingLevel: 2 | 3;
  priority?: boolean;
}

export default function ShowGrid({
  shows,
  headingLevel,
  priority = false,
  ...props
}: ShowGridProps) {
  return (
    <ul
      {...props}
      className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-x-7 md:gap-y-6 lg:gap-x-10 lg:gap-y-8 xl:grid-cols-4"
    >
      {shows.map((show, index) => (
        <li key={show.slug}>
          <ShowCard
            show={show}
            headingLevel={headingLevel}
            loading={priority && index < EAGER_CARDS ? "eager" : "lazy"}
          />
        </li>
      ))}
    </ul>
  );
}
