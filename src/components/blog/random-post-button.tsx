"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import type { PostPreview } from "@/lib/posts";

// 骰子六个面的点数 SVG
const diceFaces = [
  // 1点
  <svg key="1" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <circle cx="12" cy="12" r="2.5" />
  </svg>,
  // 2点
  <svg key="2" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <circle cx="7" cy="7" r="2" />
    <circle cx="17" cy="17" r="2" />
  </svg>,
  // 3点
  <svg key="3" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <circle cx="7" cy="7" r="2" />
    <circle cx="12" cy="12" r="2" />
    <circle cx="17" cy="17" r="2" />
  </svg>,
  // 4点
  <svg key="4" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <circle cx="7" cy="7" r="2" />
    <circle cx="17" cy="7" r="2" />
    <circle cx="7" cy="17" r="2" />
    <circle cx="17" cy="17" r="2" />
  </svg>,
  // 5点
  <svg key="5" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <circle cx="7" cy="7" r="2" />
    <circle cx="17" cy="7" r="2" />
    <circle cx="12" cy="12" r="2" />
    <circle cx="7" cy="17" r="2" />
    <circle cx="17" cy="17" r="2" />
  </svg>,
  // 6点
  <svg key="6" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
    <circle cx="7" cy="5" r="1.8" />
    <circle cx="17" cy="5" r="1.8" />
    <circle cx="7" cy="12" r="1.8" />
    <circle cx="17" cy="12" r="1.8" />
    <circle cx="7" cy="19" r="1.8" />
    <circle cx="17" cy="19" r="1.8" />
  </svg>,
];

export function RandomPostButton({ posts }: { posts: PostPreview[] }) {
  const router = useRouter();
  const [rolling, setRolling] = useState(false);
  const [faceIndex, setFaceIndex] = useState(0);

  const handleClick = () => {
    if (rolling || posts.length === 0) return;
    setRolling(true);

    // 快速切换骰子面，模拟滚动
    let count = 0;
    const totalFlips = 8 + Math.floor(Math.random() * 4); // 8-11次翻转
    const interval = setInterval(() => {
      setFaceIndex(count % 6);
      count++;
      if (count >= totalFlips) {
        clearInterval(interval);
        // 最终停在随机面
        const finalFace = Math.floor(Math.random() * 6);
        setFaceIndex(finalFace);

        // 短暂延迟后跳转
        setTimeout(() => {
          const randomPost = posts[Math.floor(Math.random() * posts.length)];
          router.push(`/blog/${randomPost.slug}`);
        }, 400);
      }
    }, 80);
  };

  return (
    <motion.button
      onClick={handleClick}
      disabled={rolling}
      className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl
        border border-warm-gray/40 dark:border-warm-gray-dark/40
        text-ink-black dark:text-rice-white text-sm font-medium
        transition-all duration-300
        hover:bg-ink-black/5 dark:hover:bg-rice-white/5
        hover:border-warm-gray/60 dark:hover:border-warm-gray-dark/60
        active:scale-[0.97] shrink-0
        ${rolling ? "pointer-events-none opacity-70" : ""}`}
      whileTap={rolling ? {} : { scale: 0.95 }}
    >
      <motion.span
        key={rolling ? `roll-${faceIndex}` : "idle"}
        initial={rolling ? { rotateX: 90, opacity: 0.5 } : false}
        animate={{ rotateX: 0, opacity: 1 }}
        transition={{ duration: 0.1 }}
        className="flex items-center justify-center"
      >
        {diceFaces[faceIndex]}
      </motion.span>
      {rolling ? "翻转中..." : "随机看一篇"}
    </motion.button>
  );
}
