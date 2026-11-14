import { AppHeader, Signature } from "@/components/layout";
import { SITE_URL } from "@/data";
import { openGraphBase, twitterBase } from "@/lib";
import type { Metadata, Viewport } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["300", "500"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  openGraph: openGraphBase,
  twitter: twitterBase,
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#10141e",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${outfit.variable} antialiased`}>
      <body>
        <div className="flex min-h-dvh flex-col lg:grid lg:grid-cols-[6rem_minmax(0,1fr)] lg:gap-x-9 lg:pt-8 lg:pr-9 lg:pl-8">
          <AppHeader />
          <div className="relative flex grow flex-col">
            <main className="flex grow flex-col px-4 pt-6 pb-15 md:px-6 md:pt-8 md:pb-14 lg:px-0 lg:pb-13">
              {children}
            </main>
            <Signature />
          </div>
        </div>
      </body>
    </html>
  );
}
