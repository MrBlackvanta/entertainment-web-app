"use client";

import { flushSync } from "react-dom";

function isShown(element: Element) {
  return element.isConnected && element.closest("[hidden]") === null;
}

function nearestShownSibling(item: Element, siblings: readonly Element[]) {
  const index = siblings.indexOf(item);
  const after = siblings.slice(index + 1);
  const before = siblings.slice(0, index).reverse();

  return [...after, ...before].find(isShown);
}

export function updateKeepingFocus(control: HTMLElement, update: () => void) {
  const item = control.closest("li");
  const siblings = [...(item?.parentElement?.children ?? [])];
  const labelId = control
    .closest("[aria-labelledby]")
    ?.getAttribute("aria-labelledby");
  const hadFocus = control === document.activeElement;

  flushSync(update);

  if (!hadFocus || !item || isShown(control)) return;

  const nextFocus =
    nearestShownSibling(item, siblings)?.querySelector("button") ??
    (labelId ? document.getElementById(labelId) : null);
  nextFocus?.focus();
}
