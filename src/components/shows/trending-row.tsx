import type { Show } from "@/data";
import TrendingCard from "./trending-card";

const EAGER_CARDS = 3;

interface TrendingRowProps {
  shows: readonly Show[];
}

export default function TrendingRow({ shows }: TrendingRowProps) {
  return (
    <ul className="-mx-4 flex snap-x snap-mandatory scroll-px-4 v-scrollbar-thin gap-4 overflow-x-auto px-4 pb-2 md:-mx-6 md:scroll-px-6 md:gap-10 md:px-6 lg:-mr-9 lg:ml-0 lg:scroll-pl-0 lg:pr-9 lg:pl-0">
      {shows.map((show, index) => (
        <li key={show.slug} className="w-60 shrink-0 snap-start md:w-117.5">
          <TrendingCard
            show={show}
            loading={index < EAGER_CARDS ? "eager" : "lazy"}
            fetchPriority={index === 0 ? "high" : undefined}
          />
        </li>
      ))}
    </ul>
  );
}
