"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

function MemoryTreeLoading() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const startTime = performance.now();
    const interval = setInterval(() => {
      const elapsed = (performance.now() - startTime) / 1000;
      const t = Math.min(elapsed / 8.0, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      const simulated = eased * 90;
      setProgress(simulated);
      if (t >= 1) clearInterval(interval);
    }, 30);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="mt-loading-screen">
      <div className="mt-loading-content">
        <div className="mt-loading-text">正在唤醒记忆星海...</div>
        <div className="mt-progress-container">
          <div
            className="mt-progress-fill"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}

const MemoryTree = dynamic(() => import("@/components/blog/MemoryTree"), {
  ssr: false,
  loading: () => <MemoryTreeLoading />,
});

export default function MemoryTreePage() {
  return <MemoryTree />;
}
