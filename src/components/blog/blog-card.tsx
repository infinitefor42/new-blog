"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FiCalendar, FiClock, FiTag, FiArrowRight } from "react-icons/fi";
import type { PostMeta } from "@/lib/posts";

interface BlogCardProps {
  post: PostMeta;
  index: number;
}

const appleEasing: [number, number, number, number] = [0.23, 1, 0.32, 1];

export function BlogCard({ post, index }: BlogCardProps) {
  return (
    <motion.article
      layout
      layoutId={post.slug}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10, scale: 0.95 }}
      transition={{
        layout: { duration: 0.4, ease: appleEasing },
        opacity: { duration: 0.3, delay: index * 0.05 },
        y: { duration: 0.4, delay: index * 0.05, ease: appleEasing },
      }}
      className="group"
    >
      <Link href={`/blog/${post.slug}`}>
        <div
          className="glass-card overflow-hidden h-full p-6 sm:p-8 relative"
          style={{ transitionTimingFunction: `cubic-bezier(${appleEasing.join(",")})` }}
          onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 20px 40px rgba(25,19,15,0.12)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.boxShadow = ""; }}
        >
          {/* 标签 */}
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs
                  bg-ink-black/[0.04] dark:bg-rice-white/[0.06]
                  text-ink-gray/70 dark:text-rice-white-dim/70"
              >
                <FiTag className="w-3 h-3" />
                {tag}
              </span>
            ))}
          </div>

          {/* 分类 */}
          <span className="text-xs text-warm-gray-dark dark:text-warm-gray tracking-wider uppercase mb-2 block">
            {post.categories.join(" / ")}
          </span>

          {/* 标题 */}
          <h2 className="font-song text-xl sm:text-2xl font-bold text-ink-black dark:text-rice-white mb-3
            group-hover:text-ink-gray dark:group-hover:text-rice-white-dim transition-colors duration-300">
            {post.title}
          </h2>

          {/* 摘要 */}
          <p className="text-ink-gray/70 dark:text-rice-white-dim/70 text-sm sm:text-base mb-6 line-clamp-2">
            {post.excerpt}
          </p>

          {/* 元信息 */}
          <div className="flex items-center gap-4 text-sm text-ink-gray/50 dark:text-rice-white-dim/50">
            <span className="flex items-center gap-1.5">
              <FiCalendar className="w-4 h-4" />
              {new Date(post.date).toLocaleDateString("zh-CN", { year: "numeric", month: "short", day: "numeric" })}
            </span>
            <span className="flex items-center gap-1.5">
              <FiClock className="w-4 h-4" />
              {post.readingTime} 分钟阅读
            </span>
          </div>

          {/* 阅读更多箭头 */}
          <div
            className="absolute bottom-6 right-6 sm:bottom-8 sm:right-8
              w-10 h-10 rounded-full bg-ink-black/[0.05] dark:bg-rice-white/[0.08]
              flex items-center justify-center
              group-hover:bg-ink-black dark:group-hover:bg-rice-white
              transition-all duration-500"
            style={{ transitionTimingFunction: `cubic-bezier(${appleEasing.join(",")})` }}
          >
            <FiArrowRight className="w-4 h-4 text-ink-gray/60 dark:text-rice-white-dim/60
              group-hover:text-paper-bg dark:group-hover:text-ink-deep
              transition-colors duration-300 group-hover:translate-x-0.5" />
          </div>
        </div>
      </Link>
    </motion.article>
  );
}
