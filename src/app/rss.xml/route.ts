import { getAllPosts } from "@/lib/posts";

// 静态导出（output: export）下 route handler 必须显式声明
export const dynamic = "force-static";

// 与 src/app/sitemap.ts 保持一致
const BASE_URL = "https://caobowen.top";

/** XML 特殊字符转义（标题/摘要中可能含 &、<、>、引号） */
function escapeXml(s: string): string {
  return s.replace(
    /[<>&'"]/g,
    (c) =>
      ({
        "<": "&lt;",
        ">": "&gt;",
        "&": "&amp;",
        "'": "&apos;",
        '"': "&quot;",
      })[c]!
  );
}

export function GET() {
  const posts = getAllPosts(); // 已按时间降序

  const items = posts
    .map(
      (p) => `
    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${BASE_URL}/blog/${p.slug}</link>
      <guid isPermaLink="true">${BASE_URL}/blog/${p.slug}</guid>
      <pubDate>${new Date(p.date + "T00:00:00+08:00").toUTCString()}</pubDate>
      <description>${escapeXml(p.excerpt)}</description>
      ${p.categories.map((c) => `<category>${escapeXml(c)}</category>`).join("\n      ")}
    </item>`
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>INFINITE</title>
    <link>${BASE_URL}</link>
    <description>一个极简风格的个人博客</description>
    <language>zh-CN</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${BASE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
    ${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: { "content-type": "application/rss+xml; charset=utf-8" },
  });
}
