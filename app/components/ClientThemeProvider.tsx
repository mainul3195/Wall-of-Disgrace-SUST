"use client";

import { ThemeProvider } from "../contexts/ThemeContext";
import ClientThemeWrapper from "./ClientThemeWrapper";

export default function ClientThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <ClientThemeWrapper />
      {children}
    </ThemeProvider>
  );
} 