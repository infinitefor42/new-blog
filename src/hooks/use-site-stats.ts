"use client";

import { useState, useEffect } from "react";

/**
 * 全站访问统计（基于 localStorage 模拟）
 * 首次访问记录时间戳，每次加载自增 PV
 */
export function useSiteStats() {
  const [stats, setStats] = useState({ visitors: 0, views: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // 访客数（UV）：首次访问时 +1
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
  }, []);

  return { ...stats, mounted };
}
