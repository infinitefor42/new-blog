"use client";

import { useState, useEffect } from "react";

/**
 * 基于 localStorage 的轻量级浏览量计数器
 * 每次访问时自增，适用于静态站点
 * 使用 sessionStorage 防止同一会话内重复计数（StrictMode / 热更新）
 */
export function useViewCount(projectId: string) {
  const [count, setCount] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const key = `views_${projectId}`;
    const sessionKey = `viewed_${projectId}`;
    const stored = localStorage.getItem(key);
    const current = stored ? parseInt(stored, 10) : 0;

    // 同一会话内只计数一次，避免 StrictMode 双重挂载或热更新导致失真
    if (!sessionStorage.getItem(sessionKey)) {
      sessionStorage.setItem(sessionKey, "1");
      const next = current + 1;
      localStorage.setItem(key, String(next));
      setCount(next);
    } else {
      setCount(current);
    }

    setMounted(true);
  }, [projectId]);

  return { count, mounted };
}
