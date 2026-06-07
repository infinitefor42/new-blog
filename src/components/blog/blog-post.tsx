"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FiArrowLeft, FiCalendar, FiClock, FiExternalLink } from "react-icons/fi";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import type { Components } from "react-markdown";
import type { PostMeta } from "@/lib/posts";
import { GiscusComments } from "./giscus-comments";
import { useEffect } from "react";

interface BlogPostProps {
  post: PostMeta;
}

/** 判断是否为外部链接 */
function isExternal(href: string): boolean {
  return href.startsWith("http://") || href.startsWith("https://");
}

/** 自定义 Markdown 渲染组件 */
const markdownComponents: Components = {
  code({ className, children, ...props }) {
    const isInline = !className;
    if (isInline) {
      return (
        <code {...props}>
          {children}
        </code>
      );
    }
    return (
      <code className={className} {...props}>
        {children}
      </code>
    );
  },
  img({ src, alt, ...props }) {
    return (
      <figure>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt || ""}
          loading="lazy"
          decoding="async"
          {...props}
        />
        {alt && <figcaption>{alt}</figcaption>}
      </figure>
    );
  },
  a: ({ href, children, ...props }) => {
    const url = href || "";
    if (isExternal(url)) {
      return (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-ink-black dark:text-rice-white
            underline underline-offset-2 decoration-warm-gray dark:decoration-warm-gray-dark
            hover:decoration-ink-black dark:hover:decoration-rice-white transition-colors"
          {...props}
        >
          {children}
          <FiExternalLink className="w-3 h-3 inline" />
        </a>
      );
    }
    // 内部链接（如 /games/Snake_Game/index.html）
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-ink-black dark:text-rice-white
          underline underline-offset-2 decoration-warm-gray dark:decoration-warm-gray-dark
          hover:decoration-ink-black dark:hover:decoration-rice-white transition-colors"
        {...props}
      >
        {children}
      </a>
    );
  },
};

export function BlogPost({ post }: BlogPostProps) {
  // 动态加载 KaTeX CSS（仅博客文章页需要）
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css";
    link.integrity = "sha384-nB0miv6/jRmo5UMMR1wu3Gz6NLsoTkbqJghGIsx//Rlm+ZU03BU6SQNC66uf4l5+";
    link.crossOrigin = "anonymous";
    document.head.appendChild(link);

    return () => {
      if (link.parentNode) {
        document.head.removeChild(link);
      }
    };
  }, []);

  return (
    <article className="max-w-3xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-ink-gray dark:text-rice-white-dim
            hover:text-ink-black dark:hover:text-rice-white transition-colors mb-8"
        >
          <FiArrowLeft className="w-4 h-4" />
          返回文章列表
        </Link>

        <header className="mb-8">
          <h1 className="font-song text-4xl md:text-5xl font-bold mb-4 text-ink-black dark:text-rice-white">
            {post.title}
          </h1>
          <div className="flex items-center gap-4 text-ink-gray dark:text-rice-white-dim">
            <span className="flex items-center gap-1.5">
              <FiCalendar className="w-4 h-4" />
              {new Date(post.date).toLocaleDateString("zh-CN", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            <span className="flex items-center gap-1.5">
              <FiClock className="w-4 h-4" />
              {post.readingTime} 分钟阅读
            </span>
          </div>
        </header>

        <div className="glass-card p-8 sm:p-12">
          <div className="prose">
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkMath]}
              rehypePlugins={[rehypeKatex]}
              components={markdownComponents}
            >
              {post.content}
            </ReactMarkdown>
          </div>
        </div>

        <GiscusComments />
      </motion.div>
    </article>
  );
}
