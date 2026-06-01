"use client";

import { useState, useEffect } from "react";

/**
 * 基于 localStorage 的轻量级浏览量计数器
 * 每次访问时自增，适用于静态站点
 */
export function useViewCount(projectId: string) {
  const [count, setCount] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const key = `views_${projectId}`;
    const stored = localStorage.getItem(key);
    const current = stored ? parseInt(stored, 10) : 0;
    const next = current + 1;
    localStorage.setItem(key, String(next));
    setCount(next);
    setMounted(true);
  }, [projectId]);

  return { count, mounted };
}
