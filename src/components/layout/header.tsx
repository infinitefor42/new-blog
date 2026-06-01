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
      <div className="container mx-auto px-4">
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

        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-foreground/10">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block px-4 py-3 rounded-xl text-sm transition-all
                  ${isActive(item.href)
                    ? "bg-foreground/10 text-foreground font-medium"
                    : "text-foreground/70 hover:text-foreground hover:bg-foreground/5"
                  }`}
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
