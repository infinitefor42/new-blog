"use client";

import dynamic from "next/dynamic";
import type { PostPreview } from "@/lib/posts";

// 懒加载非首屏组件
const SkillsSection = dynamic(() => import("@/components/landing/skills-section").then(mod => ({ default: mod.SkillsSection })), {
  loading: () => <div className="py-24 lg:py-32" />,
  ssr: false,
});

const ProjectsSection = dynamic(() => import("@/components/landing/projects-section").then(mod => ({ default: mod.ProjectsSection })), {
  loading: () => <div className="py-24 lg:py-32" />,
  ssr: false,
});

const BlogPreview = dynamic(() => import("@/components/landing/blog-preview").then(mod => ({ default: mod.BlogPreview })), {
  loading: () => <div className="py-24 lg:py-32" />,
  ssr: false,
});

interface LazySectionsProps {
  posts: PostPreview[];
}

export function LazySections({ posts }: LazySectionsProps) {
  return (
    <>
      <SkillsSection />
      <ProjectsSection />
      <BlogPreview posts={posts} />
    </>
  );
}
