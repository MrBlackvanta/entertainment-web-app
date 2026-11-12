import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vite-plus/test";
import NotFound, { metadata } from "./not-found";

describe("NotFound", () => {
  it("names the problem as the page's only heading", () => {
    render(<NotFound />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Page not found" }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("heading")).toHaveLength(1);
  });

  it("offers exactly one way out, a real link back home", () => {
    render(<NotFound />);

    const link = screen.getByRole("link");
    expect(link).toHaveAccessibleName("Back to home");
    expect(link).toHaveAttribute("href", "/");
  });

  it("carries its own title and drops the home canonical", () => {
    expect(metadata.title).toBe("Matinee | Page not found");
    expect(metadata.alternates).toEqual({ canonical: null });
    expect(metadata).not.toHaveProperty("robots");
  });
});
