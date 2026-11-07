"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoColorPaletteOutline } from "react-icons/io5";
import { appleEasing } from "@/lib/animations";

/**
 * 主题色切换器（五色体系：墨/青瓷/黛蓝/赭石/绛红）
 * - 「墨」为默认档：移除 data-accent，走 :root/.dark 基础变量
 * - 选择写入 localStorage，ThemeScript 在首屏前恢复，无闪烁
 * - 颜色本身仅驱动 CSS 变量，元素过渡由 transition-colors 完成
 */
const ACCENTS = [
  { id: "ink", label: "墨", swatch: "#19130f" },
  { id: "qingci", label: "青瓷", swatch: "#5f7a68" },
  { id: "dai", label: "黛蓝", swatch: "#4a6478" },
  { id: "zhe", label: "赭石", swatch: "#b06a3b" },
  { id: "jiang", label: "绛红", swatch: "#a04a4a" },
] as const;

type AccentId = (typeof ACCENTS)[number]["id"];

/** 订阅 <html data-accent> 变化：ThemeScript 首屏恢复 + 本组件 apply 写入，均会触发 */
function subscribeAccent(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-accent"],
  });
  return () => observer.disconnect();
}

function getAccentSnapshot(): AccentId {
  const v = document.documentElement.getAttribute("data-accent");
  return ACCENTS.some((a) => a.id === v) ? (v as AccentId) : "ink";
}

export function AccentSwitcher() {
  const [open, setOpen] = useState(false);
  // useSyncExternalStore：服务端快照恒为「墨」，避免 hydration 不一致；
  // 水合后自动对账到 ThemeScript 已恢复的 data-accent
  const accent = useSyncExternalStore(
    subscribeAccent,
    getAccentSnapshot,
    () => "ink" as AccentId
  );
  const ref = useRef<HTMLDivElement>(null);

  // 点击外部 / Esc 关闭
  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const apply = (id: AccentId) => {
    if (id === "ink") {
      document.documentElement.removeAttribute("data-accent");
      localStorage.removeItem("accent");
    } else {
      document.documentElement.setAttribute("data-accent", id);
      localStorage.setItem("accent", id);
    }
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label="切换主题色"
        className="flex items-center justify-center w-10 h-10 rounded-xl
          text-ink-gray dark:text-rice-white-dim
          hover:bg-ink-black/5 dark:hover:bg-rice-white/10
          transition-all duration-200"
      >
        <IoColorPaletteOutline className="w-5 h-5" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            aria-label="主题色"
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.22, ease: appleEasing }}
            className="absolute right-0 top-full mt-2 glass-card p-2 shadow-xl origin-top-right"
          >
            <div className="flex items-center gap-2">
              {ACCENTS.map((a) => (
                <button
                  key={a.id}
                  role="menuitemradio"
                  aria-checked={accent === a.id}
                  aria-label={`主题色：${a.label}`}
                  title={a.label}
                  onClick={() => {
                    apply(a.id);
                    setOpen(false);
                  }}
                  className={`w-6 h-6 rounded-full border border-black/10 dark:border-rice-white/20
                    transition-transform duration-200 hover:scale-110
                    ${
                      accent === a.id
                        ? "ring-2 ring-ink-gray/60 dark:ring-rice-white/60 ring-offset-2 ring-offset-paper-bg-light dark:ring-offset-ink-deep"
                        : ""
                    }`}
                  style={{ backgroundColor: a.swatch }}
                />
              ))}
            </div>
            <p className="mt-2 px-1 text-[10px] leading-relaxed text-ink-gray/70 dark:text-rice-white-dim/70 whitespace-nowrap">
              仅改变标题与副标题配色
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
