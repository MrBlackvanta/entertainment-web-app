import { navLinks } from "@/data";
import { render, screen, within } from "@testing-library/react";
import { usePathname } from "next/navigation";
import { beforeEach, describe, expect, it, vi } from "vite-plus/test";
import NavLinks from "./nav-links";

vi.mock("next/navigation", () => ({ usePathname: vi.fn() }));

const pathname = vi.mocked(usePathname);

describe("NavLinks", () => {
  beforeEach(() => pathname.mockReturnValue("/"));

  it("names every route inside the primary navigation", () => {
    render(<NavLinks />);

    const nav = screen.getByRole("navigation", { name: "Primary" });

    expect(
      within(nav)
        .getAllByRole("link")
        .map((link) => [
          link.getAttribute("aria-label"),
          link.getAttribute("href"),
        ]),
    ).toEqual(navLinks.map(({ label, href }) => [label, href]));
  });

  it.each(navLinks.map(({ label, href }) => [href, label]))(
    "marks only %s's link as the current page",
    (href, label) => {
      pathname.mockReturnValue(href);
      render(<NavLinks />);

      const current = screen
        .getAllByRole("link")
        .filter((link) => link.getAttribute("aria-current") === "page");

      expect(current).toEqual([screen.getByRole("link", { name: label })]);
    },
  );

  it("still marks the current page when the URL ends in a slash", () => {
    pathname.mockReturnValue("/tv-series/");
    render(<NavLinks />);

    expect(screen.getByRole("link", { name: "TV Series" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("marks nothing as current on a route outside the navigation", () => {
    pathname.mockReturnValue("/no-such-page");
    render(<NavLinks />);

    for (const link of screen.getAllByRole("link")) {
      expect(link).not.toHaveAttribute("aria-current");
    }
  });
});
