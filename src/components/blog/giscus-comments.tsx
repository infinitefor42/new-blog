"use client";

import { useEffect, useRef, useCallback } from "react";
import { useTheme } from "next-themes";

const GISCUS_CONFIG = {
  repo: process.env.NEXT_PUBLIC_GISCUS_REPO as `${string}/${string}`,
  repoId: process.env.NEXT_PUBLIC_GISCUS_REPO_ID || "",
  category: process.env.NEXT_PUBLIC_GISCUS_CATEGORY || "",
  categoryId: process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID || "",
  mapping: (process.env.NEXT_PUBLIC_GISCUS_MAPPING || "pathname") as string,
};

function getGiscusTheme(resolvedTheme: string | undefined) {
  return resolvedTheme === "dark" ? "noborder_dark" : "noborder_light";
}

export function GiscusComments() {
  const { resolvedTheme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptLoaded = useRef(false);
  const currentTheme = useRef(getGiscusTheme(resolvedTheme));

  const updateTheme = useCallback((theme: string) => {
    const iframe = containerRef.current?.querySelector<HTMLIFrameElement>(
      "iframe.giscus-frame"
    );
    if (iframe?.contentWindow) {
      iframe.contentWindow.postMessage(
        { giscus: { setConfig: { theme } } },
        "https://giscus.app"
      );
    }
  }, []);

  // 主题切换：脚本已加载时通过 postMessage 实时同步
  useEffect(() => {
    const newTheme = getGiscusTheme(resolvedTheme);
    if (scriptLoaded.current && currentTheme.current !== newTheme) {
      currentTheme.current = newTheme;
      updateTheme(newTheme);
    }
  }, [resolvedTheme, updateTheme]);

  // 首次加载：注入 Giscus 脚本
  useEffect(() => {
    if (!containerRef.current || scriptLoaded.current) return;

    // 配置校验：缺少核心参数时在控制台警告
    if (!GISCUS_CONFIG.repo || !GISCUS_CONFIG.repoId || !GISCUS_CONFIG.categoryId) {
      console.warn("[Giscus] 配置不完整，请检查 .env.local 中的 NEXT_PUBLIC_GISCUS_* 变量:", {
        repo: GISCUS_CONFIG.repo || "❌ 缺失",
        repoId: GISCUS_CONFIG.repoId || "❌ 缺失",
        category: GISCUS_CONFIG.category || "❌ 缺失",
        categoryId: GISCUS_CONFIG.categoryId || "❌ 缺失",
      });
      return;
    }

    const theme = getGiscusTheme(resolvedTheme);
    currentTheme.current = theme;

    // 清除已有的 giscus iframe（防止重复加载 / 缓存旧配置）
    const existingIframe = containerRef.current.querySelector("iframe.giscus-frame");
    if (existingIframe) existingIframe.remove();

    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.setAttribute("data-repo", GISCUS_CONFIG.repo);
    script.setAttribute("data-repo-id", GISCUS_CONFIG.repoId);
    script.setAttribute("data-category", GISCUS_CONFIG.category);
    script.setAttribute("data-category-id", GISCUS_CONFIG.categoryId);
    script.setAttribute("data-mapping", GISCUS_CONFIG.mapping);
    script.setAttribute("data-strict", "0");
    script.setAttribute("data-reactions-enabled", "1");
    script.setAttribute("data-emit-metadata", "0");
    script.setAttribute("data-input-position", "top");
    script.setAttribute("data-theme", theme);
    script.setAttribute("data-lang", "zh-CN");
    script.setAttribute("data-loading", "lazy");
    script.crossOrigin = "anonymous";
    script.async = true;

    containerRef.current.innerHTML = "";
    containerRef.current.appendChild(script);
    scriptLoaded.current = true;
  }, [resolvedTheme]);

  return (
    <section className="mt-16 mb-8">
      {/* 分割线 + 标题 */}
      <div className="flex items-center gap-4 mb-8">
        <div className="flex-1 h-px bg-warm-gray/30 dark:bg-rice-white/10" />
        <h2 className="text-sm font-medium tracking-widest text-ink-gray/50 dark:text-rice-white-dim/50 uppercase">
          发表评论
        </h2>
        <div className="flex-1 h-px bg-warm-gray/30 dark:bg-rice-white/10" />
      </div>

      {/* Giscus 容器 */}
      <div
        ref={containerRef}
        className="giscus-wrapper"
      />
    </section>
  );
}
