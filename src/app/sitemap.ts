import { getAllPosts, getAllCategories, getAllTags } from "@/lib/posts";
import type { MetadataRoute } from "next";

const BASE_URL = "https://caobowen.top";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();
  const categories = getAllCategories();
  const tags = getAllTags();

  const postEntries = posts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: post.date,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  const categoryEntries = categories.map((cat) => ({
    url: `${BASE_URL}/blog/categories/${encodeURIComponent(cat)}`,
    lastModified: new Date().toISOString().split("T")[0],
    changeFrequency: "weekly" as const,
    priority: 0.6,
  }));

  const tagEntries = tags.map((tag) => ({
    url: `${BASE_URL}/blog/tags/${encodeURIComponent(tag)}`,
    lastModified: new Date().toISOString().split("T")[0],
    changeFrequency: "weekly" as const,
    priority: 0.5,
  }));

  return [
    {
      url: BASE_URL,
      lastModified: new Date().toISOString().split("T")[0],
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date().toISOString().split("T")[0],
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/blog/archive`,
      lastModified: new Date().toISOString().split("T")[0],
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/blog/search`,
      lastModified: new Date().toISOString().split("T")[0],
      changeFrequency: "monthly",
      priority: 0.7,
    },
    ...postEntries,
    ...categoryEntries,
    ...tagEntries,
  ];
}
