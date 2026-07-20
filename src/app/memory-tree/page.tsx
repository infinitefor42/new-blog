"use client";

import { useState, useEffect, ComponentType } from "react";
import { motion, AnimatePresence } from "framer-motion";

function MemoryTreeLoading() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const startTime = performance.now();
    const interval = setInterval(() => {
      const elapsed = (performance.now() - startTime) / 1000;
      const t = Math.min(elapsed / 12.0, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      const simulated = eased * 90;
      setProgress(simulated);
      if (t >= 1) clearInterval(interval);
    }, 30);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mt-loading-screen">
      <div className="mt-loading-content">
        <div className="mt-loading-text">正在唤醒记忆星海...</div>

        {/* 进度条 */}
        <div className="mt-progress-container">
          <div
            className="mt-progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-progress-percent">{Math.round(progress)}%</div>
      </div>
    </div>
  );
}

export default function MemoryTreePage() {
  const [TreeComponent, setTreeComponent] = useState<ComponentType | null>(null);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    import("@/components/blog/MemoryTree").then((mod) => {
      setTreeComponent(() => mod.default);
      // 让下一个渲染帧触发淡出，确保组件已就绪
      requestAnimationFrame(() => setShowContent(true));
    });
  }, []);

  return (
    <>
      <AnimatePresence>
        {!showContent && (
          <motion.div
            key="loader"
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 z-[10000]"
          >
            <MemoryTreeLoading />
          </motion.div>
        )}
      </AnimatePresence>

      {TreeComponent && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: showContent ? 1 : 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <TreeComponent />
        </motion.div>
      )}
    </>
  );
}
