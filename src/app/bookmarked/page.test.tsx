import { BOOKMARKS_STORAGE_KEY, shows } from "@/data";
import { act, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { runInThisContext } from "node:vm";
import { hydrateRoot, type Root } from "react-dom/client";
import { renderToString } from "react-dom/server";
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
} from "vite-plus/test";

const roots: Root[] = [];

beforeEach(() => {
  localStorage.clear();
});

afterEach(() => {
  for (const root of roots.splice(0)) act(() => root.unmount());
  document.body.replaceChildren();
  delete window.__prepaintedBookmarks;
  vi.restoreAllMocks();
});

async function freshPage() {
  vi.resetModules();
  return (await import("./page")).default;
}

function save(...slugs: string[]) {
  localStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify(slugs));
}

function titlesOf(
  category: "Movie" | "TV Series",
  saved: (slug: string) => boolean,
) {
  return shows
    .filter((show) => show.category === category && saved(show.slug))
    .map((show) => show.title);
}

const seeded = (slug: string) =>
  shows.some((show) => show.slug === slug && show.isBookmarked);

async function prerender() {
  const BookmarkedPage = await freshPage();
  const container = document.createElement("div");
  container.innerHTML = renderToString(<BookmarkedPage />);
  document.body.append(container);
  return container;
}

function runInlineScripts(container: HTMLElement) {
  for (const script of container.querySelectorAll("script")) {
    runInThisContext(script.textContent);
  }
}

async function hydrate(container: HTMLElement) {
  const BookmarkedPage = await freshPage();
  const consoleError = vi.spyOn(console, "error");
  const onRecoverableError = vi.fn();

  await act(async () => {
    roots.push(
      hydrateRoot(container, <BookmarkedPage />, { onRecoverableError }),
    );
  });

  return { consoleError, onRecoverableError };
}

async function renderPage() {
  const BookmarkedPage = await freshPage();
  render(<BookmarkedPage />);
  return userEvent.setup();
}

const section = (name: string) => screen.getByRole("region", { name });

const visibleTitles = (name: string) =>
  within(section(name))
    .queryAllByRole("heading", { level: 3 })
    .map((heading) => heading.textContent);

const bookmark = (title: string) =>
  screen.getByRole("button", { name: `Bookmark ${title}` });

async function unbookmarkWithKeyboard(
  user: ReturnType<typeof userEvent.setup>,
  title: string,
) {
  act(() => bookmark(title).focus());
  await user.keyboard("{Enter}");
}

describe("BookmarkedPage", () => {
  it("prerenders the catalogue's bookmarks, split into movies and TV series", async () => {
    await prerender();

    expect(
      screen.getByRole("heading", { level: 1, name: "Bookmarks" }),
    ).toBeInTheDocument();
    expect(visibleTitles("Bookmarked Movies")).toEqual(
      titlesOf("Movie", seeded),
    );
    expect(visibleTitles("Bookmarked TV Series")).toEqual(
      titlesOf("TV Series", seeded),
    );
  });

  it("paints this browser's saved bookmarks before the first frame", async () => {
    save("beyond-earth", "relentless", "retired-show");
    const container = await prerender();

    runInlineScripts(container);

    expect(visibleTitles("Bookmarked Movies")).toEqual([
      "Beyond Earth",
      "Relentless",
    ]);
    expect(bookmark("Beyond Earth")).toHaveAttribute("aria-pressed", "true");
    expect(
      within(section("Bookmarked TV Series")).queryByRole("list"),
    ).not.toBeInTheDocument();
    expect(window.__prepaintedBookmarks).toEqual([
      "beyond-earth",
      "relentless",
      "retired-show",
    ]);
  });

  it("holds the first render until the bookmarks script has run", async () => {
    const container = await prerender();
    const renderGate = document.querySelector('link[rel="expect"]');

    expect(renderGate).toHaveAttribute("blocking", "render");
    expect(renderGate).toHaveAttribute(
      "href",
      `#${container.querySelector("script")?.id}`,
    );
  });

  it("hydrates onto the painted bookmarks without a mismatch", async () => {
    save("beyond-earth", "relentless");
    const container = await prerender();
    runInlineScripts(container);
    const repaints: MutationRecord[] = [];
    new MutationObserver((records) => repaints.push(...records)).observe(
      container,
      {
        subtree: true,
        childList: true,
        attributeFilter: ["hidden", "aria-pressed"],
      },
    );

    const { consoleError, onRecoverableError } = await hydrate(container);

    expect(repaints).toEqual([]);
    expect(onRecoverableError).not.toHaveBeenCalled();
    expect(consoleError).not.toHaveBeenCalled();
    expect(visibleTitles("Bookmarked Movies")).toEqual([
      "Beyond Earth",
      "Relentless",
    ]);
    expect(
      within(section("Bookmarked TV Series")).queryByRole("list"),
    ).not.toBeInTheDocument();
  });

  it.each([
    ["unreadable", "{"],
    ["not a list", '{"beyond-earth":true}'],
    ["null", "null"],
    ["a bare string", '"dogs"'],
  ])(
    "keeps the catalogue's bookmarks when saved data is %s",
    async (_, saved) => {
      localStorage.setItem(BOOKMARKS_STORAGE_KEY, saved);
      const container = await prerender();
      runInlineScripts(container);

      const { consoleError, onRecoverableError } = await hydrate(container);

      expect(window.__prepaintedBookmarks).toBeUndefined();
      expect(onRecoverableError).not.toHaveBeenCalled();
      expect(consoleError).not.toHaveBeenCalled();
      expect(visibleTitles("Bookmarked Movies")).toEqual(
        titlesOf("Movie", seeded),
      );
    },
  );

  it("ignores saved entries that are not shows", async () => {
    localStorage.setItem(
      BOOKMARKS_STORAGE_KEY,
      JSON.stringify([null, 1, {}, "dogs", "no-such-show"]),
    );
    const container = await prerender();
    runInlineScripts(container);

    const { consoleError, onRecoverableError } = await hydrate(container);

    expect(onRecoverableError).not.toHaveBeenCalled();
    expect(consoleError).not.toHaveBeenCalled();
    expect(
      within(section("Bookmarked Movies")).queryByRole("list"),
    ).not.toBeInTheDocument();
    expect(visibleTitles("Bookmarked TV Series")).toEqual(["Dogs"]);
  });

  it("loads the first four thumbnails a first visit paints eagerly", async () => {
    const container = await prerender();
    const eager = [...container.querySelectorAll('img[loading="eager"]')].map(
      (image) => image.closest("article")?.querySelector("h3")?.textContent,
    );

    expect(eager).toEqual(titlesOf("Movie", seeded).slice(0, 4));
  });

  it("searches only the bookmarked shows", async () => {
    const user = await renderPage();

    await user.type(
      screen.getByRole("searchbox", { name: "Search for bookmarked shows" }),
      "earth",
    );

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Found 1 result for ‘earth’",
      }),
    ).toBeInTheDocument();
  });
});

describe("Removing a bookmark", () => {
  it("drops the card and moves focus to the next card's bookmark", async () => {
    const user = await renderPage();

    await unbookmarkWithKeyboard(user, "Relentless");

    expect(visibleTitles("Bookmarked Movies")).not.toContain("Relentless");
    expect(bookmark("The Heiress")).toHaveFocus();
  });

  it("moves focus back a card when the last one goes", async () => {
    const user = await renderPage();

    await unbookmarkWithKeyboard(user, "Mission: Saturn");

    expect(bookmark("Darker")).toHaveFocus();
  });

  it("lands on the section heading when the section empties", async () => {
    save("relentless", "dogs");
    const user = await renderPage();

    await unbookmarkWithKeyboard(user, "Dogs");

    expect(
      within(section("Bookmarked TV Series")).queryByRole("list"),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: "Bookmarked TV Series" }),
    ).toHaveFocus();
  });

  it("keeps focus among the search results", async () => {
    const user = await renderPage();
    await user.type(
      screen.getByRole("searchbox", { name: "Search for bookmarked shows" }),
      "the",
    );

    await unbookmarkWithKeyboard(user, "The Rockies");

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Found 3 results for ‘the’",
      }),
    ).toBeInTheDocument();
    expect(bookmark("The Heiress")).toHaveFocus();
  });

  it("leaves focus alone when the toggle never had it", async () => {
    await renderPage();
    const searchbox = screen.getByRole("searchbox", {
      name: "Search for bookmarked shows",
    });
    act(() => searchbox.focus());

    act(() => bookmark("Relentless").click());

    expect(searchbox).toHaveFocus();
  });

  it("lands on the results heading when the last result goes", async () => {
    const user = await renderPage();
    await user.type(
      screen.getByRole("searchbox", { name: "Search for bookmarked shows" }),
      "dogs",
    );

    await unbookmarkWithKeyboard(user, "Dogs");

    expect(
      screen.getByRole("heading", {
        level: 2,
        name: "Found 0 results for ‘dogs’",
      }),
    ).toHaveFocus();
  });
});
