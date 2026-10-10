"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { FiSearch, FiSend, FiEdit3, FiRefreshCw, FiHeart } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import {
  fetchMessages,
  insertMessage,
  updateLikeCount,
  isSupabaseConfigured,
  type GuestbookMessage,
} from "@/lib/supabase";

/** 便签配色：纸张浅色 + 暗色模式各自适配（类名需完整字面量以被 Tailwind 扫描） */
const NOTE_COLORS: Record<
  string,
  { label: string; card: string; dot: string }
> = {
  yellow: {
    label: "暖黄",
    card: "bg-[#FFF3C4] border-[#E8D48B] dark:bg-[#4d421f] dark:border-[#8a7433]",
    dot: "bg-[#F0C930]",
  },
  pink: {
    label: "樱粉",
    card: "bg-[#FFDDDC] border-[#EFB3B0] dark:bg-[#4e2a28] dark:border-[#8a4c46]",
    dot: "bg-[#F19490]",
  },
  blue: {
    label: "浅蓝",
    card: "bg-[#D9EBFD] border-[#AECDEF] dark:bg-[#24344d] dark:border-[#3f5c85]",
    dot: "bg-[#6BA3E0]",
  },
  green: {
    label: "豆绿",
    card: "bg-[#DCF2D9] border-[#B2DCA9] dark:bg-[#2a4229] dark:border-[#4c7a48]",
    dot: "bg-[#7CBF6F]",
  },
  purple: {
    label: "黛紫",
    card: "bg-[#EBDFFB] border-[#CDB8EC] dark:bg-[#382e4e] dark:border-[#63518a]",
    dot: "bg-[#A986D9]",
  },
  orange: {
    label: "蜜橙",
    card: "bg-[#FFE4C7] border-[#F0C08F] dark:bg-[#4d351c] dark:border-[#8a6132]",
    dot: "bg-[#F5A83C]",
  },
  teal: {
    label: "青碧",
    card: "bg-[#CDF0EA] border-[#A3DCD2] dark:bg-[#1f4340] dark:border-[#37736c]",
    dot: "bg-[#4EC4B4]",
  },
  rose: {
    label: "蔷薇",
    card: "bg-[#FBDCE7] border-[#F0B4C9] dark:bg-[#4d2433] dark:border-[#8a4360]",
    dot: "bg-[#EC7FA5]",
  },
  slate: {
    label: "月灰",
    card: "bg-[#E4E2DC] border-[#C4C1B8] dark:bg-[#3b3a35] dark:border-[#66625a]",
    dot: "bg-[#9B968C]",
  },
};

const COLOR_KEYS = Object.keys(NOTE_COLORS);

/** 便签随机微旋转角度（按索引确定性取值，避免 hydration 不一致） */
const ROTATIONS = [-1.5, 1.2, -0.8, 1.8, -2, 0.6, -1.1, 1.5];

const MAX_LENGTH = 500;
const PAGE_SIZE = 30;

/** 反垃圾：同一设备两次提交的最小间隔（秒） */
const RATE_LIMIT_SECONDS = 60;
const RATE_LIMIT_KEY = "guestbook_last_submit";

/** 本设备已点赞的留言 id 列表 */
const LIKED_KEY = "guestbook_liked";

/** 草稿暂存键：输入中的昵称 / 正文 / 配色 */
const DRAFT_KEY = "guestbook_draft";

type Draft = { nickname: string; content: string; color: string };

const EMPTY_DRAFT: Draft = { nickname: "", content: "", color: "yellow" };

function readDraft(): Draft {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return EMPTY_DRAFT;
    const draft = JSON.parse(raw) as Partial<Draft>;
    return {
      nickname: typeof draft.nickname === "string" ? draft.nickname.slice(0, 20) : "",
      content:
        typeof draft.content === "string" ? draft.content.slice(0, MAX_LENGTH) : "",
      color:
        typeof draft.color === "string" && NOTE_COLORS[draft.color]
          ? draft.color
          : "yellow",
    };
  } catch {
    return EMPTY_DRAFT;
  }
}

function clearDraft() {
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch {
    /* 隐私模式忽略 */
  }
}

function readLikedIds(): number[] {
  try {
    const raw = JSON.parse(localStorage.getItem(LIKED_KEY) || "[]");
    return Array.isArray(raw) ? raw.filter((x) => Number.isInteger(x)) : [];
  } catch {
    return [];
  }
}

/** 客户端敏感词表：命中即拒绝提交（低成本拦截广告机） */
const BLOCKED_WORDS = [
  "加微信", "兼职", "刷单", "代购", "赌场", "博彩", "代开发票",
  "免费领取", "点击链接", "加qq", "casino", "viagra", "airdrop",
];

/** 链接数量上限：超过即拒绝 */
const MAX_LINKS = 2;

function countLinks(text: string) {
  return (text.match(/https?:\/\/|www\./gi) ?? []).length;
}

function containsBlockedWord(text: string) {
  const lower = text.toLowerCase();
  return BLOCKED_WORDS.some((w) => lower.includes(w.toLowerCase()));
}

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** 相对时间：刚刚 / N 分钟前 / N 小时前 / N 天前 / 绝对日期 */
function relativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "刚刚";
  if (minutes < 60) return `${minutes} 分钟前`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} 小时前`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} 天前`;
  return formatDate(iso);
}

function StickyNote({
  message,
  index,
  liked,
  onToggleLike,
}: {
  message: GuestbookMessage;
  index: number;
  liked: boolean;
  onToggleLike: (message: GuestbookMessage) => void;
}) {
  const color = NOTE_COLORS[message.color] ?? NOTE_COLORS.yellow;
  const rotation = ROTATIONS[index % ROTATIONS.length];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, rotate: 0 }}
      animate={{ opacity: 1, y: 0, rotate: rotation }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.05, 0.5) }}
      whileHover={{ rotate: 0, scale: 1.03, zIndex: 10 }}
      className={`relative mb-5 break-inside-avoid rounded-md border p-4 pt-5 shadow-md shadow-black/5 dark:shadow-black/30 ${color.card}`}
    >
      {/* 顶部胶带 */}
      <div className="absolute -top-2 left-1/2 h-5 w-16 -translate-x-1/2 -rotate-2 rounded-sm bg-ink-black/10 dark:bg-rice-white/20" />
      <p className="whitespace-pre-wrap text-sm leading-relaxed text-ink-black/85 dark:text-rice-white/90">
        {message.content}
      </p>
      <div className="mt-3 flex items-center justify-between border-t border-ink-black/10 pt-2 dark:border-rice-white/15">
        <span className="text-xs font-medium text-ink-black/60 dark:text-rice-white-dim">
          {message.nickname}
        </span>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onToggleLike(message)}
            aria-label={liked ? "取消点赞" : "点赞"}
            className={`flex items-center gap-1 text-xs transition-all hover:scale-110 ${
              liked
                ? "text-[#E2607F]"
                : "text-ink-black/40 hover:text-[#E2607F] dark:text-rice-white-dim/70"
            }`}
          >
            {liked ? (
              <FaHeart className="h-3.5 w-3.5" />
            ) : (
              <FiHeart className="h-3.5 w-3.5" />
            )}
            <span>{message.like_count}</span>
          </button>
          <span
            title={formatDate(message.created_at)}
            className="text-xs text-ink-black/40 dark:text-rice-white-dim/70"
          >
            {relativeTime(message.created_at)}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export function GuestbookClient() {
  const [messages, setMessages] = useState<GuestbookMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [query, setQuery] = useState("");

  const [nickname, setNickname] = useState("");
  const [content, setContent] = useState("");
  const [color, setColor] = useState("yellow");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitOk, setSubmitOk] = useState(false);
  // 蜜罐字段：正常用户不可见也不会填写，被填入即判定为机器人
  const [website, setWebsite] = useState("");
  // 本设备已点赞的留言 id
  const [likedIds, setLikedIds] = useState<number[]>([]);
  // 提交成功后抑制一次草稿写回，否则清空 content 的那次渲染会把草稿又写回去
  const skipDraftWrite = useRef(false);
  // 草稿是否已从 localStorage 恢复过（防止恢复前的初始空值把草稿覆盖掉）
  const draftRestored = useRef(false);

  // 挂载后恢复草稿 + 点赞记录。
  // localStorage 只在浏览器存在，无法用于 state 初始化（会导致 SSR/hydration 不一致），
  // 因此挂载后同步一次。首帧不渲染输入值，用户无感知。
  useEffect(() => {
    const draft = readDraft();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- 挂载时从 localStorage 同步一次，属外部系统读取
    setNickname(draft.nickname);
    setContent(draft.content);
    setColor(draft.color);
    setLikedIds(readLikedIds());
    draftRestored.current = true;
  }, []);

  // 输入变化时写入草稿：空内容则清除，避免留下空壳
  useEffect(() => {
    if (!draftRestored.current) return;
    if (skipDraftWrite.current) {
      skipDraftWrite.current = false;
      return;
    }
    try {
      const isEmpty =
        !nickname.trim() && !content.trim() && color === "yellow";
      if (isEmpty) {
        localStorage.removeItem(DRAFT_KEY);
      } else {
        localStorage.setItem(
          DRAFT_KEY,
          JSON.stringify({ nickname, content, color })
        );
      }
    } catch {
      /* 隐私模式 / 配额超限忽略 */
    }
  }, [nickname, content, color]);

  // 已从服务端加载的条数（分页游标）。
  // 不能直接用 messages.length：本地新提交的留言会前插，导致游标错位、翻页重复或漏读。
  const loadedCountRef = useRef(0);
  // 加载更多请求去重，防止快速连点造成并发重复拉取
  const loadingMoreRef = useRef(false);

  const loadMessages = useCallback(async (from: number) => {
    if (!isSupabaseConfigured) {
      setLoading(false);
      return;
    }
    if (from === 0) {
      setLoading(true);
    } else {
      if (loadingMoreRef.current) return;
      loadingMoreRef.current = true;
      setLoadingMore(true);
    }
    setLoadError("");

    const { data, error } = await fetchMessages(from, PAGE_SIZE);
    if (error) {
      setLoadError(error);
    } else if (data) {
      setMessages((prev) => (from === 0 ? data : [...prev, ...data]));
      setHasMore(data.length === PAGE_SIZE);
      // 游标只统计服务端返回的条数，不受本地新提交影响
      loadedCountRef.current = from === 0 ? data.length : loadedCountRef.current + data.length;
    }
    setLoading(false);
    loadingMoreRef.current = false;
    setLoadingMore(false);
  }, []);

  // 首次挂载拉取第一页（loadMessages 内部首行会同步 setLoading）
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- 首次加载数据，需立即可见 loading 态
    void loadMessages(0);
  }, [loadMessages]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return messages;
    return messages.filter(
      (m) =>
        m.content.toLowerCase().includes(q) ||
        m.nickname.toLowerCase().includes(q)
    );
  }, [messages, query]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    // 蜜罐触发：静默丢弃并伪装成功，不给机器人任何反馈信号
    if (website) {
      skipDraftWrite.current = true;
      clearDraft();
      setContent("");
      setSubmitOk(true);
      setTimeout(() => setSubmitOk(false), 3000);
      return;
    }

    // 客户端限流：同一设备 60 秒内只能提交一条
    const lastSubmit = parseInt(localStorage.getItem(RATE_LIMIT_KEY) || "0");
    const waitMs = RATE_LIMIT_SECONDS * 1000 - (Date.now() - lastSubmit);
    if (waitMs > 0) {
      setSubmitError(`发送太频繁啦，请 ${Math.ceil(waitMs / 1000)} 秒后再试`);
      return;
    }

    const trimmed = content.trim();
    if (!trimmed) {
      setSubmitError("写点什么再贴上去吧");
      return;
    }
    if (trimmed.length > MAX_LENGTH) {
      setSubmitError(`最多 ${MAX_LENGTH} 字`);
      return;
    }
    // 内容过滤：敏感词 + 链接数量
    if (containsBlockedWord(trimmed)) {
      setSubmitError("留言包含不适合发布的内容，请修改后再试");
      return;
    }
    if (countLinks(trimmed) > MAX_LINKS) {
      setSubmitError(`留言中最多包含 ${MAX_LINKS} 个链接`);
      return;
    }

    setSubmitting(true);
    setSubmitError("");
    setSubmitOk(false);

    const { data, error } = await insertMessage({
      nickname: nickname.trim() || "匿名",
      content: trimmed,
      color,
    });

    setSubmitting(false);
    if (error) {
      setSubmitError(error);
      return;
    }
    if (data) {
      setMessages((prev) => [data, ...prev]);
    }
    localStorage.setItem(RATE_LIMIT_KEY, String(Date.now()));
    // 已成功上墙，草稿使命完成：抑制写回 + 清空表单 + 删草稿
    skipDraftWrite.current = true;
    clearDraft();
    setContent("");
    setSubmitOk(true);
    setTimeout(() => setSubmitOk(false), 3000);
  };

  // 点赞 / 取消点赞：乐观更新，失败回滚
  const handleToggleLike = async (message: GuestbookMessage) => {
    const liked = likedIds.includes(message.id);
    const nextCount = Math.max(0, message.like_count + (liked ? -1 : 1));
    const nextLikedIds = liked
      ? likedIds.filter((x) => x !== message.id)
      : [...likedIds, message.id];

    // 乐观更新本地状态
    setLikedIds(nextLikedIds);
    setMessages((prev) =>
      prev.map((m) => (m.id === message.id ? { ...m, like_count: nextCount } : m))
    );
    try {
      localStorage.setItem(LIKED_KEY, JSON.stringify(nextLikedIds));
    } catch { /* 隐私模式忽略 */ }

    const { data, error } = await updateLikeCount(message.id, nextCount);
    if (error) {
      // 回滚
      setLikedIds(likedIds);
      setMessages((prev) =>
        prev.map((m) => (m.id === message.id ? { ...m, like_count: message.like_count } : m))
      );
      try {
        localStorage.setItem(LIKED_KEY, JSON.stringify(likedIds));
      } catch { /* 忽略 */ }
    } else if (data) {
      // 以服务器计数为准（多人并发点赞时保持准确）
      setMessages((prev) =>
        prev.map((m) => (m.id === message.id ? { ...m, like_count: data.like_count } : m))
      );
    }
  };

  const scrollToForm = () => {
    document
      .getElementById("guestbook-form")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <main className="container mx-auto max-w-7xl px-4 pb-20 pt-24 sm:px-6 lg:px-8 lg:pt-28">
      {/* 页头 */}
      <motion.header
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 text-center"
      >
        <h1 className="font-song text-4xl font-bold tracking-wide text-ink-black dark:text-rice-white lg:text-5xl">
          留言墙
        </h1>
        <p className="mt-3 text-sm text-ink-gray dark:text-rice-white-dim lg:text-base">
          留下你的足迹，每一张便签都是一份温暖。
        </p>
      </motion.header>

      {/* 未配置 Supabase 的引导提示 */}
      {!isSupabaseConfigured && (
        <div className="glass-card mx-auto mb-10 max-w-xl p-5 text-sm leading-relaxed text-ink-gray dark:text-rice-white-dim">
          <p className="font-medium text-ink-black dark:text-rice-white">
            留言墙尚未连接数据库
          </p>
          <p className="mt-2">
            请在 <code className="rounded bg-ink-black/5 px-1 dark:bg-rice-white/10">.env.local</code> 中配置
            <code className="rounded bg-ink-black/5 px-1 dark:bg-rice-white/10"> NEXT_PUBLIC_SUPABASE_URL </code>
            和
            <code className="rounded bg-ink-black/5 px-1 dark:bg-rice-white/10"> NEXT_PUBLIC_SUPABASE_ANON_KEY </code>
            后重新构建。
          </p>
        </div>
      )}

      {/* 双栏布局：桌面端 左表单(sticky) + 右便签墙；移动端 便签墙在前、表单在后 */}
      <div className="flex flex-col lg:grid lg:grid-cols-[480px_1fr] lg:items-start lg:gap-8">
        {/* 便签墙栏（移动端 order-1 优先展示，桌面端位于右侧） */}
        <section aria-label="留言列表" className="order-1 min-w-0 lg:order-2">
          {/* 搜索栏 */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="glass-card mb-6 flex items-center gap-3 px-4 py-3"
          >
            <FiSearch className="h-4 w-4 shrink-0 text-ink-gray dark:text-rice-white-dim" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="搜索留言或昵称..."
              className="w-full bg-transparent text-sm text-ink-black outline-none placeholder:text-ink-gray/50 dark:text-rice-white dark:placeholder:text-rice-white-dim/50"
            />
          </motion.div>

          {/* 移动端写留言入口：一键滚动到底部表单 */}
          <button
            type="button"
            onClick={scrollToForm}
            className="mb-6 flex w-full items-center justify-center gap-2 rounded-xl border border-ink-black/15 py-2.5 text-sm font-medium text-ink-black transition-colors hover:bg-ink-black/5 lg:hidden dark:border-rice-white/20 dark:text-rice-white dark:hover:bg-rice-white/10"
          >
            <FiEdit3 className="h-4 w-4" />
            写留言
          </button>

          {loading ? (
            <p className="py-16 text-center text-sm text-ink-gray dark:text-rice-white-dim">
              便签搬运中...
            </p>
          ) : loadError ? (
            <div className="py-16 text-center">
              <p className="text-sm text-accent-dark dark:text-accent-light">
                {loadError}
              </p>
              <button
                type="button"
                onClick={() => loadMessages(0)}
                className="mx-auto mt-4 flex items-center gap-2 rounded-xl border border-ink-black/15 px-5 py-2 text-sm text-ink-black transition-colors hover:bg-ink-black/5 dark:border-rice-white/20 dark:text-rice-white dark:hover:bg-rice-white/10"
              >
                <FiRefreshCw className="h-4 w-4" />
                重试
              </button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-16 text-center">
              <p className="font-song text-lg text-ink-gray dark:text-rice-white-dim">
                {query ? "没有找到匹配的便签" : "这里还没有留言"}
              </p>
              <p className="mt-2 text-sm text-ink-gray/70 dark:text-rice-white-dim/70">
                {query ? "换个关键词试试" : "来写下第一张便签吧"}
              </p>
            </div>
          ) : (
            <>
              <div className="columns-1 gap-5 pt-3 sm:columns-2 xl:columns-3">
                {filtered.map((m, i) => (
                  <StickyNote
                    key={m.id}
                    message={m}
                    index={i}
                    liked={likedIds.includes(m.id)}
                    onToggleLike={handleToggleLike}
                  />
                ))}
              </div>

              {/* 分页：加载更多（搜索态下隐藏） */}
              {hasMore && !query.trim() && (
                <div className="mt-2 text-center">
                  <button
                    type="button"
                    onClick={() => loadMessages(loadedCountRef.current)}
                    disabled={loadingMore}
                    className="rounded-xl border border-ink-black/15 px-6 py-2.5 text-sm text-ink-black transition-colors hover:bg-ink-black/5 disabled:cursor-not-allowed disabled:opacity-50 dark:border-rice-white/20 dark:text-rice-white dark:hover:bg-rice-white/10"
                  >
                    {loadingMore ? "加载中..." : "加载更多便签"}
                  </button>
                </div>
              )}
            </>
          )}
        </section>

        {/* 表单栏（移动端 order-2 沉底，桌面端位于左侧并 sticky 吸附） */}
        <motion.section
          id="guestbook-form"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="glass-card order-2 mt-10 scroll-mt-28 p-8 lg:order-1 lg:sticky lg:top-24 lg:mt-0"
        >
          <h2 className="flex items-center gap-2 font-song text-lg font-bold text-ink-black dark:text-rice-white">
            <FiEdit3 className="h-4 w-4" />
            留下一句话
          </h2>
          <p className="mb-4 mt-1 text-xs text-ink-gray/70 dark:text-rice-white-dim/70">
            <span className="hidden lg:inline">你的便签会贴在右边的墙上 →</span>
            <span className="lg:hidden">你的便签会贴在上方的墙上 ↑</span>
          </p>
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* 蜜罐：视觉隐藏 + 移出 Tab 序列，机器人会填，真人不会 */}
            <input
              type="text"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              placeholder="请勿填写此项"
              className="pointer-events-none absolute -left-[9999px] h-0 w-0 opacity-0"
            />
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              maxLength={20}
              placeholder="称呼（可选）"
              className="w-full rounded-xl border border-warm-gray-light bg-paper-bg-light/60 px-4 py-2.5 text-sm text-ink-black outline-none transition-colors placeholder:text-ink-gray/50 focus:border-accent dark:border-rice-white/10 dark:bg-ink-deep-light/60 dark:text-rice-white dark:placeholder:text-rice-white-dim/50"
            />
            <div>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={6}
                maxLength={MAX_LENGTH}
                placeholder="想说的话..."
                className="w-full resize-none rounded-xl border border-warm-gray-light bg-paper-bg-light/60 px-4 py-2.5 text-sm leading-relaxed text-ink-black outline-none transition-colors placeholder:text-ink-gray/50 focus:border-accent dark:border-rice-white/10 dark:bg-ink-deep-light/60 dark:text-rice-white dark:placeholder:text-rice-white-dim/50"
              />
              <div className="mt-1 text-right text-xs text-ink-gray/60 dark:text-rice-white-dim/60">
                {content.length}/{MAX_LENGTH}
              </div>
            </div>

            {/* 便签颜色选择 */}
            <div className="flex flex-wrap items-center gap-x-3 gap-y-2.5">
              <span className="text-xs text-ink-gray dark:text-rice-white-dim">
                便签颜色
              </span>
              {COLOR_KEYS.map((key) => (
                <button
                  key={key}
                  type="button"
                  aria-label={NOTE_COLORS[key].label}
                  title={NOTE_COLORS[key].label}
                  onClick={() => setColor(key)}
                  className={`h-7 w-7 rounded-full ${NOTE_COLORS[key].dot} transition-transform ${
                    color === key
                      ? "scale-110 ring-2 ring-ink-black/40 ring-offset-2 ring-offset-paper-bg dark:ring-rice-white/50 dark:ring-offset-ink-deep"
                      : "opacity-60 hover:scale-105 hover:opacity-100"
                  }`}
                />
              ))}
            </div>

            {submitError && (
              <p className="text-xs text-accent-dark dark:text-accent-light">
                {submitError}
              </p>
            )}
            {submitOk && (
              <p className="text-xs text-green-700 dark:text-green-400">
                已贴上留言墙，感谢你的足迹 ✦
              </p>
            )}

            <button
              type="submit"
              disabled={submitting || !isSupabaseConfigured}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-ink-black py-2.5 text-sm font-medium text-rice-white transition-all hover:opacity-85 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-rice-white dark:text-ink-black"
            >
              <FiSend className="h-4 w-4" />
              {submitting ? "张贴中..." : "贴上便签"}
            </button>
          </form>
        </motion.section>
      </div>
    </main>
  );
}
