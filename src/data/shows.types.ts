export type Category = "Movie" | "TV Series";

export type Rating = "E" | "PG" | "18+";

export interface Show {
  slug: string;
  title: string;
  year: number;
  category: Category;
  rating: Rating;
  isBookmarked: boolean;
  isTrending: boolean;
}
