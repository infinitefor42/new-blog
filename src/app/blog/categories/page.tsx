import Link from "next/link";
import { FiFolder } from "react-icons/fi";
import { PageHeader } from "@/components/blog/page-header";
import { getAllCategories, getCategoryCounts } from "@/lib/posts";

export const metadata = { title: "分类" };

export default function CategoriesPage() {
  const categories = getAllCategories();
  const counts = getCategoryCounts();

  return (
    <>
      <PageHeader title="分类" subtitle="按主题浏览所有文章" />

      <div className="max-w-2xl mx-auto grid gap-4">
        {categories.map((cat) => (
          <Link
            key={cat}
            href={`/blog/categories/${cat}`}
            className="glass-card flex items-center justify-between p-5 sm:p-6
              transition-all duration-300 hover:shadow-lg"
          >
            <span className="flex items-center gap-3 font-song text-lg font-semibold text-ink-black dark:text-rice-white">
              <FiFolder className="w-4 h-4 text-ink-gray/60 dark:text-rice-white-dim/60" />
              {cat}
            </span>
            <span className="text-sm text-ink-gray/50 dark:text-rice-white-dim/50">
              {counts[cat] ?? 0} 篇
            </span>
          </Link>
        ))}
      </div>
    </>
  );
}
