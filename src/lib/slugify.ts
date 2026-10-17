/** 将标题文本转换为 DOM-safe 的 slug ID（与 TOC 提取共用） */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w一-鿿-]/g, "");
}

/**
 * 创建带重名去重的标题 ID 生成器。
 * 同名标题依次得到 base、base-1、base-2…，与文档出现顺序一致，
 * 供正文渲染（blog-post）与目录提取（table-of-contents）双侧共用，
 * 保证锚点一一对应。
 */
export function createHeadingIdGenerator() {
  const seen = new Map<string, number>();
  return (text: string): string => {
    const base = slugify(text);
    const count = seen.get(base) ?? 0;
    seen.set(base, count + 1);
    return count === 0 ? base : `${base}-${count}`;
  };
}
