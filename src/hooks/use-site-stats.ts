"use client";

import { useState, useEffect } from "react";

/**
 * 全站访问统计（基于不蒜子真实统计，附带 LocalStorage 本地兜底）
 */
export function useSiteStats() {
  const [stats, setStats] = useState({ visitors: 0, views: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const callbackName = `BusuanziCallback_${Math.floor(Math.random() * 1000000)}`;
    let script: HTMLScriptElement | null = null;
    let timer: NodeJS.Timeout | null = null;

    // 本地 LocalStorage 兜底逻辑
    const fallback = () => {
      const uvKey = "site_uv";
      const pvKey = "site_pv";
      const visitedKey = "site_visited";

      const currentUV = parseInt(localStorage.getItem(uvKey) || "0", 10);
      const currentPV = parseInt(localStorage.getItem(pvKey) || "0", 10);
      const hasVisited = localStorage.getItem(visitedKey);

      const newUV = hasVisited ? currentUV : currentUV + 1;
      const newPV = currentPV + 1;

      localStorage.setItem(uvKey, String(newUV));
      localStorage.setItem(pvKey, String(newPV));
      if (!hasVisited) localStorage.setItem(visitedKey, "1");

      setStats({ visitors: newUV, views: newPV });
      setMounted(true);
    };

    const cleanup = () => {
      if (script && document.body.contains(script)) {
        document.body.removeChild(script);
      }
      delete (window as any)[callbackName];
    };

    // JSONP 回调函数
    (window as any)[callbackName] = (data: any) => {
      if (timer) clearTimeout(timer);
      if (data) {
        setStats({
          visitors: data.site_uv || 1,
          views: data.site_pv || 1,
        });
        setMounted(true);
      } else {
        fallback();
      }
      cleanup();
    };

    // 发起不蒜子 JSONP 请求
    script = document.createElement("script");
    script.src = `https://busuanzi.ibruce.info/busuanzi?jsonpCallback=${callbackName}`;
    script.async = true;
    script.onerror = () => {
      if (timer) clearTimeout(timer);
      fallback();
      cleanup();
    };

    document.body.appendChild(script);

    // 设置 3 秒超时，如果接口超时或被广告拦截则启动本地兜底
    timer = setTimeout(() => {
      fallback();
      cleanup();
    }, 3000);

    return () => {
      if (timer) clearTimeout(timer);
      cleanup();
    };
  }, []);

  return { ...stats, mounted };
}
