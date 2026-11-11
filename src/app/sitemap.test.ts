import { describe, expect, it } from "vite-plus/test";
import sitemap from "./sitemap";

describe("sitemap", () => {
  it("lists every route once, as an absolute URL on the live origin", () => {
    expect(sitemap().map(({ url }) => url)).toEqual([
      "https://entertainment-web-app.abdelrhman-ahmed8881.workers.dev/",
      "https://entertainment-web-app.abdelrhman-ahmed8881.workers.dev/movies",
      "https://entertainment-web-app.abdelrhman-ahmed8881.workers.dev/tv-series",
      "https://entertainment-web-app.abdelrhman-ahmed8881.workers.dev/bookmarked",
    ]);
  });
});
