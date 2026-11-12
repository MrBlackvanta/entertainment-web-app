import { movies } from "@/data";
import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vite-plus/test";
import ShowGrid from "./show-grid";

const firstSix = movies.slice(0, 6);

describe("ShowGrid", () => {
  it("lists one card per show, titled at the requested heading level", () => {
    render(<ShowGrid shows={firstSix} headingLevel={3} />);

    expect(
      screen
        .getAllByRole("listitem")
        .map(
          (card) => within(card).getByRole("heading", { level: 3 }).textContent,
        ),
    ).toEqual(firstSix.map((show) => show.title));
  });

  it("reads the title before the year, category and rating", () => {
    render(<ShowGrid shows={firstSix} headingLevel={2} />);
    const [card] = screen.getAllByRole("listitem");
    const title = within(card).getByRole("heading", {
      level: 2,
      name: "Beyond Earth",
    });

    for (const detail of ["2019", "Movie", "PG"]) {
      expect(
        title.compareDocumentPosition(within(card).getByText(detail)) &
          Node.DOCUMENT_POSITION_FOLLOWING,
      ).toBeTruthy();
    }
  });

  it("offers a bookmark toggle and nothing else to press", () => {
    render(<ShowGrid shows={firstSix} headingLevel={2} />);
    const [card] = screen.getAllByRole("listitem");

    expect(within(card).getAllByRole("button")).toEqual([
      within(card).getByRole("button", { name: "Bookmark Beyond Earth" }),
    ]);
    expect(
      within(card).getByText("Play").closest('[aria-hidden="true"]'),
    ).not.toBeNull();
  });

  it("art-directs the show's own crop at each breakpoint", () => {
    const { container } = render(
      <ShowGrid shows={firstSix} headingLevel={2} />,
    );
    const [card] = screen.getAllByRole("listitem");
    const sources = [...container.querySelectorAll("li:first-child source")];

    expect(within(card).getByRole("presentation")).toHaveAttribute(
      "src",
      "/thumbnails/beyond-earth/regular/small.webp",
    );
    expect(
      sources.map((source) => [
        source.getAttribute("media"),
        source.getAttribute("srcset"),
      ]),
    ).toEqual([
      ["(min-width: 64rem)", "/thumbnails/beyond-earth/regular/large.webp"],
      ["(min-width: 48rem)", "/thumbnails/beyond-earth/regular/medium.webp"],
    ]);
  });

  it.each([
    [true, ["eager", "eager", "eager", "eager", "lazy", "lazy"]],
    [false, ["lazy", "lazy", "lazy", "lazy", "lazy", "lazy"]],
  ])(
    "loads the first four thumbnails eagerly only for a priority grid (%s)",
    (priority, loading) => {
      render(
        <ShowGrid shows={firstSix} headingLevel={2} priority={priority} />,
      );

      expect(
        screen
          .getAllByRole("presentation")
          .map((image) => image.getAttribute("loading")),
      ).toEqual(loading);
    },
  );
});
