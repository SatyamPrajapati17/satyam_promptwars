import type { Metadata } from "next";
import { Archivo_Black, Space_Grotesk, Space_Mono, Poppins } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const archivoBlack = Archivo_Black({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-archivo-black",
  display: "swap",
});

const poppins = Poppins({
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-space-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "The Unbias — AI Decision-Audit Workspace",
  description:
    "An AI decision-audit workspace that turns messy decisions into structured reasoning maps and blind-spot cards — without ever choosing for you.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${archivoBlack.variable} ${poppins.variable} ${spaceGrotesk.variable} ${spaceMono.variable}`}
    >
      <body className="antialiased min-h-screen flex flex-col font-sans">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
