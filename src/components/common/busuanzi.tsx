"use client";

import { useEffect, type ReactNode } from "react";
import { usePathname } from "next/navigation";

const SRC = "https://busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js";

type Metric = "site_pv" | "site_uv" | "page_pv";

const METRICS: Record<Metric, { text: string; unit: string }> = {
  site_pv: { text: "总访问量", unit: "次" },
  site_uv: { text: "访客数", unit: "人" },
  page_pv: { text: "本页阅读", unit: "次" },
};

const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "[::1]", "::1"]);

/**
 * 不蒜子按 Referer 的主机名分桶，localhost 是全世界开发者共用的一个桶，
 * 本地预览会拿到上千万的假数字（也会污染别的桶），所以非正式域名一律不统计。
 */
function isTrackableHost() {
  if (process.env.NODE_ENV !== "production") return false;

  const host = window.location.hostname;
  return !LOCAL_HOSTS.has(host) && !host.endsWith(".local");
}

/**
 * 注入不蒜子脚本。
 * 脚本只在加载时按当前地址上报一次，所以路由变化时要重新注入，
 * 否则客户端跳转过来的文章页拿不到自己的阅读量。
 *
 * 本地/开发环境直接跳过：不注入脚本，下面的数值节点就永远是默认隐藏状态。
 */
export function BusuanziScript() {
  const pathname = usePathname();

  useEffect(() => {
    if (!isTrackableHost()) return;

    const script = document.createElement("script");
    script.src = SRC;
    script.async = true;
    document.body.appendChild(script);

    return () => script.remove();
  }, [pathname]);

  return null;
}

/**
 * 统计数值节点；数字由不蒜子脚本写入。
 * 这里不做环境判断——SSG 产物在服务端无法得知域名，按环境条件渲染会导致 hydration 不一致。
 * 隐藏交给 CSS 的 .visit-count 默认样式：脚本不注入，它就一直不显示。
 */
export function VisitCount({ metric, icon }: { metric: Metric; icon?: ReactNode }) {
  const { text, unit } = METRICS[metric];

  return (
    <span id={`busuanzi_container_${metric}`} className="visit-count">
      {icon}
      {text} <span id={`busuanzi_value_${metric}`} /> {unit}
    </span>
  );
}
