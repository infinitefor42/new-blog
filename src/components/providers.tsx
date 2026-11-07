"use client";

import { useRouter } from "next/navigation";
import { RouterProvider } from "@heroui/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { MotionConfig } from "framer-motion";
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
        {/* 尊重系统「减少动态效果」偏好，自动降级 Framer Motion 动画 */}
        <MotionConfig reducedMotion="user">
          <ThemeWatcher />
          {children}
        </MotionConfig>
      </NextThemesProvider>
    </RouterProvider>
  );
}
