import { existsSync } from "node:fs";
import { describe, expect, it } from "vite-plus/test";
import { shows } from "./shows";

describe("shows", () => {
  it("has all three thumbnail crops for every show", () => {
    const missing = shows.flatMap(({ slug }) =>
      ["small", "medium", "large"]
        .map((crop) => `public/thumbnails/${slug}/regular/${crop}.webp`)
        .filter((path) => !existsSync(path)),
    );

    expect(missing).toEqual([]);
  });
});
