import { getSearchIndex } from "@/lib/posts";

// 静态导出（output: export）下 route handler 必须显式声明
export const dynamic = "force-static";

export function GET() {
  return new Response(JSON.stringify(getSearchIndex()), {
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}
