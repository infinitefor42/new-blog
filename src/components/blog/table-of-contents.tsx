"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiList, FiX } from "react-icons/fi";
import { slugify } from "@/lib/slugify";

interface TocItem {
  id: string;
  text: string;
  level: number;
}

/** 从 Markdown 原文提取 h2/h3 标题并生成与 ReactMarkdown 一致的 slug ID */
function extractHeadings(markdown: string): TocItem[] {
  const items: TocItem[] = [];
  const lines = markdown.split("\n");
  let inCodeBlock = false;

  for (const line of lines) {
    if (line.trimStart().startsWith("```")) {
      inCodeBlock = !inCodeBlock;
      continue;
    }
    if (inCodeBlock) continue;

    const match = line.match(/^(#{2,3})\s+(.+)$/);
    if (match) {
      const level = match[1].length;
      const text = match[2].replace(/[*`_\[\]()!]/g, "").trim();
      const id = slugify(text);
      items.push({ id, text, level });
    }
  }
  return items;
}

export function TableOfContents({ markdown }: { markdown: string }) {
  const headings = useMemo(() => extractHeadings(markdown), [markdown]);
  const [activeId, setActiveId] = useState<string>("");
  const [mobileOpen, setMobileOpen] = useState(false);

  // Intersection Observer 追踪当前标题
  useEffect(() => {
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-80px 0px -70% 0px", threshold: 0 }
    );

    for (const h of headings) {
      const el = document.getElementById(h.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [headings]);

  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      setMobileOpen(false);
    }
  }, []);

  if (headings.length === 0) return null;

  return (
    <>
      {/* 桌面端：右侧固定目录 */}
      <nav className="hidden xl:block fixed right-8 top-28 w-56 max-h-[calc(100vh-10rem)] overflow-y-auto z-50
        scrollbar-thin scrollbar-thumb-warm-gray/30 dark:scrollbar-thumb-warm-gray-dark/30">
        <div className="text-xs font-medium text-ink-gray/40 dark:text-rice-white-dim/40 mb-3 tracking-wider uppercase sticky top-0 bg-paper-bg/80 dark:bg-ink-deep/80 backdrop-blur-sm py-1">
          目录
        </div>
        <ul className="space-y-1">
          {headings.map((h) => (
            <li key={h.id}>
              <button
                onClick={() => scrollTo(h.id)}
                className={`block w-full text-left text-sm py-1 border-l-2 transition-all duration-200
                  ${h.level === 3 ? "pl-6" : "pl-3"}
                  ${activeId === h.id
                    ? "border-ink-black dark:border-rice-white text-ink-black dark:text-rice-white font-medium"
                    : "border-transparent text-ink-gray/50 dark:text-rice-white-dim/50 hover:text-ink-gray dark:hover:text-rice-white-dim hover:border-warm-gray dark:hover:border-warm-gray-dark"
                  }`}
              >
                {h.text}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* 移动端：浮动按钮 + 抽屉 */}
      <div className="xl:hidden fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="w-11 h-11 rounded-full flex items-center justify-center
            bg-paper-bg/90 dark:bg-ink-deep/90 backdrop-blur-md
            border border-warm-gray/30 dark:border-warm-gray-dark/30
            shadow-lg text-ink-gray dark:text-rice-white-dim
            hover:text-ink-black dark:hover:text-rice-white transition-colors"
          aria-label="目录"
        >
          {mobileOpen ? <FiX className="w-5 h-5" /> : <FiList className="w-5 h-5" />}
        </button>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute bottom-14 right-0 w-64 max-h-[60vh] overflow-y-auto
                bg-paper-bg/95 dark:bg-ink-deep/95 backdrop-blur-xl
                border border-warm-gray/30 dark:border-warm-gray-dark/30
                rounded-xl shadow-2xl p-4"
            >
              <div className="text-xs font-medium text-ink-gray/40 dark:text-rice-white-dim/40 mb-3 tracking-wider uppercase">
                目录
              </div>
              <ul className="space-y-1">
                {headings.map((h) => (
                  <li key={h.id}>
                    <button
                      onClick={() => scrollTo(h.id)}
                      className={`block w-full text-left text-sm py-1.5 border-l-2 transition-all duration-200
                        ${h.level === 3 ? "pl-6" : "pl-3"}
                        ${activeId === h.id
                          ? "border-ink-black dark:border-rice-white text-ink-black dark:text-rice-white font-medium"
                          : "border-transparent text-ink-gray/50 dark:text-rice-white-dim/50"
                        }`}
                    >
                      {h.text}
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
