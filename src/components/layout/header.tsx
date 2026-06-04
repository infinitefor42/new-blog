"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FiMenu, FiX } from "react-icons/fi";
import { useState } from "react";
import { ThemeToggle } from "@/components/common/theme-toggle";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { label: "首页", href: "/" },
    { label: "博客", href: "/blog" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    router.push(href);
    setTimeout(() => {
      setIsMenuOpen(false);
    }, 50);
  };

  return (
    <header className="sticky top-0 z-[9999] glass-card-subtle !rounded-none border-x-0 border-t-0">
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
          <div className="flex items-center gap-1 relative">
            <ThemeToggle mode="icon" />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 hover:bg-foreground/10 active:scale-95"
              aria-label={isMenuOpen ? "关闭菜单" : "打开菜单"}
            >
              {isMenuOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
            </button>
            {/* Mobile Dropdown Card */}
            {isMenuOpen && (
              <div
                className="absolute right-0 top-14 z-[999999] w-24 py-3 px-4
                  bg-[#f3eee5] dark:bg-ink-deep
                  rounded-xl shadow-lg border border-black/5 dark:border-rice-white/10
                  pointer-events-auto touch-manipulation
                  md:hidden"
              >
                <nav className="flex flex-col items-start space-y-3">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`block w-full text-left text-sm py-2 px-1 cursor-pointer no-underline ${
                        isActive(item.href)
                          ? "text-ink-black dark:text-rice-white font-semibold border-b-2 border-black dark:border-rice-white"
                          : "text-gray-400 dark:text-gray-500 hover:text-ink-black dark:hover:text-rice-white"
                      }`}
                      onClick={(e) => handleNavClick(e, item.href)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
