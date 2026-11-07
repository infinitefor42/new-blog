"use client";

import { useEffect, useRef } from "react";

/**
 * 阅读进度条。
 * 性能：scroll 事件经 rAF 节流后直接写 transform（合成层属性，不触发 layout），
 * 不走 React state，滚动全程零重渲染。
 */
export function ReadingProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ticking = false;

    const update = () => {
      ticking = false;
      const bar = barRef.current;
      if (!bar) return;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress =
        docHeight > 0 ? Math.min(window.scrollY / docHeight, 1) : 0;
      bar.style.transform = `scaleX(${progress})`;
    };

    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] h-[2px] bg-transparent">
      <div
        ref={barRef}
        className="h-full w-full origin-left bg-gradient-to-r from-ink-black/40 via-ink-black/70 to-ink-black/40
          dark:from-rice-white/40 dark:via-rice-white/70 dark:to-rice-white/40"
        style={{ transform: "scaleX(0)" }}
      />
    </div>
  );
}
