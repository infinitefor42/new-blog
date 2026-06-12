"use client";

import dynamic from "next/dynamic";

const MemoryTree = dynamic(() => import("@/components/blog/MemoryTree"), {
  ssr: false,
});

export default function MemoryTreePage() {
  return <MemoryTree />;
}
