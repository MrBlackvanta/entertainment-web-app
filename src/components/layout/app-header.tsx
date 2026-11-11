import avatar from "@/assets/avatar.webp";
import { Logo } from "@/components/icons";
import NavLinks from "./nav-links";

export default function AppHeader() {
  return (
    <header className="grid h-14 grid-cols-[1fr_auto_1fr] items-center bg-surface px-4 md:mx-6 md:mt-6 md:h-18 md:rounded-nav lg:sticky lg:top-8 lg:m-0 lg:flex lg:h-[calc(100dvh-4rem)] lg:min-h-fit lg:flex-col lg:rounded-nav-lg lg:px-0 lg:pt-9 lg:pb-8">
      <Logo className="h-auto w-6.25 text-accent md:ml-2 md:w-8 lg:ml-0" />
      <NavLinks />
      <img
        src={avatar.src}
        alt=""
        width={avatar.width}
        height={avatar.height}
        decoding="async"
        className="size-6 justify-self-end rounded-full border border-ink md:size-8 lg:mt-auto lg:size-10"
      />
    </header>
  );
}
