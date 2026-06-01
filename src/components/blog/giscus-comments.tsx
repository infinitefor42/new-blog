"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "next-themes";

/**
 * Giscus 评论组件
 *
 * 使用前请在 .env.local 中配置以下环境变量：
 *
 *   NEXT_PUBLIC_GISCUS_REPO=你的用户名/仓库名
 *   NEXT_PUBLIC_GISCUS_REPO_ID=R_xxxxxxxx
 *   NEXT_PUBLIC_GISCUS_CATEGORY=Announcements
 *   NEXT_PUBLIC_GISCUS_CATEGORY_ID=DIC_xxxxxxxx
 *
 * 获取方式：https://giscus.app/zh-CN
 */

const GISCUS_CONFIG = {
  repo: process.env.NEXT_PUBLIC_GISCUS_REPO as `${string}/${string}`,
  repoId: process.env.NEXT_PUBLIC_GISCUS_REPO_ID || "",
  category: process.env.NEXT_PUBLIC_GISCUS_CATEGORY || "",
  categoryId: process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID || "",
};

export function GiscusComments() {
  const { resolvedTheme } = useTheme();
  const containerRef = useRef<HTMLDivElement>(null);
  const scriptLoaded = useRef(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const giscusTheme = resolvedTheme === "dark" ? "noborder_dark" : "noborder_light";

    // 如果脚本已加载，只切换主题
    if (scriptLoaded.current) {
      const iframe = containerRef.current.querySelector<HTMLIFrameElement>("iframe.giscus-frame");
      if (iframe?.contentWindow) {
        iframe.contentWindow.postMessage(
          { giscus: { setConfig: { theme: giscusTheme } } },
          "https://giscus.app"
        );
      }
      return;
    }

    // 首次加载：注入 Giscus script
    const script = document.createElement("script");
    script.src = "https://giscus.app/client.js";
    script.setAttribute("data-repo", GISCUS_CONFIG.repo);
    script.setAttribute("data-repo-id", GISCUS_CONFIG.repoId);
    script.setAttribute("data-category", GISCUS_CONFIG.category);
    script.setAttribute("data-category-id", GISCUS_CONFIG.categoryId);
    script.setAttribute("data-mapping", "pathname");
    script.setAttribute("data-strict", "0");
    script.setAttribute("data-reactions-enabled", "1");
    script.setAttribute("data-emit-metadata", "0");
    script.setAttribute("data-input-position", "top");
    script.setAttribute("data-theme", giscusTheme);
    script.setAttribute("data-lang", "zh-CN");
    script.setAttribute("data-loading", "lazy");
    script.crossOrigin = "anonymous";
    script.async = true;

    containerRef.current.innerHTML = "";
    containerRef.current.appendChild(script);
    scriptLoaded.current = true;
  }, [resolvedTheme]);

  return (
    <div className="mt-12">
      <div ref={containerRef} className="giscus" />
    </div>
  );
}
