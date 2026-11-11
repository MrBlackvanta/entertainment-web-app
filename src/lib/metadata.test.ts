import { describe, expect, it } from "vite-plus/test";
import { pageMetadata } from "./metadata";

const movies = pageMetadata({
  title: "Matinee | Movies",
  description: "Every movie in the catalogue.",
  path: "/movies",
});

describe("pageMetadata", () => {
  it("canonicalises the route to its own path", () => {
    expect(movies.alternates?.canonical).toBe("/movies");
  });

  it("shares a route as itself rather than as the home page", () => {
    expect(movies.openGraph).toMatchObject({
      title: "Matinee | Movies",
      description: "Every movie in the catalogue.",
      url: "/movies",
    });
    expect(movies.twitter).toMatchObject({
      title: "Matinee | Movies",
      description: "Every movie in the catalogue.",
    });
  });

  it("keeps the brand and the share card on every route", () => {
    expect(movies.openGraph).toMatchObject({
      siteName: "Matinee",
      images: [expect.objectContaining({ url: "/opengraph-image.jpg" })],
    });
    expect(movies.twitter).toMatchObject({
      card: "summary_large_image",
      images: [expect.objectContaining({ url: "/opengraph-image.jpg" })],
    });
  });
});
