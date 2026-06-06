"use client";

import { useState, useEffect } from "react";

const UMAMI_WEBSITE_ID = "f16a4545-9c81-4a50-913a-0624bb1df01f";
const WORKER_URL = "https://delicate-shadow-9b6c.548620473.workers.dev";

// sessionStorage 缓存（5 分钟）
const CACHE_KEY = "umami_stats_cache";
const CACHE_TTL = 5 * 60 * 1000;

interface CachedStats {
  visitors: number;
  views: number;
  timestamp: number;
}

function getCachedStats(): { visitors: number; views: number } | null {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const cached: CachedStats = JSON.parse(raw);
    if (Date.now() - cached.timestamp > CACHE_TTL) return null;
    return { visitors: cached.visitors, views: cached.views };
  } catch {
    return null;
  }
}

function setCachedStats(visitors: number, views: number) {
  try {
    sessionStorage.setItem(
      CACHE_KEY,
      JSON.stringify({ visitors, views, timestamp: Date.now() } satisfies CachedStats)
    );
  } catch {
    // sessionStorage 不可用时忽略
  }
}

export function useSiteStats() {
  const [stats, setStats] = useState({ visitors: 0, views: 0 });
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    let unmounted = false;

    // 优先使用缓存
    const cached = getCachedStats();
    if (cached) {
      setStats(cached);
      setMounted(true);
      return () => { unmounted = true; };
    }

    const fetchStats = async () => {
      try {
        const res = await fetch(`${WORKER_URL}?id=${UMAMI_WEBSITE_ID}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();
        if (unmounted) return;

        const visitors = data.visitors?.value ?? 0;
        const views = data.pageviews?.value ?? 0;
        setStats({ visitors, views });
        setCachedStats(visitors, views);
      } catch {
        if (!unmounted) setError(true);
      } finally {
        if (!unmounted) setMounted(true);
      }
    };

    fetchStats();
    return () => { unmounted = true; };
  }, []);

  return { ...stats, mounted, error };
}
