-- ============================================================
-- INFINITE Blog 访问统计（替代不蒜子）
-- 在 Supabase SQL Editor 一次性执行；幂等，可重复运行
-- ============================================================

-- ---------- ① 原始访问事件表 ----------
create table if not exists page_views (
  id bigint generated always as identity primary key,
  page_path text not null,                       -- 页面路径，如 /blog/hello-world
  visitor_id uuid not null,                      -- 匿名访客 ID（localStorage，设备级 → UV）
  session_id uuid not null,                      -- 会话 ID（sessionStorage，会话级）
  referrer text,                                 -- 来源页
  user_agent text,                               -- UA（事后分析/过滤爬虫用）
  created_at timestamptz not null default now()
);

-- 统计查询高频条件：按路径聚合、按时间范围过滤
create index if not exists idx_page_views_path on page_views (page_path);
create index if not exists idx_page_views_created on page_views (created_at);

-- ---------- ② RLS ----------
alter table page_views enable row level security;

-- 策略「anon insert only」：anon 角色只能插入埋点行。
-- 不创建任何 select/update/delete 策略 → 匿名 key 无法读出他人访问日志、无法篡改数据。
-- with check 限制字段长度，防止注入超长垃圾数据撑爆存储。
drop policy if exists "anon insert only" on page_views;
create policy "anon insert only" on page_views
  for insert to anon
  with check (
    length(page_path) <= 300
    and length(coalesce(referrer, '')) <= 500
    and length(coalesce(user_agent, '')) <= 500
  );

-- ---------- ③ 聚合 RPC ----------
-- security definer：函数以创建者（postgres）权限执行，绕过 RLS 读取原始表，
-- 是 anon 角色唯一的读出口；只返回聚合数字，不暴露任何明细。
-- set search_path = public：防 search_path 劫持，security definer 函数必写。

-- 站点总 PV / UV（页脚展示）
create or replace function get_site_stats()
returns table(total_pv bigint, total_uv bigint)
language plpgsql security definer
set search_path = public
as $$
begin
  return query
  select count(*)::bigint, count(distinct visitor_id)::bigint
  from page_views;
end;
$$;

-- 单篇文章：阅读量（PV）+ 独立读者数（UV）
create or replace function get_post_stats(p_slug text)
returns table(view_count bigint, reader_count bigint)
language plpgsql security definer
set search_path = public
as $$
begin
  return query
  select count(*)::bigint, count(distinct visitor_id)::bigint
  from page_views
  where page_path = '/blog/' || left(p_slug, 200);
end;
$$;

-- 全部文章阅读量（列表页批量展示用，一次拉全避免 N+1 请求）
create or replace function get_all_post_views()
returns table(slug text, view_count bigint)
language sql security definer
set search_path = public
as $$
  select replace(page_path, '/blog/', '') as slug, count(*)::bigint as view_count
  from page_views
  where page_path like '/blog/%'
  group by page_path;
$$;

-- ---------- ④ 授权 anon 调用 RPC ----------
grant execute on function get_site_stats() to anon;
grant execute on function get_post_stats(text) to anon;
grant execute on function get_all_post_views() to anon;

-- ---------- 验证（可选） ----------
-- select * from get_site_stats();
-- select * from get_post_stats('hello-world');
-- select * from get_all_post_views();
