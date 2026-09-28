import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import { PageHeader } from "@/components/blog/page-header";
import { PostGrid } from "@/components/blog/post-grid";
import {
  getAllCategories,
  getPostsByCategory,
  assertUrlSafeParams,
} from "@/lib/posts";

export function generateStaticParams() {
  assertUrlSafeParams();
  return getAllCategories().map((cat) => ({ cat }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ cat: string }>;
}) {
  const { cat } = await params;
  return { title: `分类：${decodeURIComponent(cat)}` };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ cat: string }>;
}) {
  const { cat } = await params;
  // 静态导出下 params 为 URL 编码值，需解码后匹配（名称中的 % 已在构建期被 assertUrlSafeParams 拦截）
  const category = decodeURIComponent(cat);
  const posts = getPostsByCategory(category);

  return (
    <>
      <div className="max-w-3xl mx-auto mb-6">
        <Link
          href="/blog/categories"
          className="inline-flex items-center gap-2 text-ink-gray dark:text-rice-white-dim
            hover:text-ink-black dark:hover:text-rice-white transition-colors text-sm"
        >
          <FiArrowLeft className="w-4 h-4" />
          返回分类
        </Link>
      </div>

      <PageHeader title={category} subtitle={`${posts.length} 篇文章`} />

      <PostGrid posts={posts} emptyText="该分类下暂无文章" />
    </>
  );
}
