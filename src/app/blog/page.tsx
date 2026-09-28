import Link from "next/link";
import {
  FiFolder,
  FiTag,
  FiArchive,
  FiSearch,
  FiArrowRight,
} from "react-icons/fi";
import { PageHeader } from "@/components/blog/page-header";
import { PostGrid } from "@/components/blog/post-grid";
import { getAllPosts } from "@/lib/posts";

const entries = [
  { label: "分类", href: "/blog/categories", icon: FiFolder },
  { label: "标签", href: "/blog/tags", icon: FiTag },
  { label: "归档", href: "/blog/archive", icon: FiArchive },
  { label: "搜索", href: "/blog/search", icon: FiSearch },
];

export default function BlogPage() {
  const allPosts = getAllPosts();
  const posts = allPosts.slice(0, 3);

  return (
    <>
      <PageHeader title="最新文章" subtitle="分享我的思考与发现" />

      {/* 浏览入口：让读者一眼知道还能按分类/标签/归档/搜索逛 */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
        {entries.map((entry) => (
          <Link
            key={entry.href}
            href={entry.href}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl
              border border-warm-gray/40 dark:border-warm-gray-dark/40
              text-ink-black dark:text-rice-white text-sm font-medium
              transition-all duration-300
              hover:bg-ink-black/5 dark:hover:bg-rice-white/5
              hover:border-warm-gray/60 dark:hover:border-warm-gray-dark/60
              active:scale-[0.97]"
          >
            <entry.icon className="w-4 h-4" />
            {entry.label}
          </Link>
        ))}
      </div>

      <p className="text-sm text-ink-gray/50 dark:text-rice-white-dim/50 mb-8">
        共 {allPosts.length} 篇文章
      </p>

      <PostGrid posts={posts} />

      {/* 引导到全部文章：这里只展示最新 3 篇 */}
      <div className="text-center mt-12">
        <Link
          href="/blog/archive"
          className="group inline-flex items-center gap-2 px-8 py-4 rounded-2xl
            border border-warm-gray/40 dark:border-warm-gray-dark/40
            text-ink-black dark:text-rice-white font-medium
            transition-all duration-500
            hover:bg-ink-black/5 dark:hover:bg-rice-white/5
            hover:border-warm-gray/60 dark:hover:border-warm-gray-dark/60
            hover:shadow-lg hover:shadow-ink-black/5 dark:hover:shadow-rice-white/5
            active:scale-[0.98]"
        >
          浏览全部文章
          <FiArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
        </Link>
      </div>
    </>
  );
}
