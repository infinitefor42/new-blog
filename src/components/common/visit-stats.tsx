"use client";

/**
 * 访问统计展示组件（替代不蒜子 VisitCount）。
 *
 * 为什么用客户端渲染：项目是静态导出（output: "export"），构建期没有运行数据，
 * 访问量只能在浏览器挂载后实时拉取，因此必须是客户端组件。
 * 加载中显示占位文案；Supabase 未配置或请求失败返回 null 时静默隐藏，
 * 不渲染空标签——与不蒜子"服务不可用即隐藏"的行为对齐。
 */

import { useEffect, useState } from "react";
import {
  fetchSiteStats,
  type SiteStats,
} from "@/lib/analytics";

/** 通用取数 hook：挂载时拉一次，组件卸载后不再 setState */
function useStats<T>(fetcher: () => Promise<T | null>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    fetcher().then((result) => {
      if (cancelled) return;
      setData(result);
      setLoading(false);
    });
    return () => {
      cancelled = true;
    };
    // fetcher 由调用处内联传入，仅需挂载时执行一次
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { data, loading };
}

/** 页脚：全站累计 PV / UV */
export function SiteVisitStats() {
  const { data, loading } = useStats<SiteStats>(fetchSiteStats);

  if (loading) {
    return <span className="opacity-60">统计加载中…</span>;
  }
  if (!data) return null;

  return (
    <>
      <span>总访问量 {data.pv.toLocaleString()} 次</span>
      <span>访客数 {data.uv.toLocaleString()} 人</span>
    </>
  );
}
