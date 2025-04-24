"use client";

import dynamic from 'next/dynamic';

// Dynamically import ThemeToggle with SSR disabled
const ThemeToggle = dynamic(
  () => import('./ThemeToggle').then(mod => mod.default),
  { ssr: false, loading: () => null }
);

export default function ClientThemeWrapper() {
  return <ThemeToggle />;
} 