"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FiSun, FiMoon, FiMenu, FiX } from "react-icons/fi";
import { useTheme } from "next-themes";
import { useState, useEffect, useCallback } from "react";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
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

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const handleMobileMenuToggle = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setIsMenuOpen(false);
    router.push(href);
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
          <div className="flex items-center justify-between h-16 lg:h-20 relative">
            <Link href="/" className="relative group flex items-center mr-6">
              <span className="font-song text-xl lg:text-2xl font-bold text-ink-black dark:text-rice-white tracking-[0.15em]">
                INFINITE
              </span>
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-ink-black dark:bg-rice-white transition-all duration-300 group-hover:w-full" />
            </Link>

            <div className="hidden md:flex items-center gap-6 absolute left-1/2 -translate-x-1/2">
              <Link
                href="/"
                className={`relative px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-lg
                  ${isActive("/")
                    ? "text-ink-black dark:text-rice-white"
                    : "text-ink-gray dark:text-rice-white-dim hover:text-ink-black dark:hover:text-rice-white"
                  }`}
              >
                首页
                {isActive("/") && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute inset-0 bg-ink-black/5 dark:bg-rice-white/10 rounded-lg"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </Link>
              <Link
                href="/blog"
                className={`relative px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-lg
                  ${isActive("/blog")
                    ? "text-ink-black dark:text-rice-white"
                    : "text-ink-gray dark:text-rice-white-dim hover:text-ink-black dark:hover:text-rice-white"
                  }`}
              >
                博客
                {isActive("/blog") && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute inset-0 bg-ink-black/5 dark:bg-rice-white/10 rounded-lg"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </Link>
            </div>

            <div className="flex items-center gap-2 relative">
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="flex items-center justify-center w-10 h-10 rounded-xl
                  text-ink-gray dark:text-rice-white-dim
                  hover:bg-ink-black/5 dark:hover:bg-rice-white/10
                  transition-all duration-200 active:scale-95"
                aria-label="切换主题"
              >
                {mounted ? (
                  <motion.span
                    key={resolvedTheme}
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
                    className="flex items-center justify-center"
                  >
                    {resolvedTheme === "dark" ? (
                      <FiSun className="w-5 h-5" />
                    ) : (
                      <FiMoon className="w-5 h-5" />
                    )}
                  </motion.span>
                ) : (
                  <div className="w-5 h-5" />
                )}
              </button>

              <button
                onClick={handleMobileMenuToggle}
                className="md:hidden flex items-center justify-center w-10 h-10 rounded-xl
                  text-ink-gray dark:text-rice-white-dim
                  hover:bg-ink-black/5 dark:hover:bg-rice-white/10
                  transition-all duration-200"
                aria-label={isMenuOpen ? "关闭菜单" : "打开菜单"}
              >
                {isMenuOpen ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </nav>
      </motion.header>

      {/* 移动端抽屉菜单 — 放在 header 外部，避免被 backdrop-blur 创建的堆叠上下文困住 */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            {/* 半透明遮罩：点击关闭抽屉 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[45] bg-black/30 dark:bg-black/50 md:hidden"
              onClick={() => setIsMenuOpen(false)}
            />
            {/* 右侧抽屉面板 */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed right-0 top-16 z-[60] w-72 max-w-[85vw]
                bg-paper-bg dark:bg-ink-deep
                shadow-2xl border-l border-t border-black/5 dark:border-rice-white/10
                md:hidden overflow-y-auto rounded-b-xl"
            >
              {/* 抽屉头部 */}
              <div className="flex items-center justify-between p-4 border-b border-black/5 dark:border-rice-white/10">
                <span className="font-song text-lg font-bold text-ink-black dark:text-rice-white tracking-wider">
                  INFINITE
                </span>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="w-10 h-10 flex items-center justify-center rounded-xl
                    text-ink-gray dark:text-rice-white-dim
                    hover:bg-ink-black/5 dark:hover:bg-rice-white/10
                    transition-all duration-200"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              {/* 导航链接 */}
              <nav className="p-4 space-y-2">
                <Link
                  href="/"
                  className={`block w-full text-left py-3 px-4 rounded-xl text-sm font-medium
                    transition-all duration-200 no-underline
                    ${isActive("/")
                      ? "text-ink-black dark:text-rice-white bg-ink-black/5 dark:bg-rice-white/10"
                      : "text-ink-gray dark:text-rice-white-dim hover:bg-ink-black/5 dark:hover:bg-rice-white/10"
                    }`}
                  onClick={(e) => handleNavClick(e, "/")}
                >
                  首页
                </Link>
                <Link
                  href="/blog"
                  className={`block w-full text-left py-3 px-4 rounded-xl text-sm font-medium
                    transition-all duration-200 no-underline
                    ${isActive("/blog")
                      ? "text-ink-black dark:text-rice-white bg-ink-black/5 dark:bg-rice-white/10"
                      : "text-ink-gray dark:text-rice-white-dim hover:bg-ink-black/5 dark:hover:bg-rice-white/10"
                    }`}
                  onClick={(e) => handleNavClick(e, "/blog")}
                >
                  博客
                </Link>
              </nav>

            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
