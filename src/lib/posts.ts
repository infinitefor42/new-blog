import fs from "fs";
import path from "path";
import matter from "gray-matter";

const postsDirectory = path.join(process.cwd(), "src", "posts");

/** 文章预览元数据（不含正文，用于列表/卡片展示） */
export interface PostPreview {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  categories: string[];
  excerpt: string;
  readingTime: number;
}

/** 完整文章元数据（含正文，用于文章详情页） */
export interface PostMeta extends PostPreview {
  content: string;
}

/** 估算阅读时间（中文按 400 字/分钟） */
function estimateReadingTime(text: string): number {
  const cleanText = text.replace(/[#*`\[\]()!>-]/g, "").replace(/\s+/g, "");
  const charCount = cleanText.length;
  return Math.max(1, Math.ceil(charCount / 400));
}

/** 生成摘要（取前 120 个字符） */
function generateExcerpt(content: string): string {
  const clean = content
    .replace(/^#{1,6}\s+.*/gm, "")
    .replace(/```[\s\S]*?```/g, "")
    .replace(/\$\$[\s\S]*?\$\$/g, "")
    .replace(/\$.*?\$/g, "")
    .replace(/[*`_\[\]()!>-]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return clean.length > 120 ? clean.slice(0, 120) + "..." : clean;
}

/** 把 frontmatter 的 date 解析为时间戳（含时分秒；无效值回退为 0） */
function toTimestamp(value: unknown): number {
  const t = value ? new Date(String(value)).getTime() : NaN;
  return Number.isNaN(t) ? 0 : t;
}

/** 获取所有文章的预览元数据（按时间降序，不含正文） */
export function getAllPosts(): PostPreview[] {
  if (!fs.existsSync(postsDirectory)) return [];

  const fileNames = fs
    .readdirSync(postsDirectory)
    .filter((f) => f.endsWith(".md") || f.endsWith(".mdx"));

  const entries = fileNames.map((fileName) => {
    const slug = fileName.replace(/\.mdx?$/, "");
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, "utf8");
    const { data, content } = matter(fileContents);

    const tags = Array.isArray(data.tags)
      ? data.tags
      : data.tags
        ? [data.tags]
        : [];
    const categories = Array.isArray(data.categories)
      ? data.categories
      : data.categories
        ? [data.categories]
        : [];

    return {
      post: {
        slug,
        title: data.title || slug,
        date: data.date
          ? new Date(data.date).toISOString().split("T")[0]
          : "1970-01-01",
        tags,
        categories,
        excerpt: generateExcerpt(content),
        readingTime: estimateReadingTime(content),
      } satisfies PostPreview,
      // 用完整时间戳排序：同一天的文章也有确定的先后
      timestamp: toTimestamp(data.date),
    };
  });

  return entries
    .sort((a, b) => b.timestamp - a.timestamp)
    .map((entry) => entry.post);
}

/**
 * 把独占一行的 `$$...$$` 展开成 remark-math 能识别的块级公式。
 *
 * remark-math 的块级公式要求 `$$` 与公式内容分行书写（`$$\n公式\n$$`），
 * 写成单行 `$$公式$$` 时只会被当成行内公式，不会居中、也拿不到公式箱样式。
 * 围栏代码块（``` 包裹）内的内容原样保留。
 */
function normalizeDisplayMath(markdown: string): string {
  return markdown
    .split(/(```[\s\S]*?```)/g)
    .map((chunk, index) =>
      index % 2 === 1
        ? chunk
        : chunk.replace(
            /^([ \t]*(?:>[ \t]*)*)\$\$(.+?)\$\$[ \t]*$/gm,
            (_, prefix: string, body: string) =>
              `${prefix}$$\n${prefix}${body.trim()}\n${prefix}$$`
          )
    )
    .join("");
}

/** 根据 slug 获取单篇文章 */
export function getPostBySlug(slug: string): PostMeta | null {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  const mdxPath = path.join(postsDirectory, `${slug}.mdx`);

  let filePath: string;
  if (fs.existsSync(fullPath)) {
    filePath = fullPath;
  } else if (fs.existsSync(mdxPath)) {
    filePath = mdxPath;
  } else {
    return null;
  }

  const fileContents = fs.readFileSync(filePath, "utf8");
  const { data, content } = matter(fileContents);

  const tags = Array.isArray(data.tags)
    ? data.tags
    : data.tags
      ? [data.tags]
      : [];
  const categories = Array.isArray(data.categories)
    ? data.categories
    : data.categories
      ? [data.categories]
      : [];

  return {
    slug,
    title: data.title || slug,
    date: data.date
      ? new Date(data.date).toISOString().split("T")[0]
      : "1970-01-01",
    tags,
    categories,
    excerpt: generateExcerpt(content),
    readingTime: estimateReadingTime(content),
    content: normalizeDisplayMath(content),
  };
}

/** 获取所有不重复的分类 */
export function getAllCategories(): string[] {
  const posts = getAllPosts();
  const cats = new Set(posts.flatMap((p) => p.categories));
  
  // 预设的核心分类顺序
  const orderedList = ["算法", "数学", "项目", "笔记"];
  
  // 将所有实际存在的分类合并，并确保 "笔记" 即使还没有文章也一直存在于列表中
  const allCats = new Set([...orderedList, ...Array.from(cats)]);
  
  // 过滤并按 preset 顺序排序，其余多余分类排在最后
  return Array.from(allCats).sort((a, b) => {
    const indexA = orderedList.indexOf(a);
    const indexB = orderedList.indexOf(b);
    if (indexA !== -1 && indexB !== -1) return indexA - indexB;
    if (indexA !== -1) return -1;
    if (indexB !== -1) return 1;
    return a.localeCompare(b);
  });
}

/** 获取所有不重复的标签 */
export function getAllTags(): string[] {
  const posts = getAllPosts();
  const tagSet = new Set(posts.flatMap((p) => p.tags));
  return Array.from(tagSet);
}

/** 获取所有文章的 slug（用于 generateStaticParams） */
export function getAllSlugs(): string[] {
  if (!fs.existsSync(postsDirectory)) return [];
  return fs
    .readdirSync(postsDirectory)
    .filter((f) => f.endsWith(".md") || f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx?$/, ""));
}

/** 统计每个分类下的文章数（缺失分类兜底为 0） */
export function getCategoryCounts(): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const cat of getAllCategories()) counts[cat] = 0;
  for (const post of getAllPosts()) {
    for (const cat of post.categories) {
      counts[cat] = (counts[cat] ?? 0) + 1;
    }
  }
  return counts;
}

/** 统计每个标签下的文章数 */
export function getTagCounts(): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const tag of getAllTags()) counts[tag] = 0;
  for (const post of getAllPosts()) {
    for (const tag of post.tags) {
      counts[tag] = (counts[tag] ?? 0) + 1;
    }
  }
  return counts;
}

/** 按文章数降序（同数按名称）排列标签，避免 Set 插入顺序带来的随机感 */
export function getAllTagsByCount(): string[] {
  const counts = getTagCounts();
  return getAllTags().sort(
    (a, b) => (counts[b] ?? 0) - (counts[a] ?? 0) || a.localeCompare(b)
  );
}

/** 获取某个分类下的所有文章 */
export function getPostsByCategory(category: string): PostPreview[] {
  return getAllPosts().filter((post) => post.categories.includes(category));
}

/** 获取某个标签下的所有文章 */
export function getPostsByTag(tag: string): PostPreview[] {
  return getAllPosts().filter((post) => post.tags.includes(tag));
}

/** 把 Markdown 正文转为可搜索的纯文本（丢弃代码块、公式、图片等噪音） */
export function toPlainText(content: string): string {
  return content
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/\$\$[\s\S]*?\$\$/g, " ")
    .replace(/\$.*?\$/g, " ")
    .replace(/!\[.*?\]\(.*?\)/g, " ")
    .replace(/\[(.*?)\]\(.*?\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/[*`_>~-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/** 全文搜索索引条目 */
export interface PostSearchDoc {
  slug: string;
  title: string;
  date: string;
  categories: string[];
  tags: string[];
  excerpt: string;
  text: string;
}

/** 构建全文搜索索引（含正文纯文本），用于独立搜索页 */
export function getSearchIndex(): PostSearchDoc[] {
  if (!fs.existsSync(postsDirectory)) return [];

  const asArray = (value: unknown): string[] =>
    Array.isArray(value) ? (value as string[]) : value ? [String(value)] : [];

  return fs
    .readdirSync(postsDirectory)
    .filter((f) => f.endsWith(".md") || f.endsWith(".mdx"))
    .map((fileName) => {
      const slug = fileName.replace(/\.mdx?$/, "");
      const fileContents = fs.readFileSync(
        path.join(postsDirectory, fileName),
        "utf8"
      );
      const { data, content } = matter(fileContents);
      return {
        doc: {
          slug,
          title: data.title || slug,
          date: data.date
            ? new Date(data.date).toISOString().split("T")[0]
            : "1970-01-01",
          categories: asArray(data.categories),
          tags: asArray(data.tags),
          excerpt: generateExcerpt(content),
          text: toPlainText(content),
        } satisfies PostSearchDoc,
        timestamp: toTimestamp(data.date),
      };
    })
    .sort((a, b) => b.timestamp - a.timestamp)
    .map((entry) => entry.doc);
}

/** URL 中不安全的字符：会导致静态导出后静默 404 */
const URL_UNSAFE = /[/#?%\\]/;

/**
 * 构建期断言：分类/标签名若含 URL 保留字符会导致静态导出后 404。
 * 在动态路由的 generateStaticParams() 中调用，让问题在构建时暴露。
 */
export function assertUrlSafeParams(): void {
  for (const name of [...getAllCategories(), ...getAllTags()]) {
    if (URL_UNSAFE.test(name)) {
      throw new Error(
        `[blog] 分类/标签名含 URL 不安全字符，会导致静态导出后 404: ${JSON.stringify(name)}`
      );
    }
  }
}
