"use client";

import {
  NavBookmarkIcon,
  NavHomeIcon,
  NavMoviesIcon,
  NavTvSeriesIcon,
} from "@/components/icons";
import { navLinks, type NavHref } from "@/data";
import Link from "next/link";
import { usePathname } from "next/navigation";

const icons: Record<NavHref, typeof NavHomeIcon> = {
  "/": NavHomeIcon,
  "/movies": NavMoviesIcon,
  "/tv-series": NavTvSeriesIcon,
  "/bookmarked": NavBookmarkIcon,
};

export default function NavLinks() {
  const pathname = usePathname().replace(/(?<=.)\/$/, "");

  return (
    <nav aria-label="Primary" className="lg:mt-15.5 lg:mb-8">
      <ul className="flex md:gap-2 lg:flex-col lg:items-center lg:gap-4">
        {navLinks.map(({ label, href }) => {
          const Icon = icons[href];

          return (
            <li key={href}>
              <Link
                href={href}
                aria-label={label}
                aria-current={pathname === href ? "page" : undefined}
                className="block p-3 text-muted hover:text-accent aria-[current=page]:text-ink motion-safe:transition-[color]"
              >
                <Icon className="h-4 w-auto md:h-5" />
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
