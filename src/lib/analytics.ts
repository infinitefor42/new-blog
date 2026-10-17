/**
 * 访问统计埋点与查询 —— 裸 fetch PostgREST/RPC，与 lib/supabase.ts 同风格。
 * 替代原不蒜子统计：数据自建于 Supabase，anon key 公开安全由 RLS 保证
 * （page_views 表 anon 只写不读，读取全部经 security definer 的聚合 RPC）。
 *
 * 可靠性约定：所有函数失败时静默返回 null/void，
 * 不得抛出未捕获异常、不得阻塞页面渲染。
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/** 是否已配置 Supabase（未配置时埋点与查询全部静默跳过） */
export const isAnalyticsConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

const AUTH_HEADERS = {
  apikey: SUPABASE_ANON_KEY,
  Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
};

const JSON_HEADERS = {
  ...AUTH_HEADERS,
  "Content-Type": "application/json",
};

const VISITOR_KEY = "site_visitor_id";
const SESSION_KEY = "site_session_id";

const LOCAL_HOSTS = new Set(["localhost", "127.0.0.1", "[::1]", "::1"]);

/** 本地/预览环境不上报，避免开发访问污染正式统计 */
function isTrackableHost(): boolean {
  if (process.env.NODE_ENV !== "production") return false;
  const host = window.location.hostname;
  return !LOCAL_HOSTS.has(host) && !host.endsWith(".local");
}

function getOrCreateId(storage: Storage, key: string): string {
  let id = storage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    storage.setItem(key, id);
  }
  return id;
}

/**
 * 上报一次页面访问。
 * 去重策略：同一会话（sessionStorage）同一路径只上报一次。
 * - inFlight 集合同步去重：React 严格模式双调用时第二次直接跳过；
 * - sessionStorage 标记仅在请求成功后写入：失败（网络/RLS）还能重试，
 *   不会出现"第一次失败后本会话永远不计数"。
 * UV 由 visitor_id（localStorage，设备级）在数据库侧 count(distinct) 得出。
 */
const inFlight = new Set<string>();

export async function trackPageView(pagePath: string): Promise<void> {
  if (!isAnalyticsConfigured || !isTrackableHost()) return;

  const dedupKey = `pv_${pagePath}`;
  if (sessionStorage.getItem(dedupKey) || inFlight.has(dedupKey)) return;
  inFlight.add(dedupKey);

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/page_views`, {
      method: "POST",
      headers: { ...JSON_HEADERS, Prefer: "return=minimal" },
      body: JSON.stringify({
        page_path: pagePath,
        visitor_id: getOrCreateId(localStorage, VISITOR_KEY),
        session_id: getOrCreateId(sessionStorage, SESSION_KEY),
        referrer: document.referrer || null,
        user_agent: navigator.userAgent,
      }),
    });
    // 仅成功才记为"本会话已上报"，失败允许下次路由/刷新重试
    if (res.ok) sessionStorage.setItem(dedupKey, "1");
  } catch {
    /* 埋点失败静默，不影响页面 */
  } finally {
    inFlight.delete(dedupKey);
  }
}

// ---------- 查询 ----------

export interface SiteStats {
  pv: number;
  uv: number;
}

export interface PostStats {
  views: number;
  readers: number;
}

/** 调用 RPC 的通用封装：失败一律返回 null */
async function callRpc<T>(fn: string, body: Record<string, unknown>): Promise<T | null> {
  if (!isAnalyticsConfigured) return null;
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/${fn}`, {
      method: "POST",
      headers: JSON_HEADERS,
      body: JSON.stringify(body),
    });
    if (!res.ok) return null;
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

/** 站点总访问量 / 独立访客数（页脚） */
export async function fetchSiteStats(): Promise<SiteStats | null> {
  const rows = await callRpc<{ total_pv: number; total_uv: number }[]>(
    "get_site_stats",
    {}
  );
  const row = rows?.[0];
  return row ? { pv: row.total_pv, uv: row.total_uv } : null;
}

/** 单篇文章阅读量 / 独立读者数（文章详情页） */
export async function fetchPostStats(slug: string): Promise<PostStats | null> {
  const rows = await callRpc<{ view_count: number; reader_count: number }[]>(
    "get_post_stats",
    { p_slug: slug }
  );
  const row = rows?.[0];
  return row ? { views: row.view_count, readers: row.reader_count } : null;
}

/** 全部文章阅读量映射（列表页批量展示，一次请求避免 N+1） */
export async function fetchAllPostViews(): Promise<Record<string, number> | null> {
  const rows = await callRpc<{ slug: string; view_count: number }[]>(
    "get_all_post_views",
    {}
  );
  if (!rows) return null;
  return Object.fromEntries(rows.map((r) => [r.slug, r.view_count]));
}
