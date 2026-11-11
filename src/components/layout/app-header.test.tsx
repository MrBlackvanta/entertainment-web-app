import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vite-plus/test";
import AppHeader from "./app-header";

vi.mock("next/navigation", () => ({ usePathname: () => "/" }));

describe("AppHeader", () => {
  it("is the banner landmark, holding the brand and the primary navigation", () => {
    render(<AppHeader />);

    const banner = screen.getByRole("banner");

    expect(
      within(banner).getByRole("img", { name: "Matinee" }),
    ).toBeInTheDocument();
    expect(
      within(banner).getByRole("navigation", { name: "Primary" }),
    ).toBeInTheDocument();
  });

  it("keeps the avatar out of the accessibility tree", () => {
    render(<AppHeader />);

    expect(screen.getAllByRole("img")).toHaveLength(1);
    expect(screen.getByRole("presentation")).toHaveAttribute("alt", "");
  });
});
