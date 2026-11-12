import { trendingShows } from "@/data";
import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vite-plus/test";
import TrendingRow from "./trending-row";

describe("TrendingRow", () => {
  it("lists one card per trending show, titled as level 3 headings", () => {
    render(<TrendingRow shows={trendingShows} />);

    expect(
      screen
        .getAllByRole("listitem")
        .map(
          (card) => within(card).getByRole("heading", { level: 3 }).textContent,
        ),
    ).toEqual(trendingShows.map((show) => show.title));
  });

  it("reads the title before the year, category and rating", () => {
    render(<TrendingRow shows={trendingShows} />);
    const [card] = screen.getAllByRole("listitem");
    const title = within(card).getByRole("heading", { name: "Beyond Earth" });

    for (const detail of ["2019", "Movie", "PG"]) {
      expect(
        title.compareDocumentPosition(within(card).getByText(detail)) &
          Node.DOCUMENT_POSITION_FOLLOWING,
      ).toBeTruthy();
    }
  });

  it("offers a bookmark toggle and nothing else to press", () => {
    render(<TrendingRow shows={trendingShows} />);
    const [card] = screen.getAllByRole("listitem");

    expect(within(card).getAllByRole("button")).toEqual([
      within(card).getByRole("button", { name: "Bookmark Beyond Earth" }),
    ]);
    expect(
      within(card).getByText("Play").closest('[aria-hidden="true"]'),
    ).not.toBeNull();
  });

  it("art-directs the show's trending crop, not its grid crop", () => {
    const { container } = render(<TrendingRow shows={trendingShows} />);
    const [card] = screen.getAllByRole("listitem");
    const sources = [...container.querySelectorAll("li:first-child source")];

    expect(within(card).getByRole("presentation")).toHaveAttribute(
      "src",
      "/thumbnails/beyond-earth/trending/small.webp",
    );
    expect(
      sources.map((source) => [
        source.getAttribute("media"),
        source.getAttribute("srcset"),
      ]),
    ).toEqual([
      ["(min-width: 48rem)", "/thumbnails/beyond-earth/trending/large.webp"],
    ]);
  });

  it("loads the first three eagerly and prioritises only the first", () => {
    render(<TrendingRow shows={trendingShows} />);
    const images = screen.getAllByRole("presentation");

    expect(images.map((image) => image.getAttribute("loading"))).toEqual([
      "eager",
      "eager",
      "eager",
      "lazy",
      "lazy",
    ]);
    expect(images.map((image) => image.getAttribute("fetchpriority"))).toEqual([
      "high",
      null,
      null,
      null,
      null,
    ]);
  });
});
