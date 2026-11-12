import { useId } from "react";

interface ShowSectionProps {
  heading: string;
  headingClassName?: string;
  className?: string;
  children: React.ReactNode;
}

export default function ShowSection({
  heading,
  headingClassName = "mb-6 lg:mb-8",
  className = "",
  children,
}: ShowSectionProps) {
  const headingId = useId();

  return (
    <section aria-labelledby={headingId} className={className}>
      <h2
        id={headingId}
        tabIndex={-1}
        className={`text-heading md:text-heading-lg ${headingClassName}`}
      >
        {heading}
      </h2>
      {children}
    </section>
  );
}
