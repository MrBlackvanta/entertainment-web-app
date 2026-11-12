import { CategoryMovieIcon, CategoryTvIcon } from "@/components/icons";
import type { Category, Show } from "@/data";

const categoryIcons: Record<Category, typeof CategoryMovieIcon> = {
  Movie: CategoryMovieIcon,
  "TV Series": CategoryTvIcon,
};

function Separator() {
  return (
    <span
      aria-hidden="true"
      className="size-0.5 rounded-full bg-ink/50 md:size-0.75"
    />
  );
}

interface ShowMetaProps {
  show: Show;
}

export default function ShowMeta({
  show: { year, category, rating },
}: ShowMetaProps) {
  const CategoryIcon = categoryIcons[category];

  return (
    <p className="flex items-center gap-1.5 text-card-meta text-ink/75 md:gap-2 md:text-card-meta-lg">
      <span>{year}</span>
      <Separator />
      <span className="flex items-center gap-1 md:gap-1.5">
        <CategoryIcon className="size-2.5 md:size-3" />
        {category}
      </span>
      <Separator />
      <span>{rating}</span>
    </p>
  );
}
