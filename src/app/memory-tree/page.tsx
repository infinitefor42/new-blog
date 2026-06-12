"use client";

import dynamic from "next/dynamic";

const MemoryTree = dynamic(() => import("@/components/blog/MemoryTree"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "black",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
    >
      <span
        style={{
          color: "#ff1493",
          fontFamily: "monospace",
          letterSpacing: "0.4em",
        }}
      >
        正在唤醒记忆星海...
      </span>
    </div>
  ),
});

export default function MemoryTreePage() {
  return <MemoryTree />;
}
