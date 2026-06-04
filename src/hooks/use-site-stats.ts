"use client";

import { useState, useEffect } from "react";

// Umami 网站 ID
const UMAMI_WEBSITE_ID = "f16a4545-9c81-4a50-913a-0624bb1df01f";

// Cloudflare Worker 代理地址（客户端只需传 id，Token 存在 Worker 中）
// 正确格式：https://umami-proxy.你的用户名.workers.dev
const WORKER_URL = "https://umami-proxy.548620473.workers.dev";

/**
 * 全站访问统计（基于 Umami Cloud，附带 LocalStorage 本地兜底）
 */
export function useSiteStats() {
  const [stats, setStats] = useState({ visitors: 0, views: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    let unmounted = false;

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

      if (!unmounted) {
        setStats({ visitors: newUV, views: newPV });
        setMounted(true);
      }
    };

    const fetchStats = async () => {
      try {
        const res = await fetch(`${WORKER_URL}?id=${UMAMI_WEBSITE_ID}`);

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();

        if (!unmounted && data) {
          setStats({
            visitors: data.visitors?.value ?? 1,
            views: data.pageviews?.value ?? 1,
          });
          setMounted(true);
        }
      } catch {
        // API 失败时降级到本地计数
        fallback();
      }
    };

    fetchStats();

    return () => {
      unmounted = true;
    };
  }, []);

  return { ...stats, mounted };
}
