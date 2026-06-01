import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { getAllPosts } from "@/lib/posts";
import Link from "next/link";
import { FiCalendar, FiClock } from "react-icons/fi";

export default function ArchivePage() {
  const posts = getAllPosts();

  // 按年份分组
  const grouped = posts.reduce<Record<string, typeof posts>>((acc, post) => {
    const year = post.date.slice(0, 4);
    if (!acc[year]) acc[year] = [];
    acc[year].push(post);
    return acc;
  }, {});

  const years = Object.keys(grouped).sort((a, b) => Number(b) - Number(a));

  return (
    <>
      <Navbar />
      <main className="flex-1 pt-20 lg:pt-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* 页面标题 */}
          <div className="text-center mb-16">
            <h1 className="font-song text-4xl sm:text-5xl font-bold text-ink-black dark:text-rice-white mb-4">
              归档
            </h1>
            <p className="text-lg text-ink-gray/60 dark:text-rice-white-dim/60">
              按时间线浏览所有文章
            </p>
            <div className="w-16 h-0.5 bg-warm-gray dark:bg-warm-gray-dark mx-auto rounded-full mt-6" />
          </div>

          {/* 时间轴 */}
          <div className="max-w-2xl mx-auto">
            {years.map((year) => (
              <div key={year} className="mb-12">
                <h2 className="font-song text-2xl font-bold text-ink-black dark:text-rice-white mb-6 flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-ink-black dark:bg-rice-white" />
                  {year}
                </h2>

                <div className="border-l-2 border-warm-gray/30 dark:border-warm-gray-dark/30 ml-1.5 pl-8 space-y-6">
                  {grouped[year].map((post) => (
                    <Link
                      key={post.slug}
                      href={`/blog/${post.slug}`}
                      className="group block"
                    >
                      <div className="glass-card p-5 sm:p-6 transition-all duration-300 hover:shadow-lg">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-song text-lg font-semibold text-ink-black dark:text-rice-white mb-2 group-hover:text-ink-gray dark:group-hover:text-rice-white-dim transition-colors">
                              {post.title}
                            </h3>
                            <p className="text-sm text-ink-gray/60 dark:text-rice-white-dim/60 line-clamp-2 mb-3">
                              {post.excerpt}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-ink-gray/50 dark:text-rice-white-dim/50">
                              <span className="flex items-center gap-1">
                                <FiCalendar className="w-3.5 h-3.5" />
                                {new Date(post.date).toLocaleDateString("zh-CN", { month: "long", day: "numeric" })}
                              </span>
                              <span className="flex items-center gap-1">
                                <FiClock className="w-3.5 h-3.5" />
                                {post.readingTime} 分钟阅读
                              </span>
                              {post.tags.length > 0 && (
                                <span className="flex items-center gap-1">
                                  {post.tags.join(" / ")}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
