"use client";

import dynamic from "next/dynamic";
import type { PostPreview } from "@/lib/posts";

// 懒加载非首屏组件（三个区块合并为一个 chunk）
const LandingSections = dynamic(
  () =>
    import("@/components/landing/landing-sections").then((mod) => ({
      default: mod.LandingSections,
    })),
  {
    loading: () => <div className="py-24 lg:py-32" />,
    ssr: false,
  }
);

interface LazySectionsProps {
  posts: PostPreview[];
}

export function LazySections({ posts }: LazySectionsProps) {
  return <LandingSections posts={posts} />;
}
