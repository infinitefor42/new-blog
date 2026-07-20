"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface TypewriterProps {
  texts: string[];
  className?: string;
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseDuration?: number;
}

export function Typewriter({
  texts,
  className = "",
  typingSpeed = 100,
  deletingSpeed = 50,
  pauseDuration = 2000,
}: TypewriterProps) {
  const [displayText, setDisplayText] = useState("");
  const indexRef = useRef(0);
  const charRef = useRef(0);
  const isDeletingRef = useRef(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const timeoutRef = useRef<any>(undefined);

  useEffect(() => {
    const tick = () => {
      const fullText = texts[indexRef.current];

      if (!isDeletingRef.current) {
        // 打字
        charRef.current++;
        setDisplayText(fullText.slice(0, charRef.current));

        if (charRef.current === fullText.length) {
          // 打完，暂停后开始删除
          timeoutRef.current = setTimeout(() => {
            isDeletingRef.current = true;
            tick();
          }, pauseDuration);
          return;
        }
        timeoutRef.current = setTimeout(tick, typingSpeed);
      } else {
        // 删除
        charRef.current--;
        setDisplayText(fullText.slice(0, charRef.current));

        if (charRef.current === 0) {
          // 删完，切换到下一段文字
          isDeletingRef.current = false;
          indexRef.current = (indexRef.current + 1) % texts.length;
          timeoutRef.current = setTimeout(tick, 300);
          return;
        }
        timeoutRef.current = setTimeout(tick, deletingSpeed);
      }
    };

    // 首次启动，延迟一下让组件挂载完成
    timeoutRef.current = setTimeout(tick, 500);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [texts, typingSpeed, deletingSpeed, pauseDuration]);

  return (
    <span className={className}>
      {displayText}
      <motion.span
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
        className="inline-block w-[2px] h-[1em] bg-current ml-0.5 align-middle"
      />
    </span>
  );
}
