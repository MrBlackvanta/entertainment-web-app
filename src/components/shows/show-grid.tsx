import type { Show } from "@/data";
import ShowCard from "./show-card";

interface ShowGridProps extends React.ComponentProps<"ul"> {
  shows: readonly Show[];
  headingLevel: 2 | 3;
}

export default function ShowGrid({
  shows,
  headingLevel,
  ...props
}: ShowGridProps) {
  return (
    <ul {...props}>
      {shows.map((show) => (
        <li key={show.slug}>
          <ShowCard show={show} headingLevel={headingLevel} />
        </li>
      ))}
    </ul>
  );
}
