import Link from "next/link";

export default function NotFound() {
  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-paper-bg/80 dark:bg-ink-deep/80 backdrop-blur-xl">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <Link href="/" className="font-song text-xl font-bold text-ink-black dark:text-rice-white tracking-[0.15em]">
              INFINITE
            </Link>
          </div>
        </nav>
      </header>
      <main className="flex-1 flex items-center justify-center min-h-[60vh] pt-16">
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
      </main>
    </>
  );
}
