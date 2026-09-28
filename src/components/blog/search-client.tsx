"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { FiSearch, FiCalendar, FiClock, FiTag } from "react-icons/fi";
import type { PostSearchDoc } from "@/lib/posts";

interface ScoredDoc {
  doc: PostSearchDoc;
  score: number;
  snippet: string;
  titleHit: boolean;
  excerptHit: boolean;
}

/** 取命中位置前后的一段上下文，用于展示片段 */
function buildSnippet(text: string, needle: string, radius = 40): string {
  const index = text.toLowerCase().indexOf(needle);
  if (index === -1) return "";
  const start = Math.max(0, index - radius);
  const end = Math.min(text.length, index + needle.length + radius);
  return (start > 0 ? "…" : "") + text.slice(start, end) + (end < text.length ? "…" : "");
}

/** 把字符串按关键词拆成高亮片段 */
function highlight(text: string, needle: string) {
  if (!needle) return text;
  const lower = text.toLowerCase();
  const parts: React.ReactNode[] = [];
  let cursor = 0;
  let hit = lower.indexOf(needle);
  while (hit !== -1) {
    if (hit > cursor) parts.push(text.slice(cursor, hit));
    parts.push(
      <mark
        key={`${hit}-${cursor}`}
        className="bg-accent/25 text-ink-black dark:text-rice-white rounded px-0.5"
      >
        {text.slice(hit, hit + needle.length)}
      </mark>
    );
    cursor = hit + needle.length;
    hit = lower.indexOf(needle, cursor);
  }
  if (cursor < text.length) parts.push(text.slice(cursor));
  return parts;
}

export function SearchClient() {
  const [query, setQuery] = useState("");
  const [docs, setDocs] = useState<PostSearchDoc[] | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 首次输入时才拉取索引，保持搜索页初始加载轻量
  useEffect(() => {
    if (!query.trim() || docs) return;
    let cancelled = false;
    fetch("/search-index.json")
      .then((res) => res.json())
      .then((data: PostSearchDoc[]) => {
        if (!cancelled) setDocs(data);
      })
      .catch(() => {
        if (!cancelled) setDocs([]);
      });
    return () => {
      cancelled = true;
    };
  }, [query, docs]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const results = useMemo<ScoredDoc[]>(() => {
    const needle = query.trim().toLowerCase();
    if (!docs || !needle) return [];

    return docs
      .map((doc) => {
        const title = doc.title.toLowerCase();
        const excerpt = doc.excerpt.toLowerCase();
        const body = doc.text.toLowerCase();

        const titleHit = title.includes(needle);
        const excerptHit = excerpt.includes(needle);
        const bodyHit = body.includes(needle);

        const score =
          (titleHit ? 3 : 0) + (excerptHit ? 2 : 0) + (bodyHit ? 1 : 0);

        return {
          doc,
          score,
          snippet: bodyHit ? buildSnippet(doc.text, needle) : doc.excerpt,
          titleHit,
          excerptHit,
        };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score);
  }, [docs, query]);

  const trimmed = query.trim();

  return (
    <div className="max-w-3xl mx-auto">
      <div className="relative mb-8">
        <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-warm-gray-dark dark:text-warm-gray" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="输入关键词搜索文章..."
          className="w-full pl-14 pr-5 py-4 rounded-3xl
            glass-card
            text-ink-black dark:text-rice-white
            placeholder:text-warm-gray-dark/60 dark:placeholder:text-warm-gray/60
            text-base outline-none
            focus:shadow-[0_0_0_3px_rgba(216,204,188,0.35)] dark:focus:shadow-[0_0_0_3px_rgba(184,168,152,0.25)]"
        />
      </div>

      {!trimmed && (
        <p className="text-center text-sm text-ink-gray/40 dark:text-rice-white-dim/40 py-12">
          输入关键词开始搜索，支持标题、摘要与正文全文
        </p>
      )}

      {trimmed && (
        <p className="text-sm text-ink-gray/50 dark:text-rice-white-dim/50 mb-6">
          {results.length} 条结果
        </p>
      )}

      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {results.map(({ doc, snippet, titleHit }) => (
            <motion.div
              key={doc.slug}
              layout
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <Link
                href={`/blog/${doc.slug}`}
                className="glass-card block p-5 sm:p-6 transition-all duration-300 hover:shadow-lg"
              >
                <div className="flex flex-wrap gap-2 mb-3">
                  {doc.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs
                        bg-ink-black/[0.04] dark:bg-rice-white/[0.06]
                        text-ink-gray/70 dark:text-rice-white-dim/70"
                    >
                      <FiTag className="w-3 h-3" />
                      {tag}
                    </span>
                  ))}
                </div>

                <h2 className="font-song text-lg sm:text-xl font-bold text-ink-black dark:text-rice-white mb-2">
                  {titleHit ? highlight(doc.title, trimmed) : doc.title}
                </h2>

                <p className="text-sm text-ink-gray/70 dark:text-rice-white-dim/70 line-clamp-2 mb-3">
                  {snippet ? highlight(snippet, trimmed) : doc.excerpt}
                </p>

                <div className="flex items-center gap-4 text-xs text-ink-gray/50 dark:text-rice-white-dim/50">
                  <span className="flex items-center gap-1.5">
                    <FiCalendar className="w-3.5 h-3.5" />
                    {new Date(doc.date).toLocaleDateString("zh-CN", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <FiClock className="w-3.5 h-3.5" />
                    {doc.categories.join(" / ")}
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {trimmed && docs && results.length === 0 && (
        <p className="text-center font-song text-xl text-ink-gray/40 dark:text-rice-white-dim/40 py-16">
          未找到匹配的文章
        </p>
      )}
    </div>
  );
}
