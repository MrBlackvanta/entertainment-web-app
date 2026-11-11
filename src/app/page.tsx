import { SITE_NAME } from "@/data";
import { pageMetadata } from "@/lib";

export const metadata = pageMetadata({
  title: `${SITE_NAME} | Find your next movie or TV series`,
  description:
    "Browse trending movies and TV series, search the whole catalogue, and bookmark the shows you want to watch next.",
  path: "/",
});

export default function Home() {
  return (
    <main>
      <h1>{SITE_NAME}</h1>
    </main>
  );
}
