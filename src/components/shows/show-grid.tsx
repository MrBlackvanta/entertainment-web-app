import type { Show } from "@/data";
import ShowCard from "./show-card";
import ShowList, { EAGER_CARDS } from "./show-list";

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
    <ShowList {...props}>
      {shows.map((show, index) => (
        <li key={show.slug}>
          <ShowCard
            show={show}
            headingLevel={headingLevel}
            loading={priority && index < EAGER_CARDS ? "eager" : "lazy"}
          />
        </li>
      ))}
    </ShowList>
  );
}
