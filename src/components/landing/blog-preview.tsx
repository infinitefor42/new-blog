"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Link from "next/link";
import { FiArrowRight, FiCalendar, FiClock, FiTag } from "react-icons/fi";
import type { PostPreview } from "@/lib/posts";
import { appleEasing, createContainerVariants, createCardVariants } from "@/lib/animations";

interface BlogPreviewProps {
  posts: PostPreview[];
}

const containerVariants = createContainerVariants();
const cardVariants = createCardVariants();

export function BlogPreview({ posts }: BlogPreviewProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const previewPosts = posts.slice(0, 3);

  return (
    <section className="py-24 lg:py-32 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <div className="text-center mb-16">
            <motion.h2
              variants={cardVariants}
              className="font-song text-4xl sm:text-5xl lg:text-6xl font-bold text-ink-black dark:text-rice-white mb-3"
            >
              最新文章
            </motion.h2>
            <motion.p
              variants={cardVariants}
              className="text-lg text-ink-gray/50 dark:text-rice-white-dim/50"
            >
              分享我的思考与发现
            </motion.p>
            <motion.div
              variants={cardVariants}
              className="w-16 h-0.5 bg-warm-gray dark:bg-warm-gray-dark mx-auto rounded-full mt-6"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {previewPosts.map((post, index) => (
              <motion.article
                key={post.slug}
                variants={cardVariants}
                whileHover={{ y: -8, transition: { duration: 0.4, ease: appleEasing } }}
                className={`group relative ${index === 0 ? "lg:col-span-2 lg:row-span-2" : ""}`}
              >
                <Link href={`/blog/${post.slug}`}>
                  <div
                    className={`glass-card overflow-hidden h-full transition-all duration-500
                      ${index === 0 ? "p-8 sm:p-10" : "p-6 sm:p-8"}`}
                    style={{ transitionTimingFunction: `cubic-bezier(${appleEasing.join(",")})` }}
                    onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 20px 40px rgba(25,19,15,0.12)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.boxShadow = ""; }}
                  >
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

                    <h3
                      className={`font-song font-bold text-ink-black dark:text-rice-white mb-3
                        group-hover:text-ink-gray dark:group-hover:text-rice-white-dim transition-colors duration-300
                        ${index === 0 ? "text-2xl sm:text-3xl" : "text-xl"}`}
                    >
                      {post.title}
                    </h3>

                    <p
                      className={`text-ink-gray/70 dark:text-rice-white-dim/70 mb-6 line-clamp-2
                        ${index === 0 ? "text-base sm:text-lg" : "text-sm sm:text-base"}`}
                    >
                      {post.excerpt}
                    </p>

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

                    <div className="absolute bottom-6 right-6 sm:bottom-8 sm:right-8
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
            ))}
          </div>

          <motion.div variants={cardVariants} className="text-center mt-12">
            <Link
              href="/blog"
              className="group inline-flex items-center gap-2 px-8 py-4 rounded-2xl
                border border-warm-gray/40 dark:border-warm-gray-dark/40
                text-ink-black dark:text-rice-white font-medium
                transition-all duration-500
                hover:bg-ink-black/5 dark:hover:bg-rice-white/5
                hover:border-warm-gray/60 dark:hover:border-warm-gray-dark/60
                hover:shadow-lg hover:shadow-ink-black/5 dark:hover:shadow-rice-white/5
                active:scale-[0.98]"
              style={{ transitionTimingFunction: `cubic-bezier(${appleEasing.join(",")})` }}
            >
              查看全部
              <FiArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
