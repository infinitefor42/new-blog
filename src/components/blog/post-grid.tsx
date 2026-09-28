import { BlogCard } from "./blog-card";
import type { PostPreview } from "@/lib/posts";

interface PostGridProps {
  posts: PostPreview[];
  emptyText?: string;
}

/** 文章网格列表（服务端组件，供列表 / 分类 / 标签页复用） */
export function PostGrid({ posts, emptyText = "暂无文章" }: PostGridProps) {
  if (posts.length === 0) {
    return (
      <p className="text-center py-20 font-song text-xl text-ink-gray/40 dark:text-rice-white-dim/40">
        {emptyText}
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
      {posts.map((post, index) => (
        <BlogCard key={post.slug} post={post} index={index} />
      ))}
    </div>
  );
}
