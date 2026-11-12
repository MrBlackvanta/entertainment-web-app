import { BOOKMARKS_STORAGE_KEY } from "@/data";
import { act, cleanup, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderToString } from "react-dom/server";
import { beforeEach, describe, expect, it, vi } from "vite-plus/test";

const shows = {
  "beyond-earth": "Beyond Earth",
  "dark-side-of-the-moon": "Dark Side of the Moon",
} as const;

type Slug = keyof typeof shows;

async function renderButtons(...slugs: Slug[]) {
  const { default: BookmarkButton } = await import("./bookmark-button");

  render(
    <>
      {slugs.map((slug, index) => (
        <BookmarkButton key={index} slug={slug} title={shows[slug]} />
      ))}
    </>,
  );

  return userEvent.setup();
}

const button = (slug: Slug) =>
  screen.getByRole("button", { name: `Bookmark ${shows[slug]}` });

const buttons = (slug: Slug) =>
  screen.getAllByRole("button", { name: `Bookmark ${shows[slug]}` });

beforeEach(() => {
  vi.resetModules();
  vi.restoreAllMocks();
  localStorage.clear();
});

describe("BookmarkButton", () => {
  it("starts from the catalogue's bookmarks on a first visit", async () => {
    await renderButtons("beyond-earth", "dark-side-of-the-moon");

    expect(button("beyond-earth")).toHaveAttribute("aria-pressed", "false");
    expect(button("dark-side-of-the-moon")).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("prerenders the catalogue's bookmarks whatever this browser saved", async () => {
    localStorage.setItem(BOOKMARKS_STORAGE_KEY, '["beyond-earth"]');
    const { default: BookmarkButton } = await import("./bookmark-button");
    const prerendered = document.createElement("div");

    prerendered.innerHTML = renderToString(
      <>
        <BookmarkButton slug="beyond-earth" title={shows["beyond-earth"]} />
        <BookmarkButton
          slug="dark-side-of-the-moon"
          title={shows["dark-side-of-the-moon"]}
        />
      </>,
    );

    expect(
      within(prerendered)
        .getAllByRole("button")
        .map((button) => button.getAttribute("aria-pressed")),
    ).toEqual(["false", "true"]);
  });

  it("toggles its pressed state and keeps its name", async () => {
    const user = await renderButtons("beyond-earth");

    await user.click(button("beyond-earth"));
    expect(button("beyond-earth")).toHaveAttribute("aria-pressed", "true");

    await user.click(button("beyond-earth"));
    expect(button("beyond-earth")).toHaveAttribute("aria-pressed", "false");
  });

  it("keeps every button for the same show in step", async () => {
    const user = await renderButtons("beyond-earth", "beyond-earth");

    await user.click(buttons("beyond-earth")[0]);

    for (const twin of buttons("beyond-earth")) {
      expect(twin).toHaveAttribute("aria-pressed", "true");
    }
  });

  it("lets two clicks in the same tick cancel out", async () => {
    await renderButtons("beyond-earth");

    act(() => {
      button("beyond-earth").click();
      button("beyond-earth").click();
    });

    expect(button("beyond-earth")).toHaveAttribute("aria-pressed", "false");
  });

  it("remembers bookmarks on the next visit", async () => {
    const user = await renderButtons("beyond-earth", "dark-side-of-the-moon");
    await user.click(button("beyond-earth"));
    await user.click(button("dark-side-of-the-moon"));

    cleanup();
    vi.resetModules();
    await renderButtons("beyond-earth", "dark-side-of-the-moon");

    expect(button("beyond-earth")).toHaveAttribute("aria-pressed", "true");
    expect(button("dark-side-of-the-moon")).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  it("still toggles when the browser blocks storage", async () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("Storage is disabled", "SecurityError");
    });
    const user = await renderButtons("beyond-earth");

    await user.click(button("beyond-earth"));

    expect(button("beyond-earth")).toHaveAttribute("aria-pressed", "true");
  });

  it.each([
    ["unreadable", "{"],
    ["not a list", '{"beyond-earth":true}'],
  ])("falls back to the catalogue when saved data is %s", async (_, saved) => {
    localStorage.setItem(BOOKMARKS_STORAGE_KEY, saved);
    await renderButtons("beyond-earth", "dark-side-of-the-moon");

    expect(button("beyond-earth")).toHaveAttribute("aria-pressed", "false");
    expect(button("dark-side-of-the-moon")).toHaveAttribute(
      "aria-pressed",
      "true",
    );
  });

  it("drops saved shows the catalogue no longer has", async () => {
    localStorage.setItem(
      BOOKMARKS_STORAGE_KEY,
      JSON.stringify(["retired-show", "beyond-earth"]),
    );
    const user = await renderButtons("beyond-earth");

    await user.click(button("beyond-earth"));

    expect(localStorage.getItem(BOOKMARKS_STORAGE_KEY)).toBe("[]");
  });

  it("follows bookmarks changed in another tab", async () => {
    await renderButtons("beyond-earth", "dark-side-of-the-moon");

    act(() => {
      localStorage.setItem(BOOKMARKS_STORAGE_KEY, '["beyond-earth"]');
      dispatchEvent(
        new StorageEvent("storage", { key: BOOKMARKS_STORAGE_KEY }),
      );
    });

    expect(button("beyond-earth")).toHaveAttribute("aria-pressed", "true");
    expect(button("dark-side-of-the-moon")).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });
});
