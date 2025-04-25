import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import AboutButton from "./components/AboutButton";
import { Analytics } from "@vercel/analytics/react";
import Script from "next/script";
import ClientThemeProvider from "./components/ClientThemeProvider";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
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
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>Wall of Disgrace - SUST Competitive Programming Community</title>
        <meta
          name="description"
          content="The Wall of Disgrace for SUST Competitive Programming Community lists members who have violated integrity standards through cheating."
        />
        <Script id="theme-init" strategy="beforeInteractive">
          {`
            (function() {
              // This script sets the initial theme to prevent flash of wrong theme
              function setInitialTheme() {
                try {
                  var savedTheme = localStorage.getItem('theme');
                  
                  if (savedTheme === 'light' || savedTheme === 'dark') {
                    document.documentElement.setAttribute('data-theme', savedTheme);
                  } else if (window.matchMedia) {
                    // Check system preference only if matchMedia is supported
                    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                    document.documentElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
                  } else {
                    // Default to dark theme if matchMedia is not supported
                    document.documentElement.setAttribute('data-theme', 'dark');
                  }
                } catch (error) {
                  // Fallback to dark theme if there's an error
                  document.documentElement.setAttribute('data-theme', 'dark');
                  // Suppress console errors in production
                  if (process.env.NODE_ENV !== 'production') {
                    console.error('Error setting initial theme:', error);
                  }
                }
              }

              // Execute immediately
              setInitialTheme();
            })();
          `}
        </Script>
        <Script id="handle-dark-reader" strategy="beforeInteractive">
          {`
            (function() {
              // Remove DarkReader attributes if they exist before hydration
              if (typeof window !== 'undefined') {
                const html = document.documentElement;
                if (html.hasAttribute('data-darkreader-mode')) {
                  html.removeAttribute('data-darkreader-mode');
                }
                if (html.hasAttribute('data-darkreader-scheme')) {
                  html.removeAttribute('data-darkreader-scheme');
                }
              }
            })();
          `}
        </Script>
      </head>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <ClientThemeProvider>
        <AboutButton />
        {children}
        <Analytics />
        </ClientThemeProvider>
      </body>
    </html>
  );
}
