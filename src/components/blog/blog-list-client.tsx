"use client";

import { useState, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FilterPanel } from "./filter-panel";
import { BlogCard } from "./blog-card";
import type { PostPreview } from "@/lib/posts";

interface BlogListClientProps {
  posts: PostPreview[];
  categories: string[];
  tags: string[];
}

export function BlogListClient({ posts, categories, tags }: BlogListClientProps) {
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesCategory =
        !selectedCategory || post.categories.includes(selectedCategory);
      const matchesTag = !selectedTag || post.tags.includes(selectedTag);
      const matchesSearch =
        !searchQuery ||
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesTag && matchesSearch;
    });
  }, [posts, selectedCategory, selectedTag, searchQuery]);

  const hasFilters = selectedCategory || selectedTag || searchQuery;

  return (
    <>
      <FilterPanel
        categories={categories}
        tags={tags}
        selectedCategory={selectedCategory}
        selectedTag={selectedTag}
        searchQuery={searchQuery}
        onCategoryChange={(category) => {
          setSelectedCategory(category);
          setSelectedTag("");
        }}
        onTagChange={setSelectedTag}
        onSearchChange={setSearchQuery}
      />

      <div className="flex items-center justify-between mb-8">
        <motion.p layout className="text-sm text-ink-gray/50 dark:text-rice-white-dim/50">
          {filteredPosts.length} 篇文章
        </motion.p>
        {hasFilters && (
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            onClick={() => {
              setSelectedCategory("");
              setSelectedTag("");
              setSearchQuery("");
            }}
            className="text-sm text-warm-gray-dark dark:text-warm-gray
              hover:text-ink-black dark:hover:text-rice-white
              transition-colors duration-300 underline underline-offset-2"
          >
            清除筛选
          </motion.button>
        )}
      </div>

      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        <AnimatePresence mode="popLayout">
          {filteredPosts.map((post, index) => (
            <BlogCard key={post.slug} post={post} index={index} />
          ))}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {filteredPosts.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center py-20"
          >
            <p className="text-xl text-ink-gray/40 dark:text-rice-white-dim/40 font-song">
              未找到匹配的文章
            </p>
            <button
              onClick={() => {
                setSelectedCategory("");
                setSelectedTag("");
                setSearchQuery("");
              }}
              className="mt-4 text-sm text-warm-gray-dark dark:text-warm-gray
                hover:text-ink-black dark:hover:text-rice-white
                transition-colors duration-300 underline underline-offset-2"
            >
              清除筛选
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
