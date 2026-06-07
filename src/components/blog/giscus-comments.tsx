"use client";

import { useEffect, useRef, useCallback } from "react";
import { useTheme } from "next-themes";

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

  // 主题切换
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

    // 在 useEffect 内读取环境变量，并提供 .env.local 中的预设静态回退值，确保在任何环境下都能加载
    const repo = process.env.NEXT_PUBLIC_GISCUS_REPO || "infinitefor42/new-blog";
    const repoId = process.env.NEXT_PUBLIC_GISCUS_REPO_ID || "R_kgDOStseQg";
    const category = process.env.NEXT_PUBLIC_GISCUS_CATEGORY || "General";
    const categoryId = process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID || "DIC_kwDOStseQs4C-Ru4";
    const mapping = process.env.NEXT_PUBLIC_GISCUS_MAPPING || "pathname";

    // 配置校验
    if (!repo || !repoId || !categoryId) {
      console.warn("[Giscus] 配置不完整，请检查 .env.local:", {
        repo: repo || "❌ 缺失",
        repoId: repoId || "❌ 缺失",
        category: category || "❌ 缺失",
        categoryId: categoryId || "❌ 缺失",
      });
      return;
    }

    const theme = getGiscusTheme(resolvedTheme);
    currentTheme.current = theme;

    const existingIframe = containerRef.current.querySelector("iframe.giscus-frame");
    if (existingIframe) existingIframe.remove();

    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.setAttribute("data-repo", repo);
    script.setAttribute("data-repo-id", repoId);
    script.setAttribute("data-category", category);
    script.setAttribute("data-category-id", categoryId);
    script.setAttribute("data-mapping", mapping);
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
  }, []);

  return (
    <section className="mt-16 mb-8">
      <div className="flex items-center gap-4 mb-8">
        <div className="flex-1 h-px bg-warm-gray/30 dark:bg-rice-white/10" />
        <h2 className="text-sm font-medium tracking-widest text-ink-gray/50 dark:text-rice-white-dim/50 uppercase">
          发表评论
        </h2>
        <div className="flex-1 h-px bg-warm-gray/30 dark:bg-rice-white/10" />
      </div>
      <div ref={containerRef} className="giscus-wrapper" />
    </section>
  );
}
