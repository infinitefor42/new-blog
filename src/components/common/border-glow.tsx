"use client";

import { useRef, type ReactNode } from "react";

interface BorderGlowProps {
  children: ReactNode;
  className?: string;
}

/**
 * 鼠标跟随边框辉光。
 * 性能：mousemove 只写 CSS 变量（--glow-x/--glow-y），显隐交给 :hover 伪类，
 * 全程不触发 React 状态更新与重渲染。
 */
export function BorderGlow({ children, className = "" }: BorderGlowProps) {
  const divRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = divRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--glow-x", `${e.clientX - rect.left}px`);
    el.style.setProperty("--glow-y", `${e.clientY - rect.top}px`);
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      className={`group/border-glow relative ${className}`}
    >
      {/* 鼠标跟随高光 */}
      <div
        className="pointer-events-none absolute -inset-px rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover/border-glow:opacity-100 z-0"
        style={{
          background:
            "radial-gradient(600px circle at var(--glow-x, 50%) var(--glow-y, 50%), rgba(255,255,255,0.25), transparent 40%)",
        }}
      />
      {/* 发光边框 */}
      <div
        className="pointer-events-none absolute -inset-px rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover/border-glow:opacity-100 z-0"
        style={{
          background:
            "radial-gradient(400px circle at var(--glow-x, 50%) var(--glow-y, 50%), rgba(255,255,255,0.35), transparent 50%)",
          mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          maskComposite: "exclude",
          WebkitMaskComposite: "xor",
          padding: "1px",
        }}
      />
      {/* 内容（h-full 传递高度：父级高度未定义时自动回退 auto，不影响其他用法） */}
      <div className="relative z-10 h-full">
        {children}
      </div>
    </div>
  );
}
