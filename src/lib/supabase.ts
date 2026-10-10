/**
 * 留言墙数据层 —— 直接使用 Supabase PostgREST API（裸 fetch）。
 * 不引入 @supabase/supabase-js 全量 SDK（auth/realtime/storage 均用不到），
 * 留言墙 chunk 体积因此减少约 20~40KB（gzip）。
 *
 * publishable key 设计为可公开，数据安全由 RLS + check 约束保证：
 * guestbook_messages 表仅开放 select / insert，访客无法修改或删除留言。
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

/** 是否已配置 Supabase（未配置时留言墙展示配置引导而非报错） */
export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

export interface GuestbookMessage {
  id: number;
  nickname: string;
  content: string;
  color: string;
  like_count: number;
  created_at: string;
}

interface NewMessage {
  nickname: string;
  content: string;
  color: string;
}

type Result<T> = { data: T | null; error: string | null };

const REST_ENDPOINT = `${SUPABASE_URL}/rest/v1/guestbook_messages`;

const AUTH_HEADERS = {
  apikey: SUPABASE_ANON_KEY,
  Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
};

/** 分页拉取留言（按时间倒序） */
export async function fetchMessages(
  offset: number,
  limit: number
): Promise<Result<GuestbookMessage[]>> {
  try {
    const res = await fetch(
      `${REST_ENDPOINT}?select=*&order=created_at.desc&offset=${offset}&limit=${limit}`,
      { headers: AUTH_HEADERS }
    );
    if (!res.ok) return { data: null, error: `加载失败（HTTP ${res.status}）` };
    const data = (await res.json()) as GuestbookMessage[];
    return { data, error: null };
  } catch {
    return { data: null, error: "网络异常，请检查连接后重试" };
  }
}

/** 提交一条新留言，成功返回插入的行 */
export async function insertMessage(
  message: NewMessage
): Promise<Result<GuestbookMessage>> {
  try {
    const res = await fetch(REST_ENDPOINT, {
      method: "POST",
      headers: {
        ...AUTH_HEADERS,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify(message),
    });
    if (!res.ok) return { data: null, error: `提交失败（HTTP ${res.status}）` };
    const rows = (await res.json()) as GuestbookMessage[];
    return { data: rows[0] ?? null, error: null };
  } catch {
    return { data: null, error: "网络异常，请检查连接后重试" };
  }
}

/**
 * 更新点赞计数。
 * 安全性：anon 角色仅被授予 like_count 单列的 UPDATE 权限，
 * 即使被直接调用 API 也只能改点赞数，无法篡改留言内容。
 */
export async function updateLikeCount(
  id: number,
  likeCount: number
): Promise<Result<GuestbookMessage>> {
  try {
    const res = await fetch(`${REST_ENDPOINT}?id=eq.${id}`, {
      method: "PATCH",
      headers: {
        ...AUTH_HEADERS,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify({ like_count: Math.max(0, likeCount) }),
    });
    if (!res.ok) return { data: null, error: `操作失败（HTTP ${res.status}）` };
    const rows = (await res.json()) as GuestbookMessage[];
    return { data: rows[0] ?? null, error: null };
  } catch {
    return { data: null, error: "网络异常，请稍后重试" };
  }
}
