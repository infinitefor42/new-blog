"use client";

import { useRouter } from "next/navigation";
import { RouterProvider } from "@heroui/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ReactNode, useEffect } from "react";

interface ProvidersProps {
  children: ReactNode;
}

/**
 * 监听系统主题变化，同步更新 color-scheme
 */
function ThemeWatcher() {
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (e: MediaQueryListEvent) => {
      const theme = localStorage.getItem("theme");
      if (theme === "system" || !theme) {
        document.documentElement.style.colorScheme = e.matches
          ? "dark"
          : "light";
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return null;
}

export function Providers({ children }: ProvidersProps) {
  const router = useRouter();

  return (
    <RouterProvider navigate={(href) => router.push(href)}>
      <NextThemesProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
        storageKey="theme"
      >
        <ThemeWatcher />
        {children}
      </NextThemesProvider>
    </RouterProvider>
  );
}
