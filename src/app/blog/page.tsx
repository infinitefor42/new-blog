import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { BlogListClient } from "@/components/blog/blog-list-client";
import { getAllPosts, getAllCategories, getAllTags } from "@/lib/posts";

export default function BlogPage() {
  const posts = getAllPosts();
  const categories = getAllCategories();
  const tags = getAllTags();

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-20 lg:pt-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* 页面标题 */}
          <div className="text-center mb-12">
            <h1 className="font-song text-4xl sm:text-5xl font-bold text-ink-black dark:text-rice-white mb-4">
              最新文章
            </h1>
            <p className="text-lg text-ink-gray/60 dark:text-rice-white-dim/60">
              分享我的思考与发现
            </p>
            <div className="w-16 h-0.5 bg-warm-gray dark:bg-warm-gray-dark mx-auto rounded-full mt-6" />
          </div>

          {/* 客户端交互区域 */}
          <BlogListClient
            posts={posts}
            categories={categories}
            tags={tags}
          />
        </div>
      </main>
      <Footer />
    </>
  );
}
