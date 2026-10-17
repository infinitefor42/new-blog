import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "记忆树",
  description:
    "INFINITE 记忆树 —— 沉浸式 3D 记忆星海，在粒子宇宙中以相片与音乐收藏生活的闪光时刻。",
  openGraph: {
    title: "记忆树 | INFINITE",
    description:
      "沉浸式 3D 记忆星海，在粒子宇宙中以相片与音乐收藏生活的闪光时刻。",
  },
};

export default function MemoryTreeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
