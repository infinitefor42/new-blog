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

-- ---------- ③ 爬虫识别函数（③中的统计 RPC 依赖，需先定义） ----------
-- immutable：同一 UA 永远返回同一结果，可用于索引与查询优化器内联

-- 判定 UA 是否属于爬虫/机器人
create or replace function is_bot_ua(ua text)
returns boolean
language sql immutable
as $$
  select coalesce(ua, '') ~* 'bot|crawler|spider|scraper|slurp|facebookexternalhit|headless|phantom|wget|curl|python-requests|scrapy|archive';
$$;

-- 从 UA 提取爬虫名称与版本号（人类访客返回 null）
create or replace function bot_info(ua text)
returns table(name text, version text)
language sql immutable
as $$
  select
    case
      when ua ~* 'googlebot' then 'Googlebot'
      when ua ~* 'bingbot' then 'bingbot'
      when ua ~* 'baiduspider' then 'Baiduspider'
      when ua ~* 'yandex' then 'YandexBot'
      when ua ~* 'duckduckbot' then 'DuckDuckBot'
      when ua ~* 'sogou' then 'Sogou'
      when ua ~* 'bytespider' then 'Bytespider'
      when ua ~* 'gptbot' then 'GPTBot'
      when ua ~* 'claudebot|anthropic' then 'ClaudeBot'
      when ua ~* 'ahrefsbot' then 'AhrefsBot'
      when ua ~* 'semrushbot' then 'SemrushBot'
      when ua ~* 'mj12bot' then 'MJ12bot'
      when ua ~* 'petalbot' then 'PetalBot'
      when is_bot_ua(ua) then 'other-bot'
      else null
    end,
    substring(ua from '[Bb]ot/(\d+(?:\.\d+)*)');
$$;

-- ---------- ③ 聚合 RPC ----------
-- security definer：函数以创建者（postgres）权限执行，绕过 RLS 读取原始表，
-- 是 anon 角色唯一的读出口；只返回聚合数字，不暴露任何明细。
-- set search_path = public：防 search_path 劫持，security definer 函数必写。

-- 站点总 PV / UV（页脚展示，已排除爬虫流量）
create or replace function get_site_stats()
returns table(total_pv bigint, total_uv bigint)
language plpgsql security definer
set search_path = public
as $$
begin
  return query
  select count(*)::bigint, count(distinct visitor_id)::bigint
  from page_views
  where not is_bot_ua(user_agent);
end;
$$;

-- 单篇文章：阅读量（PV）+ 独立读者数（UV），已排除爬虫
create or replace function get_post_stats(p_slug text)
returns table(view_count bigint, reader_count bigint)
language plpgsql security definer
set search_path = public
as $$
begin
  return query
  select count(*)::bigint, count(distinct visitor_id)::bigint
  from page_views
  where page_path = '/blog/' || left(p_slug, 200)
    and not is_bot_ua(user_agent);
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
    and not is_bot_ua(user_agent)
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

-- ---------- ⑧ UTM 渠道追踪 + 访客视角视图 ----------
-- 在 SQL Editor 单独执行本段；幂等，可重复运行

-- 8.1 新增 UTM 字段（分享链接带 ?utm_source=xxx 时前端写入）
alter table page_views
  add column if not exists utm_source text,
  add column if not exists utm_medium text,
  add column if not exists utm_campaign text;

-- 8.2 访客路径回溯与渠道分析索引
create index if not exists idx_page_views_visitor on page_views (visitor_id, created_at);
create index if not exists idx_page_views_session on page_views (session_id);

-- 8.3 RLS 约束同步：重建插入策略，追加 UTM 长度限制
drop policy if exists "anon insert only" on page_views;
create policy "anon insert only" on page_views
  for insert to anon
  with check (
    length(page_path) <= 300
    and length(coalesce(referrer, '')) <= 500
    and length(coalesce(user_agent, '')) <= 500
    and length(coalesce(utm_source, '')) <= 100
    and length(coalesce(utm_medium, '')) <= 100
    and length(coalesce(utm_campaign, '')) <= 100
  );

-- 8.4 渠道归一化视图：回答"访客从哪来"
-- 注意：仅 postgres 角色可查（RLS 在底层表生效），严禁 grant 给 anon
create or replace view v_traffic_channels as
select
  case
    when utm_source is not null then utm_source
    when referrer is null or referrer = '' then 'direct'
    when referrer ~* '(google|bing|baidu|sogou|duckduckgo|yandex)' then 'search'
    when referrer ~* '(weibo|zhihu|t\.co|twitter|x\.com|weixin|mp\.weixin|xiaohongshu|douyin|bilibili)' then 'social'
    when referrer ~* 'caobowen\.top' then 'internal'
    else regexp_replace(referrer, '^https?://(www\.)?([^/]+).*$', '\2')
  end as channel,
  count(*)::bigint as pv,
  count(distinct visitor_id)::bigint as uv
from page_views
where not is_bot_ua(user_agent)
group by 1
order by pv desc;

-- 8.5 单访客访问路径视图：回答"谁来过、看了哪些页"
create or replace view v_visitor_journeys as
select
  visitor_id,
  count(distinct session_id)::bigint as visits,
  min(created_at) as first_seen,
  max(created_at) as last_seen,
  jsonb_agg(
    jsonb_build_object('path', page_path, 'at', created_at)
    order by created_at
  ) as journey
from page_views
group by visitor_id
order by last_seen desc;

-- ---------- 验证（可选） ----------
-- select * from get_site_stats();
-- select * from get_post_stats('hello-world');
-- select * from get_all_post_views();
-- select * from v_traffic_channels;
-- select * from v_visitor_journeys;

-- ---------- ⑨ 爬虫流量观测（可选执行） ----------
-- 主统计（③④⑧）已全部排除爬虫；本段仅用于"看看爬虫都来了多少"

-- 9.1 按爬虫名称 + 版本号聚合的观测视图
create or replace view v_bot_traffic as
select
  (bot_info(user_agent)).name as bot_name,
  (bot_info(user_agent)).version as bot_version,
  count(*)::bigint as hits,
  count(distinct page_path)::bigint as pages_crawled,
  max(created_at) as last_seen
from page_views
where is_bot_ua(user_agent)
group by 1, 2
order by hits desc;

-- 9.2 人类流量部分索引（可选，数据量超十万行后再建也来得及）
-- create index if not exists idx_page_views_human
--   on page_views (created_at)
--   where not is_bot_ua(user_agent);

-- 验证：
-- select * from v_bot_traffic;
-- select bot_info('Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)');
