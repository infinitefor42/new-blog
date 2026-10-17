import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 静态导出（GitHub Pages 必需）
  output: "export",

  // 显式暴露环境变量到客户端（兼容 Turbopack）
  env: {
    NEXT_PUBLIC_GISCUS_REPO: process.env.NEXT_PUBLIC_GISCUS_REPO || "",
    NEXT_PUBLIC_GISCUS_REPO_ID: process.env.NEXT_PUBLIC_GISCUS_REPO_ID || "",
    NEXT_PUBLIC_GISCUS_CATEGORY: process.env.NEXT_PUBLIC_GISCUS_CATEGORY || "",
    NEXT_PUBLIC_GISCUS_CATEGORY_ID: process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID || "",
    NEXT_PUBLIC_GISCUS_MAPPING: process.env.NEXT_PUBLIC_GISCUS_MAPPING || "pathname",
  },

  // GitHub Pages 不支持 Next.js 图片优化，需关闭
  images: {
    unoptimized: true,
  },

  // React 严格模式
  reactStrictMode: true,

  // 注意：静态导出（output: "export"）模式下 Next.js 会静默忽略 async headers()，
  // sw.js 的缓存控制依赖 public/sw.js 中手动递增的缓存版本号实现更新。
};

export default nextConfig;
