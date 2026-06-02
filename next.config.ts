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

  // PWA headers
  async headers() {
    return [
      {
        source: "/sw.js",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=0, must-revalidate",
          },
          {
            key: "Service-Worker-Allowed",
            value: "/",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
