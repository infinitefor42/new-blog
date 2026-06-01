import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 静态导出（GitHub Pages 必需）
  output: "export",

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
