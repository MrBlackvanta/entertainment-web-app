export const EAGER_CARDS = 4;

export default function ShowList({
  className = "",
  ...props
}: React.ComponentProps<"ul">) {
  return (
    <ul
      {...props}
      className={`grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-x-7 md:gap-y-6 lg:gap-x-10 lg:gap-y-8 xl:grid-cols-4 2xl:grid-cols-[repeat(auto-fill,minmax(15rem,1fr))] ${className}`}
    />
  );
}
