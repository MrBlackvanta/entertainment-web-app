import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vite-plus/test";
import PageError from "./error";

describe("PageError", () => {
  it("names the failure as the page's only heading", () => {
    render(<PageError error={new Error("boom")} reset={vi.fn()} />);

    expect(
      screen.getByRole("heading", { level: 1, name: "Something went wrong" }),
    ).toBeInTheDocument();
    expect(screen.getAllByRole("heading")).toHaveLength(1);
  });

  it("retries in place, because a link home cannot reset the boundary on the home page", async () => {
    const reset = vi.fn();
    render(<PageError error={new Error("boom")} reset={reset} />);

    expect(screen.queryByRole("link")).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Try again" }));

    expect(reset).toHaveBeenCalledOnce();
  });
});
