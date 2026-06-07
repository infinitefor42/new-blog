import type { Variants } from "framer-motion";

/** Apple 风格缓动曲线 */
export const appleEasing: [number, number, number, number] = [0.23, 1, 0.32, 1];

/** 创建交错淡入容器变体 */
export function createContainerVariants(
  staggerChildren = 0.1,
  delayChildren = 0.2
): Variants {
  return {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren, delayChildren },
    },
  };
}

/** 创建上浮淡入卡片变体 */
export function createCardVariants(duration = 0.6, y = 30): Variants {
  return {
    hidden: { opacity: 0, y },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration, ease: appleEasing },
    },
  };
}
