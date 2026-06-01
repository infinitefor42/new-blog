import { Navbar } from "@/components/layout/navbar";
import { Hero } from "@/components/landing/hero";
import { SkillsSection } from "@/components/landing/skills-section";
import { ProjectsSection } from "@/components/landing/projects-section";
import { BlogPreview } from "@/components/landing/blog-preview";
import { Footer } from "@/components/layout/footer";
import { getAllPosts } from "@/lib/posts";

export default function HomePage() {
  const posts = getAllPosts();

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <SkillsSection />
        <ProjectsSection />
        <BlogPreview posts={posts} />
      </main>
      <Footer />
    </>
  );
}
