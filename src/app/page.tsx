import { Navbar } from "@/components/layout/navbar";
import { Hero } from "@/components/landing/hero";
import { Footer } from "@/components/layout/footer";
import { getAllPosts } from "@/lib/posts";
import { LazySections } from "@/components/landing/lazy-sections";

export default function HomePage() {
  const posts = getAllPosts();

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <LazySections posts={posts} />
      </main>
      <Footer />
    </>
  );
}
