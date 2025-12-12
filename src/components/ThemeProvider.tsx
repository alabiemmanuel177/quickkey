"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import type { ThemeProviderProps } from "next-themes";

// These custom themes are dark themes
const darkThemes = ["dark", "dimmed", "dracula", "nord", "tokyo-night", "gruvbox", "high-contrast"];

// Component to manage the dark class for custom themes
function DarkClassManager({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();

  React.useEffect(() => {
    const html = document.documentElement;
    const isDarkTheme = theme && darkThemes.includes(theme);

    if (isDarkTheme) {
      html.classList.add("dark");
    } else if (theme === "light") {
      html.classList.remove("dark");
    }
    // For "system" theme, let next-themes handle it
  }, [theme]);

  return <>{children}</>;
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      themes={[
        "light",
        "dark",
        "dimmed",
        "dracula",
        "nord",
        "tokyo-night",
        "gruvbox",
        "high-contrast"
      ]}
      {...props}
    >
      <DarkClassManager>
        {children}
      </DarkClassManager>
    </NextThemesProvider>
  );
} 