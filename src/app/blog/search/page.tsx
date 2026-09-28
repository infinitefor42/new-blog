import { PageHeader } from "@/components/blog/page-header";
import { SearchClient } from "@/components/blog/search-client";

export const metadata = { title: "搜索" };

export default function SearchPage() {
  return (
    <>
      <PageHeader title="搜索" subtitle="标题 · 摘要 · 正文全文检索" />
      <SearchClient />
    </>
  );
}
