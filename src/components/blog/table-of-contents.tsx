"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX } from "react-icons/fi";
import { ListMorphIcon } from "@/components/common/morph-icon";
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

  // 抽屉打开时锁定背景滚动
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [mobileOpen]);

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

      {/* 移动端：浮动按钮 + 右侧滑入抽屉 */}
      <div className="xl:hidden">
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="fixed bottom-6 right-6 z-50 w-11 h-11 rounded-full flex items-center justify-center
            bg-paper-bg/90 dark:bg-ink-deep/90 backdrop-blur-md
            border border-warm-gray/30 dark:border-warm-gray-dark/30
            shadow-lg text-ink-gray dark:text-rice-white-dim
            hover:text-ink-black dark:hover:text-rice-white transition-colors"
          aria-label="目录"
        >
          <ListMorphIcon open={mobileOpen} className="w-5 h-5" />
        </button>

        <AnimatePresence>
          {mobileOpen && (
            <>
              {/* 遮罩：点击关闭 */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => setMobileOpen(false)}
                className="fixed inset-0 z-[60] bg-black/30 backdrop-blur-sm"
              />
              {/* 抽屉：从右侧滑入 */}
              <motion.nav
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "tween", duration: 0.3, ease: "easeOut" }}
                className="fixed inset-y-0 right-0 z-[70] w-[85%] max-w-[320px]
                  bg-paper-bg dark:bg-ink-deep shadow-2xl flex flex-col"
              >
                <div className="px-7 pt-8 pb-5 text-xs font-medium text-ink-gray/40 dark:text-rice-white-dim/40 tracking-widest">
                  目录
                </div>
                <ul className="flex-1 overflow-y-auto px-5 space-y-3 pb-6">
                  {headings.map((h, i) => (
                    <li key={h.id} className={h.level === 3 ? "ml-4" : ""}>
                      <button
                        onClick={() => scrollTo(h.id)}
                        className={`w-full flex items-center justify-between gap-3 rounded-full px-5 py-3 text-left transition-all duration-200
                          ${activeId === h.id
                            ? "bg-white dark:bg-rice-white/10 border border-ink-black dark:border-rice-white text-ink-black dark:text-rice-white font-medium"
                            : "bg-white/60 dark:bg-rice-white/5 border border-transparent text-ink-gray/80 dark:text-rice-white-dim/80 hover:bg-white dark:hover:bg-rice-white/10"
                          }`}
                      >
                        <span className={`truncate font-song ${h.level === 3 ? "text-xs" : "text-sm"}`}>
                          {h.text}
                        </span>
                        <span className="text-xs text-ink-gray/40 dark:text-rice-white-dim/40 tabular-nums shrink-0">
                          {String(i + 1).padStart(2, "0")}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
                {/* 底部关闭按钮 */}
                <div className="px-7 pb-8 flex justify-end">
                  <button
                    onClick={() => setMobileOpen(false)}
                    className="w-11 h-11 rounded-full border border-warm-gray/40 dark:border-warm-gray-dark/40
                      flex items-center justify-center text-ink-gray dark:text-rice-white-dim
                      hover:text-ink-black dark:hover:text-rice-white transition-colors"
                    aria-label="关闭目录"
                  >
                    <FiX className="w-5 h-5" />
                  </button>
                </div>
              </motion.nav>
            </>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
