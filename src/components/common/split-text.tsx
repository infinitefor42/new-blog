"use client";

import { motion, type Variants } from "framer-motion";

interface SplitTextProps {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
  delay?: number;
  staggerChildren?: number;
  /** 每个字符的动画变体，可自定义 */
  childVariants?: Variants;
}

const defaultChildVariants: Variants = {
  hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.4, ease: [0.23, 1, 0.32, 1] },
  },
};

/** 预创建的 motion 组件映射：避免渲染期调用 motion.create 反复重建组件 */
const MOTION_TAGS = {
  h1: motion.create("h1"),
  h2: motion.create("h2"),
  h3: motion.create("h3"),
  p: motion.create("p"),
  span: motion.create("span"),
} as const;

export function SplitText({
  text,
  className = "",
  as: Tag = "span",
  delay = 0,
  staggerChildren = 0.03,
  childVariants = defaultChildVariants,
}: SplitTextProps) {
  const MotionTag = MOTION_TAGS[Tag];

  return (
    <MotionTag
      className={className}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren,
            delayChildren: delay,
          },
        },
      }}
    >
      {text.split("").map((char, i) => (
        <motion.span
          key={`${char}-${i}`}
          variants={childVariants}
          className="inline-block"
          style={{ whiteSpace: char === " " ? "pre" : "normal" }}
        >
          {char}
        </motion.span>
      ))}
    </MotionTag>
  );
}
