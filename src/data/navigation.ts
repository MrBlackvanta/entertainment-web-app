export const navLinks = [
  { label: "Home", href: "/" },
  { label: "Movies", href: "/movies" },
  { label: "TV Series", href: "/tv-series" },
  { label: "Bookmarks", href: "/bookmarked" },
] as const;

export type NavHref = (typeof navLinks)[number]["href"];
