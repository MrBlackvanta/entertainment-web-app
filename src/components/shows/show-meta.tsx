import { CategoryMovieIcon, CategoryTvIcon } from "@/components/icons";
import type { Category, Show, ThumbnailVariant } from "@/data";

const categoryIcons: Record<Category, typeof CategoryMovieIcon> = {
  Movie: CategoryMovieIcon,
  "TV Series": CategoryTvIcon,
};

const variantStyles: Record<
  ThumbnailVariant,
  Record<"meta" | "separator" | "category" | "icon", string>
> = {
  regular: {
    meta: "gap-1.5 text-card-meta md:gap-2 md:text-card-meta-lg",
    separator: "size-0.5 md:size-0.75",
    category: "gap-1 md:gap-1.5",
    icon: "size-2.5 md:size-3",
  },
  trending: {
    meta: "gap-2 text-trending-meta md:text-trending-meta-lg",
    separator: "size-0.75",
    category: "gap-1.5",
    icon: "size-3",
  },
};

interface ShowMetaProps {
  show: Show;
  variant?: ThumbnailVariant;
}

export default function ShowMeta({
  show: { year, category, rating },
  variant = "regular",
}: ShowMetaProps) {
  const CategoryIcon = categoryIcons[category];
  const styles = variantStyles[variant];
  const separator = (
    <span
      aria-hidden="true"
      className={`rounded-full bg-ink/50 ${styles.separator}`}
    />
  );

  return (
    <p className={`flex items-center text-ink/75 ${styles.meta}`}>
      <span>{year}</span>
      {separator}
      <span className={`flex items-center ${styles.category}`}>
        <CategoryIcon className={styles.icon} />
        {category}
      </span>
      {separator}
      <span>{rating}</span>
    </p>
  );
}
