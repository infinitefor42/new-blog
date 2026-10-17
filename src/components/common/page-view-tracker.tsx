"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { trackPageView } from "@/lib/analytics";

/**
 * 全站访问埋点：挂载到根 layout，路由变化时上报当前路径。
 * 无 UI；去重逻辑（同会话同路径一次、严格模式双调用安全）在 trackPageView 内。
 */
export function PageViewTracker() {
  const pathname = usePathname();

  useEffect(() => {
    trackPageView(pathname);
  }, [pathname]);

  return null;
}
