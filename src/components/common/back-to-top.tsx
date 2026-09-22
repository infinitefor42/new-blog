"use client";

import { useEffect, useState } from "react";
import { FiArrowUp } from "react-icons/fi";

const RING_RADIUS = 22;
const RING_LENGTH = 2 * Math.PI * RING_RADIUS;

/** 长文一键回到顶部：外圈细环同步显示阅读进度 */
export function BackToTop() {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(docHeight > 0 ? Math.min((scrollTop / docHeight) * 100, 100) : 0);
      // 仅当文章足够长（可滚动距离超过 80% 视口）且已下滑一段距离时才显示
      setVisible(scrollTop > 300 && docHeight > window.innerHeight * 0.8);
    };

    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    update();
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="回到顶部"
      title="回到顶部"
      className={`group fixed bottom-6 left-6 z-40 w-12 h-12 rounded-full
        flex items-center justify-center
        bg-paper-bg/90 dark:bg-ink-deep/90 backdrop-blur-md
        shadow-lg shadow-ink-black/5 dark:shadow-black/30
        text-ink-black dark:text-rice-white
        hover:shadow-xl hover:shadow-ink-black/10 dark:hover:shadow-black/40
        focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent
        transition-all duration-300 ease-out
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}
    >
      <svg
        className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none"
        viewBox="0 0 48 48"
        aria-hidden="true"
      >
        <circle
          cx="24"
          cy="24"
          r={RING_RADIUS}
          fill="none"
          strokeWidth="2"
          className="stroke-warm-gray/50 dark:stroke-warm-gray-dark/40"
        />
        <circle
          cx="24"
          cy="24"
          r={RING_RADIUS}
          fill="none"
          strokeWidth="2"
          strokeLinecap="round"
          className="stroke-accent dark:stroke-accent-light"
          style={{
            strokeDasharray: RING_LENGTH,
            strokeDashoffset: RING_LENGTH * (1 - progress / 100),
            transition: "stroke-dashoffset 150ms ease-out",
          }}
        />
      </svg>
      <FiArrowUp
        className="w-5 h-5 relative z-10
          group-hover:-translate-y-0.5 transition-transform duration-300"
      />
    </button>
  );
}
