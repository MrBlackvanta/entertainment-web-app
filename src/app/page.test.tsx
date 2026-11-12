import { shows, trendingShows } from "@/data";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vite-plus/test";
import HomePage from "./page";

function cardTitles(region: HTMLElement) {
  return within(region)
    .getAllByRole("heading", { level: 3 })
    .map((heading) => heading.textContent);
}

describe("HomePage", () => {
  it("names the page for screen readers and splits it into two sections", () => {
    render(<HomePage />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Matinee" }),
    ).toBeInTheDocument();
    expect(
      screen
        .getAllByRole("region")
        .map(
          (region) =>
            within(region).getByRole("heading", { level: 2 }).textContent,
        ),
    ).toEqual(["Trending", "Recommended for you"]);
  });

  it("recommends every show that is not already trending", () => {
    render(<HomePage />);
    const trending = cardTitles(
      screen.getByRole("region", { name: "Trending" }),
    );
    const recommended = cardTitles(
      screen.getByRole("region", { name: "Recommended for you" }),
    );

    expect(trending).toEqual(trendingShows.map((show) => show.title));
    expect(recommended).toHaveLength(shows.length - trendingShows.length);
    expect(recommended.filter((title) => trending.includes(title))).toEqual([]);
  });

  it("replaces both sections with results while searching", async () => {
    const user = userEvent.setup();
    render(<HomePage />);

    await user.type(
      screen.getByRole("searchbox", { name: "Search for movies or TV series" }),
      "earth",
    );

    expect(screen.queryByRole("region")).not.toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Found 2 results for ‘earth’",
      }),
    ).toBeInTheDocument();
  });
});
