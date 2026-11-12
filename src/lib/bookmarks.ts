"use client";

import { BOOKMARKS_STORAGE_KEY, shows } from "@/data";
import { useSyncExternalStore } from "react";
import { readPrepaintedBookmarks } from "./bookmarks-prepaint";

type Bookmarks = ReadonlySet<string>;

const seededBookmarks: Bookmarks = new Set(
  shows.filter((show) => show.isBookmarked).map((show) => show.slug),
);

const showSlugs = new Set(shows.map((show) => show.slug));
const listeners = new Set<() => void>();
let current: Bookmarks | undefined;
let firstPaint: Bookmarks | undefined;

function isShowSlug(value: unknown): value is string {
  return typeof value === "string" && showSlugs.has(value);
}

function toBookmarks(saved: unknown): Bookmarks | undefined {
  return Array.isArray(saved) ? new Set(saved.filter(isShowSlug)) : undefined;
}

function readStoredBookmarks(): Bookmarks {
  try {
    return (
      toBookmarks(
        JSON.parse(localStorage.getItem(BOOKMARKS_STORAGE_KEY) ?? "null"),
      ) ?? seededBookmarks
    );
  } catch {
    return seededBookmarks;
  }
}

function getBookmarks() {
  current ??= readStoredBookmarks();
  return current;
}

function getFirstPaintBookmarks() {
  firstPaint ??= toBookmarks(readPrepaintedBookmarks()) ?? seededBookmarks;
  return firstPaint;
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

export function useBookmarks() {
  return useSyncExternalStore(subscribe, getBookmarks, getFirstPaintBookmarks);
}

export function useIsBookmarked(slug: string) {
  return useSyncExternalStore(
    subscribe,
    () => getBookmarks().has(slug),
    () => getFirstPaintBookmarks().has(slug),
  );
}
