"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FiMenu, FiX, FiChevronDown } from "react-icons/fi";
import { useState, useEffect, useRef } from "react";
import { siteConfig } from "@/config/site";
import { appleEasing } from "@/lib/animations";
import { ThemeToggle } from "./theme-toggle";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const [canHover, setCanHover] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 仅在支持悬停的设备启用 hover 展开，触摸设备走点击
  useEffect(() => {
    const mq = window.matchMedia("(hover: hover)");
    const apply = () => setCanHover(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  // 点击外部 / Esc 关闭下拉
  useEffect(() => {
    if (!openDropdown) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!dropdownRef.current?.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenDropdown(null);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [openDropdown]);

  useEffect(
    () => () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    },
    []
  );

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  // 仅在 /blog 分区内，才给「博客」展示二级下拉
  const inBlogSection = pathname.startsWith("/blog");

  const handleMobileMenuToggle = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
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
                {siteConfig.name}
              </span>
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-ink-black dark:bg-rice-white transition-all duration-300 group-hover:w-full" />
            </Link>

            <div
              ref={dropdownRef}
              className="hidden md:flex items-center gap-6 absolute left-1/2 -translate-x-1/2"
            >
              {siteConfig.nav.map((item) => {
                const active = isActive(item.href);
                // 首页/非博客页不展示子菜单
                const children = inBlogSection ? item.children : undefined;
                const open = openDropdown === item.href && Boolean(children);

                return (
                  <div
                    key={item.href}
                    className="relative"
                    onMouseEnter={
                      canHover && children
                        ? () => {
                            if (closeTimer.current) {
                              clearTimeout(closeTimer.current);
                            }
                            setOpenDropdown(item.href);
                          }
                        : undefined
                    }
                    onMouseLeave={
                      canHover && children
                        ? () => {
                            closeTimer.current = setTimeout(
                              () => setOpenDropdown(null),
                              120
                            );
                          }
                        : undefined
                    }
                  >
                    <Link
                      href={item.href}
                      aria-haspopup={children ? "true" : undefined}
                      aria-expanded={children ? open : undefined}
                      onClick={() => setOpenDropdown(null)}
                      className={`relative inline-flex items-center gap-1 px-4 py-2 text-sm font-medium transition-colors duration-200 rounded-lg
                        ${
                          active
                            ? "text-ink-black dark:text-rice-white"
                            : "text-ink-gray dark:text-rice-white-dim hover:text-ink-black dark:hover:text-rice-white"
                        }`}
                    >
                      {item.label}
                      {children && (
                        <motion.span
                          animate={{ rotate: open ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                          className="flex items-center"
                        >
                          <FiChevronDown className="w-3.5 h-3.5" />
                        </motion.span>
                      )}
                      {active && (
                        <motion.div
                          layoutId="navbar-indicator"
                          className="absolute inset-0 bg-ink-black/5 dark:bg-rice-white/10 rounded-lg -z-10"
                          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                    </Link>

                    {children && (
                      <AnimatePresence>
                        {open && (
                          <motion.div
                            role="menu"
                            aria-label={item.label}
                            initial={{ opacity: 0, y: -6, scale: 0.97 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -6, scale: 0.97 }}
                            transition={{ duration: 0.22, ease: appleEasing }}
                            className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-36
                              glass-card p-1.5 shadow-xl origin-top"
                          >
                            {children.map((child) => (
                              <Link
                                key={child.href}
                                href={child.href}
                                role="menuitem"
                                onClick={() => setOpenDropdown(null)}
                                className="block px-3 py-2 rounded-xl text-sm
                                  text-ink-gray dark:text-rice-white-dim
                                  hover:bg-ink-black/5 dark:hover:bg-rice-white/10
                                  hover:text-ink-black dark:hover:text-rice-white
                                  transition-colors"
                              >
                                {child.label}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="flex items-center gap-2 relative">
              <ThemeToggle />

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
            {/* 右侧抽屉面板 - 固定在汉堡菜单按钮正下方 */}
            <div
              style={{ position: "fixed", right: "8px", top: "56px", zIndex: 60 }}
              className="bg-paper-bg/95 dark:bg-ink-deep/95
                shadow-2xl border border-black/5 dark:border-rice-white/10
                md:hidden rounded-xl w-44"
            >
              {/* 关闭按钮 */}
              <div className="flex justify-end p-2">
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg
                    text-ink-gray dark:text-rice-white-dim
                    hover:bg-ink-black/5 dark:hover:bg-rice-white/10
                    transition-all duration-200"
                >
                  <FiX className="w-4 h-4" />
                </button>
              </div>

              {/* 导航链接 */}
              <nav className="p-2 space-y-1">
                {siteConfig.nav.map((item) => {
                  const children = inBlogSection ? item.children : undefined;

                  return children ? (
                    <div key={item.href}>
                      <div className="flex items-center">
                        <Link
                          href={item.href}
                          className={`flex-1 flex items-center justify-center py-3 rounded-xl text-sm font-medium
                            transition-all duration-200 no-underline
                            ${
                              isActive(item.href)
                                ? "text-ink-black dark:text-rice-white bg-ink-black/5 dark:bg-rice-white/10"
                                : "text-ink-gray dark:text-rice-white-dim hover:bg-ink-black/5 dark:hover:bg-rice-white/10"
                            }`}
                          onClick={(e) => handleNavClick(e, item.href)}
                        >
                          {item.label}
                        </Link>
                        <button
                          onClick={() =>
                            setMobileExpanded(
                              mobileExpanded === item.href ? null : item.href
                            )
                          }
                          aria-expanded={mobileExpanded === item.href}
                          aria-label={`展开${item.label}子菜单`}
                          className="w-8 h-8 flex items-center justify-center rounded-lg
                            text-ink-gray dark:text-rice-white-dim
                            hover:bg-ink-black/5 dark:hover:bg-rice-white/10
                            transition-all duration-200"
                        >
                          <motion.span
                            animate={{
                              rotate: mobileExpanded === item.href ? 180 : 0,
                            }}
                            transition={{ duration: 0.2 }}
                            className="flex items-center justify-center"
                          >
                            <FiChevronDown className="w-4 h-4" />
                          </motion.span>
                        </button>
                      </div>

                      <AnimatePresence initial={false}>
                        {mobileExpanded === item.href && (
                          <motion.nav
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.25, ease: appleEasing }}
                            className="overflow-hidden pl-2"
                          >
                            {children.map((child) => (
                              <Link
                                key={child.href}
                                href={child.href}
                                className="block text-center py-2.5 rounded-xl text-xs no-underline
                                  text-ink-gray dark:text-rice-white-dim
                                  hover:bg-ink-black/5 dark:hover:bg-rice-white/10
                                  transition-all duration-200"
                                onClick={(e) => handleNavClick(e, child.href)}
                              >
                                {child.label}
                              </Link>
                            ))}
                          </motion.nav>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center justify-center w-full py-3 rounded-xl text-sm font-medium
                        transition-all duration-200 no-underline
                        ${
                          isActive(item.href)
                            ? "text-ink-black dark:text-rice-white bg-ink-black/5 dark:bg-rice-white/10"
                            : "text-ink-gray dark:text-rice-white-dim hover:bg-ink-black/5 dark:hover:bg-rice-white/10"
                        }`}
                      onClick={(e) => handleNavClick(e, item.href)}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
