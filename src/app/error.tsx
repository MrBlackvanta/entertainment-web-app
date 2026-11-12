"use client";

import { ErrorPanel } from "@/components/layout";

interface PageErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function PageError({ reset }: PageErrorProps) {
  return (
    <ErrorPanel
      title="Something went wrong"
      description="This page couldn’t be shown. Your bookmarks are saved in this browser, so trying again picks up where you left off."
    >
      <button type="button" onClick={reset} className="v-button">
        Try again
      </button>
    </ErrorPanel>
  );
}
