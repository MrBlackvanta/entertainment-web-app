"use client";

import { BOOKMARKS_STORAGE_KEY, shows } from "@/data";
import { useSyncExternalStore } from "react";

type Bookmarks = ReadonlySet<string>;

const seededBookmarks: Bookmarks = new Set(
  shows.filter((show) => show.isBookmarked).map((show) => show.slug),
);

const showSlugs = new Set(shows.map((show) => show.slug));
const listeners = new Set<() => void>();
let current: Bookmarks | undefined;

function isShowSlug(value: unknown): value is string {
  return typeof value === "string" && showSlugs.has(value);
}

function readStoredBookmarks(): Bookmarks {
  try {
    const stored: unknown = JSON.parse(
      localStorage.getItem(BOOKMARKS_STORAGE_KEY) ?? "null",
    );
    return Array.isArray(stored)
      ? new Set(stored.filter(isShowSlug))
      : seededBookmarks;
  } catch {
    return seededBookmarks;
  }
}

function getBookmarks() {
  current ??= readStoredBookmarks();
  return current;
}

function notify() {
  for (const listener of listeners) listener();
}

function syncFromOtherTab(event: StorageEvent) {
  if (event.key !== BOOKMARKS_STORAGE_KEY) return;
  current = undefined;
  notify();
}

function subscribe(listener: () => void) {
  if (listeners.size === 0) addEventListener("storage", syncFromOtherTab);
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) removeEventListener("storage", syncFromOtherTab);
  };
}

export function toggleBookmark(slug: string) {
  const next = new Set(getBookmarks());
  if (!next.delete(slug)) next.add(slug);
  current = next;

  try {
    localStorage.setItem(BOOKMARKS_STORAGE_KEY, JSON.stringify([...next]));
  } catch {}

  notify();
}

export function useIsBookmarked(slug: string) {
  return useSyncExternalStore(
    subscribe,
    () => getBookmarks().has(slug),
    () => seededBookmarks.has(slug),
  );
}
