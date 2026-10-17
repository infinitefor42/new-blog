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
-- 仅统计真实文章页 /blog/<slug>，排除 /blog/categories/*、/blog/tags/* 等子路径
create or replace function get_all_post_views()
returns table(slug text, view_count bigint)
language sql security definer
set search_path = public
as $$
  select replace(page_path, '/blog/', '') as slug, count(*)::bigint as view_count
  from page_views
  where page_path ~ '^/blog/[^/]+$'
  group by page_path;
$$;

-- ---------- ④ 授权 anon 调用 RPC / 写入 ----------
-- 表级 insert 权限（RLS 策略只管"行"，Postgres 权限管"表"，两者缺一不可）
grant insert on table page_views to anon;

grant execute on function get_site_stats() to anon;
grant execute on function get_post_stats(text) to anon;
grant execute on function get_all_post_views() to anon;

-- ---------- ⑤ 留言点赞原子递增（避免并发覆盖） ----------
-- 客户端调用 /rest/v1/rpc/increment_guestbook_like，
-- 服务端在单条 UPDATE 中完成 like_count = like_count + delta，
-- 替代旧的"读出计数 → +1 → PATCH 写回"逻辑（并发点赞会互相覆盖）。
create or replace function increment_guestbook_like(p_id bigint, p_delta integer)
returns table(like_count integer)
language plpgsql security definer
set search_path = public
as $$
begin
  if p_delta not in (1, -1) then
    raise exception 'invalid delta';
  end if;
  return query
  update guestbook_messages
  set like_count = greatest(0, guestbook_messages.like_count + p_delta)
  where id = p_id
  returning guestbook_messages.like_count;
end;
$$;

grant execute on function increment_guestbook_like(bigint, integer) to anon;

-- ---------- ⑥ 留言墙服务端限流（防 curl 绕过客户端校验灌库） ----------
-- 客户端的 60 秒限流/敏感词/链接上限可被绕过，此触发器在数据库层强制：
--   1) 同一昵称 60 秒内仅允许 1 条留言
--   2) 全局每分钟最多 5 条（兜底，防换昵称刷库）
-- 超出即拒绝插入。个人博客正常频率远低于此阈值，不影响真实用户。
create or replace function guestbook_rate_limit()
returns trigger
language plpgsql security definer
set search_path = public
as $$
begin
  if exists (
    select 1 from guestbook_messages
    where nickname = new.nickname
      and created_at > now() - interval '60 seconds'
  ) then
    raise exception '提交过于频繁，请 60 秒后再试';
  end if;

  if (select count(*) from guestbook_messages
      where created_at > now() - interval '60 seconds') >= 5 then
    raise exception '留言板繁忙，请稍后再试';
  end if;

  return new;
end;
$$;

drop trigger if exists guestbook_rate_limit_trigger on guestbook_messages;
create trigger guestbook_rate_limit_trigger
  before insert on guestbook_messages
  for each row execute function guestbook_rate_limit();

-- ---------- ⑦ 权限收口 + 访问统计插入限流 ----------
-- 7.1 点赞已改为 RPC 原子递增（⑤），anon 不再需要直接 UPDATE 留言表。
--     撤销列级更新授权，堵住"绕过 RPC 直接 PATCH 任意行 like_count"的口子。
revoke update on table guestbook_messages from anon;

-- 7.2 page_views 允许 anon 插入（统计所需），但无频率限制会被刷量。
--     触发器限制：同一 visitor_id 10 秒内仅 1 条 + 全局每秒最多 10 条。
--     正常浏览不可能触发；恶意刷接口会被数据库直接拒绝。
create or replace function page_views_rate_limit()
returns trigger
language plpgsql security definer
set search_path = public
as $$
begin
  if exists (
    select 1 from page_views
    where visitor_id = new.visitor_id
      and created_at > now() - interval '10 seconds'
  ) then
    raise exception 'rate limited';
  end if;

  if (select count(*) from page_views
      where created_at > now() - interval '1 second') >= 10 then
    raise exception 'rate limited';
  end if;

  return new;
end;
$$;

drop trigger if exists page_views_rate_limit_trigger on page_views;
create trigger page_views_rate_limit_trigger
  before insert on page_views
  for each row execute function page_views_rate_limit();

-- ---------- 验证（可选） ----------
-- select * from get_site_stats();
-- select * from get_post_stats('hello-world');
-- select * from get_all_post_views();
