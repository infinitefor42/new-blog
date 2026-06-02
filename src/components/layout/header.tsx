"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FiMenu, FiX } from "react-icons/fi";
import { useState } from "react";
import { ThemeToggle } from "@/components/common/theme-toggle";

export function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { label: "首页", href: "/" },
    { label: "博客", href: "/blog" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 glass-card-subtle !rounded-none border-x-0 border-t-0">
      <div className="container mx-auto px-4 relative">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="font-song text-lg font-bold text-ink-black dark:text-rice-white tracking-[0.15em] hover:opacity-80 transition-opacity">
            INFINITE
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded-xl text-sm transition-all duration-200
                  ${isActive(item.href)
                    ? "bg-foreground/10 text-foreground font-medium"
                    : "text-foreground/70 hover:text-foreground hover:bg-foreground/5"
                  }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-1">
            <ThemeToggle mode="icon" />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 hover:bg-foreground/10 active:scale-95"
              aria-label={isMenuOpen ? "关闭菜单" : "打开菜单"}
            >
              {isMenuOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer Menu */}
        {/* 1. 背景遮罩层：菜单打开时，左侧剩余的屏幕区域必须有一个半透明的灰色遮罩层 */}
        <div
          className={`fixed inset-0 bg-black/40 z-40 md:hidden transition-opacity duration-300 ${
            isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
          onClick={() => setIsMenuOpen(false)}
        />

        {/* 2. 右侧全屏滑出抽屉 */}
        <div
          className={`
            fixed right-0 top-0 h-full w-64 z-50
            bg-[#f3eee5] dark:bg-ink-deep
            shadow-2xl border-l border-black/5 dark:border-rice-white/10
            transition-transform duration-300 md:hidden
            ${isMenuOpen ? "translate-x-0 pointer-events-auto" : "translate-x-full pointer-events-none"}
          `}
        >
          {/* 顶部关闭按钮区域（位于抽屉右上角） */}
          <div className="flex justify-end items-center h-16 px-4">
            <button
              onClick={() => setIsMenuOpen(false)}
              className="flex items-center justify-center w-10 h-10 rounded-xl
                text-ink-gray dark:text-rice-white-dim
                hover:bg-ink-black/5 dark:hover:bg-rice-white/10
                transition-all duration-200"
              aria-label="关闭菜单"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          {/* 导航菜单项 */}
          <nav className="pl-6 pt-8 flex flex-col space-y-6 text-lg">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className={`transition-colors py-1 block w-fit
                  ${isActive(item.href)
                    ? "text-ink-black dark:text-rice-white font-semibold border-b-2 border-black dark:border-rice-white pb-0.5"
                    : "text-ink-gray/70 dark:text-rice-white-dim/70 hover:text-ink-black dark:hover:text-rice-white font-medium"
                  }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
