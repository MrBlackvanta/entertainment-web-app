import { existsSync } from "node:fs";
import { describe, expect, it } from "vite-plus/test";
import { shows, trendingShows } from "./shows";
import {
  thumbnailCrops,
  thumbnailSrc,
  type ThumbnailVariant,
} from "./thumbnails";

function missingCrops(variant: ThumbnailVariant, slugs: readonly string[]) {
  const { sources, fallback } = thumbnailCrops[variant];

  return slugs.flatMap((slug) =>
    [...sources, fallback]
      .map(({ name }) => `public${thumbnailSrc(slug, variant, name)}`)
      .filter((path) => !existsSync(path)),
  );
}

describe("shows", () => {
  it("has every grid crop for every show", () => {
    expect(
      missingCrops(
        "regular",
        shows.map((show) => show.slug),
      ),
    ).toEqual([]);
  });

  it("has every trending crop for every trending show", () => {
    expect(
      missingCrops(
        "trending",
        trendingShows.map((show) => show.slug),
      ),
    ).toEqual([]);
  });
});
