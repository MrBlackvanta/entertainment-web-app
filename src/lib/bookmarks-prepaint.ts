import { BOOKMARKS_STORAGE_KEY } from "@/data";

declare global {
  interface Window {
    __prepaintedBookmarks?: unknown;
  }
}

export const PREPAINTED_BOOKMARKS_GLOBAL =
  "__prepaintedBookmarks" satisfies keyof Window;

export const BOOKMARKS_PREPAINT_SCRIPT_ID = "bookmarks-prepaint";

export const BOOKMARKS_PREPAINT_SCRIPT = `(() => {
  try {
    const saved = JSON.parse(localStorage.getItem(${JSON.stringify(BOOKMARKS_STORAGE_KEY)}));
    if (!Array.isArray(saved)) return;
    for (const button of document.querySelectorAll("[data-bookmark]")) {
      button.setAttribute("aria-pressed", saved.includes(button.dataset.bookmark));
    }
    for (const list of document.querySelectorAll("[data-bookmarked-list]")) {
      for (const item of list.children) {
        item.hidden = !item.querySelector('[aria-pressed="true"]');
      }
      list.hidden = !list.querySelector(":scope > :not([hidden])");
    }
    window.${PREPAINTED_BOOKMARKS_GLOBAL} = saved;
  } catch {}
})();`;

export function readPrepaintedBookmarks() {
  return typeof window === "undefined"
    ? undefined
    : window.__prepaintedBookmarks;
}
