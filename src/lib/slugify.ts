/** 将标题文本转换为 DOM-safe 的 slug ID（与 TOC 提取共用） */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\u4e00-\u9fff-]/g, "");
}
