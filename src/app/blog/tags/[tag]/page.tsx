import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import { PageHeader } from "@/components/blog/page-header";
import { PostGrid } from "@/components/blog/post-grid";
import { getAllTags, getPostsByTag, assertUrlSafeParams } from "@/lib/posts";

export function generateStaticParams() {
  assertUrlSafeParams();
  return getAllTags().map((tag) => ({ tag }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;
  return { title: `标签：${decodeURIComponent(tag)}` };
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;
  // 静态导出下 params 为 URL 编码值，需解码后匹配（名称中的 % 已在构建期被 assertUrlSafeParams 拦截）
  const tagName = decodeURIComponent(tag);
  const posts = getPostsByTag(tagName);

  return (
    <>
      <div className="max-w-3xl mx-auto mb-6">
        <Link
          href="/blog/tags"
          className="inline-flex items-center gap-2 text-ink-gray dark:text-rice-white-dim
            hover:text-ink-black dark:hover:text-rice-white transition-colors text-sm"
        >
          <FiArrowLeft className="w-4 h-4" />
          返回标签
        </Link>
      </div>

      <PageHeader title={tagName} subtitle={`${posts.length} 篇文章`} />

      <PostGrid posts={posts} emptyText="该标签下暂无文章" />
    </>
  );
}
