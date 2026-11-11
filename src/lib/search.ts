import type { Show } from "@/data";

function normalise(text: string) {
  return text.toLocaleLowerCase("en").replace(/[‘’]/g, "'");
}

export function filterShows(shows: readonly Show[], query: string) {
  const needle = normalise(query.trim());
  return shows.filter((show) => normalise(show.title).includes(needle));
}

export function resultsHeading(count: number, query: string) {
  const noun = count === 1 ? "result" : "results";
  return `Found ${count} ${noun} for ‘${query.trim()}’`;
}
