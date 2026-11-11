import { movies } from "@/data";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vite-plus/test";
import ShowSearch from "./show-search";

function renderMovies() {
  const { container } = render(
    <ShowSearch heading="Movies" label="Search for movies" shows={movies}>
      <p>Every movie</p>
    </ShowSearch>,
  );

  return {
    user: userEvent.setup(),
    searchbox: screen.getByRole("searchbox", { name: "Search for movies" }),
    liveRegion: container.querySelector('[aria-live="polite"]'),
  };
}

describe("ShowSearch", () => {
  it("shows the page and an empty live region before anything is typed", () => {
    const { liveRegion } = renderMovies();

    expect(
      screen.getByRole("heading", { level: 1, name: "Movies" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Every movie")).toBeInTheDocument();
    expect(liveRegion).toBeEmptyDOMElement();
    expect(liveRegion).toHaveAttribute("aria-atomic", "true");
  });

  it("swaps the page for titled results and announces the count", async () => {
    const { user, searchbox, liveRegion } = renderMovies();

    await user.type(searchbox, "earth");

    expect(liveRegion).toContainElement(
      screen.getByRole("heading", {
        level: 2,
        name: "Found 2 results for ‘earth’",
      }),
    );
    expect(
      within(screen.getByRole("list", { name: "Found 2 results for ‘earth’" }))
        .getAllByRole("heading", { level: 3 })
        .map((heading) => heading.textContent),
    ).toEqual(["Beyond Earth", "Earth’s Untouched"]);
    expect(screen.queryByText("Every movie")).not.toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 1, name: "Movies" }),
    ).toBeInTheDocument();
  });

  it("searches only the shows it was given", async () => {
    const { user, searchbox, liveRegion } = renderMovies();

    await user.type(searchbox, "dark");

    expect(liveRegion).toHaveTextContent("Found 1 result for ‘dark’");
    expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent(
      "Darker",
    );
  });

  it("reports no matches without an empty list", async () => {
    const { user, searchbox, liveRegion } = renderMovies();

    await user.type(searchbox, "zzz");

    expect(liveRegion).toHaveTextContent("Found 0 results for ‘zzz’");
    expect(screen.queryByRole("list")).not.toBeInTheDocument();
  });

  it("treats a query of spaces as no search", async () => {
    const { user, searchbox, liveRegion } = renderMovies();

    await user.type(searchbox, "   ");

    expect(screen.getByText("Every movie")).toBeInTheDocument();
    expect(liveRegion).toBeEmptyDOMElement();
  });

  it("clears the search and restores the page on Escape", async () => {
    const { user, searchbox, liveRegion } = renderMovies();

    await user.type(searchbox, "earth");
    await user.keyboard("{Escape}");

    expect(searchbox).toHaveValue("");
    expect(screen.getByText("Every movie")).toBeInTheDocument();
    expect(liveRegion).toBeEmptyDOMElement();
  });
});
