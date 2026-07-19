"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { FiHome, FiArrowLeft } from "react-icons/fi";
import { siteConfig } from "@/config/site";

export default function NotFound() {
  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-paper-bg/80 dark:bg-ink-deep/80 backdrop-blur-xl">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link href="/" className="font-song text-xl font-bold text-ink-black dark:text-rice-white tracking-[0.15em]">
              {siteConfig.name}
            </Link>
          </div>
        </nav>
      </header>
      <main className="flex-1 flex items-center justify-center min-h-screen pt-16">
        <div className="text-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          >
            <h1 className="font-song text-[120px] sm:text-[160px] lg:text-[200px] font-bold leading-none mb-4 bg-gradient-to-b from-ink-black/20 to-ink-black/5 dark:from-rice-white/20 dark:to-rice-white/5 bg-clip-text text-transparent select-none">
              404
            </h1>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
          >
            <p className="text-lg sm:text-xl text-ink-gray/60 dark:text-rice-white-dim/60 mb-2 font-song">
              迷失在星海之中
            </p>
            <p className="text-sm text-ink-gray/40 dark:text-rice-white-dim/40 mb-10">
              你要找的页面似乎不在这个维度
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-ink-black dark:bg-rice-white text-paper-bg dark:text-ink-deep px-6 py-3 rounded-xl hover:opacity-90 transition-all duration-300 hover:shadow-lg"
            >
              <FiHome className="w-4 h-4" />
              返回首页
            </Link>
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-warm-gray/40 dark:border-warm-gray-dark/40 text-ink-black dark:text-rice-white hover:bg-ink-black/5 dark:hover:bg-rice-white/5 transition-all duration-300"
            >
              <FiArrowLeft className="w-4 h-4" />
              返回上一页
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="mt-16"
          >
            <div className="w-16 h-0.5 bg-warm-gray/30 dark:bg-warm-gray-dark/30 mx-auto rounded-full" />
          </motion.div>
        </div>
      </main>
    </>
  );
}
