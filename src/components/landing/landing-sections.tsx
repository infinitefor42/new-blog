"use client";

import { SkillsSection } from "./skills-section";
import { ProjectsSection } from "./projects-section";
import { BlogPreview } from "./blog-preview";
import type { PostPreview } from "@/lib/posts";

// 首页三个非首屏区块聚合到同一个 chunk，避免拆成多个小文件造成请求碎片化
export function LandingSections({ posts }: { posts: PostPreview[] }) {
  return (
    <>
      <SkillsSection />
      <ProjectsSection />
      <BlogPreview posts={posts} />
    </>
  );
}
