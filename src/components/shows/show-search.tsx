"use client";

import { SearchIcon } from "@/components/icons";
import type { Show } from "@/data";
import { filterShows, resultsHeading } from "@/lib";
import { useId, useState } from "react";
import ShowGrid from "./show-grid";

interface ShowSearchProps {
  heading: string;
  headingHidden?: boolean;
  label: string;
  shows: readonly Show[];
  children?: React.ReactNode;
}

export default function ShowSearch({
  heading,
  headingHidden = false,
  label,
  shows,
  children,
}: ShowSearchProps) {
  const [query, setQuery] = useState("");
  const inputId = useId();
  const resultsHeadingId = useId();
  const searching = query.trim() !== "";
  const results = searching ? filterShows(shows, query) : [];

  return (
    <div className="flex flex-col">
      <h1
        className={
          headingHidden || searching
            ? "sr-only"
            : "mb-6 text-heading md:text-heading-lg lg:mb-8"
        }
      >
        {heading}
      </h1>
      <search className="order-first mb-6 flex items-center gap-4 md:mb-8 md:gap-6">
        <label htmlFor={inputId} className="shrink-0">
          <SearchIcon className="size-6 md:size-8" />
          <span className="sr-only">{label}</span>
        </label>
        <input
          id={inputId}
          type="search"
          value={query}
          placeholder={label}
          autoComplete="off"
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Escape") setQuery("");
          }}
          className="-mb-2.75 min-w-0 flex-1 border-b border-transparent pt-0.5 pb-3 text-search caret-accent placeholder:text-ink/50 focus:border-muted focus-visible:outline-transparent md:-mb-3.75 md:pt-px md:pb-3.75 md:text-search-lg [&::-webkit-search-cancel-button]:appearance-none"
        />
      </search>
      <div aria-live="polite" aria-atomic="true">
        {searching && (
          <h2
            id={resultsHeadingId}
            tabIndex={-1}
            className="mb-6 text-heading md:text-heading-lg lg:mb-8"
          >
            {resultsHeading(results.length, query)}
          </h2>
        )}
      </div>
      {searching
        ? results.length > 0 && (
            <ShowGrid
              shows={results}
              headingLevel={3}
              aria-labelledby={resultsHeadingId}
            />
          )
        : children}
    </div>
  );
}
