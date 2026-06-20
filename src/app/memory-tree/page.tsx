"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

function MemoryTreeLoading() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const startTime = performance.now();
    const interval = setInterval(() => {
      const elapsed = (performance.now() - startTime) / 1000;
      const t = Math.min(elapsed / 8.0, 1); // 8 seconds to reach 90%
      const eased = 1 - Math.pow(1 - t, 3);
      const simulated = eased * 90;
      setProgress(simulated);
      if (typeof window !== "undefined") {
        (window as any).__memoryTreeProgress = simulated;
      }
      if (t >= 1) clearInterval(interval);
    }, 30);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10000,
        backgroundColor: "black",
        background: "radial-gradient(ellipse at center, #0a0a1a 0%, #000000 70%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        fontFamily: "monospace",
      }}
    >
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 1; }
        }
        @keyframes shimmer {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .loading-text {
          color: #ff1493;
          letter-spacing: 0.4em;
          font-size: 14px;
          animation: pulse 2s infinite ease-in-out;
          text-align: center;
          margin-bottom: 2rem;
        }
        @media (max-width: 768px) {
          .loading-text {
            font-size: 12px;
            letter-spacing: 0.3em;
          }
        }
        .progress-bar-container {
          width: 240px;
          height: 2px;
          background: rgba(255, 20, 147, 0.15);
          border-radius: 1px;
          overflow: hidden;
          position: relative;
        }
        @media (max-width: 768px) {
          .progress-bar-container {
            width: 180px;
          }
        }
        .progress-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #ff1493, #00ffff, #ff1493);
          background-size: 200% 200%;
          border-radius: 1px;
          animation: shimmer 2s infinite linear;
          position: absolute;
          left: 0;
          top: 0;
        }
      `}</style>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div className="loading-text">正在唤醒记忆星海...</div>
        <div className="progress-bar-container">
          <div
            className="progress-bar-fill"
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

