import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import TanStackProvider from "@/components/TanStackProvider/TanStackProvider";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "JobTrack",
  description: "Job application tracker: vacancies, recruiters, follow-ups and monthly stats",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <TanStackProvider>{children}</TanStackProvider>
      </body>
    </html>
  );
}