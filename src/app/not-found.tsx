import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex-1 flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <h1 className="font-song text-6xl font-bold mb-4 text-ink-black dark:text-rice-white">404</h1>
        <p className="text-xl text-ink-gray/60 dark:text-rice-white-dim/60 mb-8">
          页面未找到
        </p>
        <Link
          href="/"
          className="inline-block bg-ink-black dark:bg-rice-white text-paper-bg dark:text-ink-deep px-6 py-3 rounded-xl hover:opacity-90 transition-opacity"
        >
          返回首页
        </Link>
      </div>
    </div>
  );
}
