import type { Metadata } from "next";
import { Instrument_Serif, Manrope } from "next/font/google";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-sans",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
});

export const metadata: Metadata = {
  title: "MD. Mehedi Hasan Nayem | Technical Project Coordinator",
  description:
    "Portfolio of MD. Mehedi Hasan Nayem, focused on travel tech systems, CMS platforms, CRM workflows, QA, API testing, and AI-enabled products.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${manrope.variable} ${instrumentSerif.variable} bg-bg font-[family-name:var(--font-sans)] text-fg`}
      >
        {children}
      </body>
    </html>
  );
}
