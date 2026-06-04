import fs from "fs";
import path from "path";
import matter from "gray-matter";

const postsDirectory = path.join(process.cwd(), "src", "posts");

export interface PostMeta {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  categories: string[];
  excerpt: string;
  readingTime: number;
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
    .replace(/\$.*?\$/g, "")
    .replace(/[*`_\[\]()!>-]/g, "")
    .replace(/\s+/g, " ")
    .trim();
  return clean.length > 120 ? clean.slice(0, 120) + "..." : clean;
}

/** 获取所有文章的元数据（按日期降序） */
export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(postsDirectory)) return [];

  const fileNames = fs
    .readdirSync(postsDirectory)
    .filter((f) => f.endsWith(".md") || f.endsWith(".mdx"));

  const posts = fileNames.map((fileName) => {
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
      slug,
      title: data.title || slug,
      date: data.date
        ? new Date(data.date).toISOString().split("T")[0]
        : "1970-01-01",
      tags,
      categories,
      excerpt: generateExcerpt(content),
      readingTime: estimateReadingTime(content),
      content,
    };
  });

  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
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
    content,
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
