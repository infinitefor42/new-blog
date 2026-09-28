import Link from "next/link";
import { FiTag } from "react-icons/fi";
import { PageHeader } from "@/components/blog/page-header";
import { getAllTagsByCount, getTagCounts } from "@/lib/posts";

export const metadata = { title: "标签" };

export default function TagsPage() {
  const tags = getAllTagsByCount();
  const counts = getTagCounts();

  return (
    <>
      <PageHeader title="标签" subtitle="按关键词浏览所有文章" />

      <div className="max-w-2xl mx-auto grid gap-4">
        {tags.map((tag) => (
          <Link
            key={tag}
            href={`/blog/tags/${tag}`}
            className="glass-card flex items-center justify-between p-5 sm:p-6
              transition-all duration-300 hover:shadow-lg"
          >
            <span className="flex items-center gap-3 font-song text-lg font-semibold text-ink-black dark:text-rice-white">
              <FiTag className="w-4 h-4 text-ink-gray/60 dark:text-rice-white-dim/60" />
              {tag}
            </span>
            <span className="text-sm text-ink-gray/50 dark:text-rice-white-dim/50">
              {counts[tag] ?? 0} 篇
            </span>
          </Link>
        ))}
      </div>
    </>
  );
}
