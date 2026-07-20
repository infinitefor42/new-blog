"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { FiSearch, FiArchive } from "react-icons/fi";
import { RandomPostButton } from "./random-post-button";
import type { PostPreview } from "@/lib/posts";

interface FilterPanelProps {
  posts: PostPreview[];
  categories: string[];
  tags: string[];
  selectedCategory: string;
  selectedTag: string;
  searchQuery: string;
  onCategoryChange: (category: string) => void;
  onTagChange: (tag: string) => void;
  onSearchChange: (query: string) => void;
}

export function FilterPanel({
  posts,
  categories,
  tags,
  selectedCategory,
  selectedTag,
  searchQuery,
  onCategoryChange,
  onTagChange,
  onSearchChange,
}: FilterPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
      className="glass-card p-6 sm:p-8 mb-12"
    >
      {/* 分类切换 */}
      <div className="mb-6">
        <h3 className="text-xs font-medium tracking-widest uppercase text-ink-gray/50 dark:text-rice-white-dim/50 mb-3">
          分类
        </h3>
        <div className="flex flex-wrap gap-2">
          <CategoryChip
            label="全部"
            active={selectedCategory === ""}
            onClick={() => onCategoryChange("")}
          />
          {categories.map((cat) => (
            <CategoryChip
              key={cat}
              label={cat}
              active={selectedCategory === cat}
              onClick={() => onCategoryChange(cat)}
            />
          ))}
        </div>
      </div>

      {/* 标签云 */}
      <div className="mb-6">
        <h3 className="text-xs font-medium tracking-widest uppercase text-ink-gray/50 dark:text-rice-white-dim/50 mb-3">
          标签
        </h3>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <TagChip
              key={tag}
              label={tag}
              active={selectedTag === tag}
              onClick={() => onTagChange(selectedTag === tag ? "" : tag)}
            />
          ))}
        </div>
      </div>

      {/* 归档按钮 + 随机按钮 + 搜索框 */}
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
        <div className="flex gap-3 shrink-0">
          <Link
            href="/blog/archive"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl
              border border-warm-gray/40 dark:border-warm-gray-dark/40
              text-ink-black dark:text-rice-white text-sm font-medium
              transition-all duration-300
              hover:bg-ink-black/5 dark:hover:bg-rice-white/5
              hover:border-warm-gray/60 dark:hover:border-warm-gray-dark/60
              active:scale-[0.97]"
          >
            <FiArchive className="w-4 h-4" />
            归档
          </Link>
          <RandomPostButton posts={posts} />
        </div>

        <div className="relative flex-1">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-gray-dark dark:text-warm-gray" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="搜索文章..."
            className="w-full pl-11 pr-4 py-2.5 rounded-2xl
              bg-transparent
              border border-warm-gray/40 dark:border-warm-gray-dark/40
              text-ink-black dark:text-rice-white
              placeholder:text-warm-gray-dark/60 dark:placeholder:text-warm-gray/60
              text-sm outline-none
              transition-all duration-300
              focus:border-warm-gray dark:focus:border-warm-gray-dark
              focus:shadow-[0_0_0_3px_rgba(216,204,188,0.3)] dark:focus:shadow-[0_0_0_3px_rgba(184,168,152,0.2)]"
          />
        </div>
      </div>
    </motion.div>
  );
}

function CategoryChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <motion.button
      layout
      onClick={onClick}
      className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
        active
          ? "bg-ink-black dark:bg-rice-white text-paper-bg dark:text-ink-deep"
          : "bg-ink-black/[0.04] dark:bg-rice-white/[0.06] text-ink-gray/70 dark:text-rice-white-dim/70 hover:bg-ink-black/[0.08] dark:hover:bg-rice-white/[0.1]"
      }`}
      whileTap={{ scale: 0.95 }}
    >
      {label}
    </motion.button>
  );
}

function TagChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <motion.button
      layout
      onClick={onClick}
      className={`px-3 py-1 rounded-full text-xs transition-all duration-300 ${
        active
          ? "bg-warm-gray/50 dark:bg-warm-gray-dark/40 text-ink-black dark:text-rice-white"
          : "bg-ink-black/[0.03] dark:bg-rice-white/[0.04] text-ink-gray/60 dark:text-rice-white-dim/60 hover:bg-ink-black/[0.06] dark:hover:bg-rice-white/[0.08]"
      }`}
      whileTap={{ scale: 0.95 }}
    >
      {label}
    </motion.button>
  );
}
