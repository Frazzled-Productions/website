import type { Metadata } from "next";
import { Orbitron, Space_Grotesk, Inter } from "next/font/google";
import { CursorGlow } from "./components/CursorGlow";
import "./globals.css";

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
  weight: ["700", "900"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Frazzled Productions",
  description: "Software for the fun of it.",
};

// Cloudflare Web Analytics site token: a public site tag, not a secret, set as a repository
// variable for production builds only, so local and preview builds send no page views.
const cfBeaconToken = process.env.NEXT_PUBLIC_CF_BEACON_TOKEN;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${orbitron.variable} ${spaceGrotesk.variable} ${inter.variable}`}
    >
      <body>
        <CursorGlow />
        {children}
        {cfBeaconToken && (
          <script
            defer
            src="https://static.cloudflareinsights.com/beacon.min.js"
            data-cf-beacon={JSON.stringify({ token: cfBeaconToken })}
          />
        )}
      </body>
    </html>
  );
}
