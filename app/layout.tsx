import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AboutButton from "./components/AboutButton";
import { Analytics } from "@vercel/analytics/react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Wall of Disgrace - SUST Competitive Programming Community",
  description:
    "The Wall of Disgrace for SUST Competitive Programming Community lists members who have violated integrity standards through cheating.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>Wall of Disgrace - SUST Competitive Programming Community</title>
        <meta
          name="description"
          content="The Wall of Disgrace for SUST Competitive Programming Community lists members who have violated integrity standards through cheating."
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AboutButton />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
