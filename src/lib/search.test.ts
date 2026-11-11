import { shows } from "@/data";
import { describe, expect, it } from "vite-plus/test";
import { filterShows, resultsHeading } from "./search";

const titles = (query: string) =>
  filterShows(shows, query).map((show) => show.title);

describe("filterShows", () => {
  it("matches any part of a title, ignoring case", () => {
    expect(titles("EARTH")).toEqual(["Beyond Earth", "Earth’s Untouched"]);
  });

  it("ignores spaces around the query", () => {
    expect(titles("  saturn ")).toEqual(["Mission: Saturn"]);
  });

  it("matches a typed apostrophe against the title's curly one", () => {
    expect(titles("earth's")).toEqual(["Earth’s Untouched"]);
  });
});

describe("resultsHeading", () => {
  it.each([
    [0, "Found 0 results for ‘dune’"],
    [1, "Found 1 result for ‘dune’"],
    [2, "Found 2 results for ‘dune’"],
  ])("counts %i match(es) in words", (count, heading) => {
    expect(resultsHeading(count, " dune ")).toBe(heading);
  });
});
