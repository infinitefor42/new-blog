"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { FiSun, FiMoon, FiMonitor } from "react-icons/fi";

interface ThemeToggleProps {
  /** 显示模式：icon 只显示图标，label 显示文字标签 */
  mode?: "icon" | "label";
  /** 自定义类名 */
  className?: string;
}

export function ThemeToggle({ mode = "icon", className = "" }: ThemeToggleProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // 避免 hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={`w-10 h-10 ${className}`} />
    );
  }

  const toggleTheme = () => {
    // 循环切换：light -> dark -> system -> light
    if (theme === "light") {
      setTheme("dark");
    } else if (theme === "dark") {
      setTheme("system");
    } else {
      setTheme("light");
    }
  };

  const getIcon = () => {
    if (theme === "system") {
      return <FiMonitor className="w-5 h-5" />;
    }
    return resolvedTheme === "dark" ? (
      <FiSun className="w-5 h-5" />
    ) : (
      <FiMoon className="w-5 h-5" />
    );
  };

  const getLabel = () => {
    if (theme === "system") return "跟随系统";
    return resolvedTheme === "dark" ? "明亮模式" : "暗黑模式";
  };

  if (mode === "label") {
    return (
      <button
        onClick={toggleTheme}
        className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-colors
          hover:bg-foreground/10 ${className}`}
        aria-label="切换主题"
      >
        {getIcon()}
        <span className="text-sm">{getLabel()}</span>
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className={`inline-flex items-center justify-center w-10 h-10 rounded-xl
        transition-all duration-200 hover:bg-foreground/10
        active:scale-95 ${className}`}
      aria-label="切换主题"
      title={`当前：${getLabel()}`}
    >
      {getIcon()}
    </button>
  );
}
