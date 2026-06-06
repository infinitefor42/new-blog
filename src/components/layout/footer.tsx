"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { FiHeart } from "react-icons/fi";
import { useSiteStats } from "@/hooks/use-site-stats";

/** 骨架屏闪烁块 */
function StatSkeleton() {
  return (
    <span className="inline-block h-3.5 w-14 rounded bg-ink-gray/10 dark:bg-rice-white-dim/10 animate-pulse align-middle" />
  );
}

export function Footer() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const { visitors, views, mounted, error } = useSiteStats();

  const statsReady = mounted && !error;

  return (
    <footer className="relative py-16 lg:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center"
        >
          <div className="text-center text-sm text-ink-gray/60 dark:text-rice-white-dim/60">
            <p className="mb-2">
              © 2026{" "}
              <FiHeart className="w-3.5 h-3.5 text-red-500 inline-block align-middle mx-0.5 animate-pulse" />{" "}
              Bowen Cao
            </p>
            <motion.p
              className="text-xs text-ink-gray/40 dark:text-rice-white-dim/40 mb-2 tracking-wide"
              initial={{ opacity: 0 }}
              animate={mounted ? { opacity: 1 } : {}}
              transition={{ duration: 0.4 }}
            >
              {statsReady ? (
                <>
                  👤 访客 {visitors.toLocaleString()} · 👁️ 浏览{" "}
                  {views.toLocaleString()}
                </>
              ) : (
                <>
                  👤 访客 <StatSkeleton /> · 👁️ 浏览 <StatSkeleton />
                </>
              )}
            </motion.p>
            <p className="text-xs text-ink-gray/30 dark:text-rice-white-dim/30">
              使用 Next.js 构建
            </p>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
