"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FiSun, FiMoon, FiMenu, FiX } from "react-icons/fi";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

export function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: "首页", href: "/" },
    { label: "博客", href: "/blog" },
  ];

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-paper-bg/80 dark:bg-ink-deep/80 backdrop-blur-xl shadow-lg shadow-black/5 dark:shadow-black/20"
            : "bg-transparent"
        }`}
      >
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link href="/" className="relative group flex items-center mr-6">
              <span className="font-song text-xl lg:text-2xl font-bold text-ink-black dark:text-rice-white tracking-[0.15em]">
                INFINITE
              </span>
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-ink-black dark:bg-rice-white transition-all duration-300 group-hover:w-full" />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-4 pl-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-lg
                    ${isActive(item.href)
                      ? "text-ink-black dark:text-rice-white"
                      : "text-ink-gray dark:text-rice-white-dim hover:text-ink-black dark:hover:text-rice-white"
                    }`}
                >
                  {item.label}
                  {isActive(item.href) && (
                    <motion.div
                      layoutId="navbar-indicator"
                      className="absolute inset-0 bg-ink-black/5 dark:bg-rice-white/10 rounded-lg"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </Link>
              ))}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* Theme Toggle */}
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="flex items-center justify-center w-10 h-10 rounded-xl
                  text-ink-gray dark:text-rice-white-dim
                  hover:bg-ink-black/5 dark:hover:bg-rice-white/10
                  transition-all duration-200 active:scale-95"
                aria-label="切换主题"
              >
                {mounted ? (
                  resolvedTheme === "dark" ? (
                    <FiSun className="w-5 h-5" />
                  ) : (
                    <FiMoon className="w-5 h-5" />
                  )
                ) : (
                  <div className="w-5 h-5" />
                )}
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl
                  text-ink-gray dark:text-rice-white-dim
                  hover:bg-ink-black/5 dark:hover:bg-rice-white/10
                  transition-all duration-200"
                aria-label={isMenuOpen ? "关闭菜单" : "打开菜单"}
              >
                {isMenuOpen ? (
                  <FiX className="w-5 h-5" />
                ) : (
                  <FiMenu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            <div
              className="absolute inset-0 bg-black/20 backdrop-blur-sm"
              onClick={() => setIsMenuOpen(false)}
            />
            <div className="absolute right-0 top-0 bottom-0 w-[75%] max-w-sm
              bg-paper-bg dark:bg-ink-deep
              border-l border-warm-gray/20 dark:border-rice-white/10
              shadow-2xl"
            >
              <div className="flex flex-col h-full pt-20 px-6">
                <nav className="flex flex-col gap-2">
                  {navItems.map((item, index) => (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setIsMenuOpen(false)}
                        className={`block px-4 py-3 rounded-xl text-lg font-medium transition-all
                          ${isActive(item.href)
                            ? "bg-ink-black/5 dark:bg-rice-white/10 text-ink-black dark:text-rice-white"
                            : "text-ink-gray dark:text-rice-white-dim hover:bg-ink-black/5 dark:hover:bg-rice-white/5"
                          }`}
                      >
                        {item.label}
                      </Link>
                    </motion.div>
                  ))}
                </nav>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
