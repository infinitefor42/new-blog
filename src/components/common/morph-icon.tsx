"use client";

import { motion } from "framer-motion";
import { appleEasing } from "@/lib/animations";

interface MorphIconProps {
  open: boolean;
  className?: string;
}

const transition = { duration: 0.32, ease: appleEasing };

/** 汉堡菜单 ⇄ 关闭 线条变形图标（三线游动收拢成 X） */
export function MenuMorphIcon({ open, className }: MorphIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      className={className}
      aria-hidden="true"
    >
      {/* 上横线 → X 的 \ 对角线 */}
      <motion.line
        initial={false}
        animate={
          open
            ? { x1: 6, y1: 6, x2: 18, y2: 18 }
            : { x1: 3, y1: 6, x2: 21, y2: 6 }
        }
        transition={transition}
      />
      {/* 中横线 → 向中心收缩淡出 */}
      <motion.line
        initial={false}
        animate={
          open
            ? { x1: 12, y1: 12, x2: 12, y2: 12, opacity: 0 }
            : { x1: 3, y1: 12, x2: 21, y2: 12, opacity: 1 }
        }
        transition={transition}
      />
      {/* 下横线 → X 的 / 对角线 */}
      <motion.line
        initial={false}
        animate={
          open
            ? { x1: 18, y1: 6, x2: 6, y2: 18 }
            : { x1: 3, y1: 18, x2: 21, y2: 18 }
        }
        transition={transition}
      />
    </svg>
  );
}

/** 目录列表 ⇄ 关闭 线条变形图标（圆点淡出，三线游动成 X） */
export function ListMorphIcon({ open, className }: MorphIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      className={className}
      aria-hidden="true"
    >
      {/* 上横线 → X 的 \ 对角线 */}
      <motion.line
        initial={false}
        animate={
          open
            ? { x1: 6, y1: 6, x2: 18, y2: 18 }
            : { x1: 8, y1: 6, x2: 21, y2: 6 }
        }
        transition={transition}
      />
      {/* 中横线 → 向中心收缩淡出 */}
      <motion.line
        initial={false}
        animate={
          open
            ? { x1: 12, y1: 12, x2: 12, y2: 12, opacity: 0 }
            : { x1: 8, y1: 12, x2: 21, y2: 12, opacity: 1 }
        }
        transition={transition}
      />
      {/* 下横线 → X 的 / 对角线 */}
      <motion.line
        initial={false}
        animate={
          open
            ? { x1: 18, y1: 6, x2: 6, y2: 18 }
            : { x1: 8, y1: 18, x2: 21, y2: 18 }
        }
        transition={transition}
      />
      {/* 左侧三个圆点 → 淡出 */}
      {[6, 12, 18].map((y) => (
        <motion.line
          key={y}
          x1="3"
          y1={y}
          x2="3.01"
          y2={y}
          initial={false}
          animate={{ opacity: open ? 0 : 1 }}
          transition={transition}
        />
      ))}
    </svg>
  );
}
