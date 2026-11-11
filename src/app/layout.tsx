import { Signature } from "@/components/layout";
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
      <body className="relative min-h-dvh">
        {children}
        <Signature />
      </body>
    </html>
  );
}
