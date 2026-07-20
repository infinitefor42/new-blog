"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { FiGithub, FiArrowUpRight, FiPlay } from "react-icons/fi";
import { appleEasing, createContainerVariants, createCardVariants } from "@/lib/animations";
import { siteConfig } from "@/config/site";
import { BorderGlow } from "@/components/common/border-glow";

const containerVariants = createContainerVariants(0.12);
const cardVariants = createCardVariants(0.7, 40);

export function ProjectsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-24 lg:py-32 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <div className="text-center mb-16">
            <motion.h2
              variants={cardVariants}
              className="font-song text-4xl sm:text-5xl lg:text-6xl font-bold text-ink-black dark:text-rice-white mb-3"
            >
              {siteConfig.projects.title}
            </motion.h2>
            <motion.p
              variants={cardVariants}
              className="text-lg text-ink-gray/50 dark:text-rice-white-dim/50"
            >
              {siteConfig.projects.subtitle}
            </motion.p>
            <motion.div
              variants={cardVariants}
              className="w-16 h-0.5 bg-warm-gray dark:bg-warm-gray-dark mx-auto rounded-full mt-6"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 max-w-3xl mx-auto">
            {siteConfig.projects.cards.map((project) => (
              <motion.article
                key={project.name}
                variants={cardVariants}
                whileHover={{ y: -12, transition: { duration: 0.5, ease: appleEasing } }}
              >
                <BorderGlow
                  className="glass-card overflow-hidden group cursor-pointer rounded-3xl"
                >
                {/* 图片区域 */}
                <div className="relative h-48 sm:h-56 bg-gradient-to-br from-warm-gray/20 to-warm-gray/10 dark:from-warm-gray/10 dark:to-warm-gray/5 overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-6xl opacity-20 group-hover:opacity-30 transition-opacity duration-500 select-none">
                      {project.emoji}
                    </span>
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>

                {/* 内容区域 */}
                <div className="p-6 sm:p-8">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-song text-xl font-bold text-ink-black dark:text-rice-white mb-1">
                        {project.name}
                      </h3>
                      <p className="text-sm text-ink-gray/50 dark:text-rice-white-dim/50">
                        {project.nameEn}
                      </p>
                    </div>
                    <FiArrowUpRight className="w-5 h-5 text-ink-gray/30 dark:text-rice-white-dim/30 group-hover:text-ink-black dark:group-hover:text-rice-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
                  </div>

                  <p className="text-sm text-ink-gray/70 dark:text-rice-white-dim/70 mb-5 line-clamp-2">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-5">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 rounded-full text-xs font-medium
                          bg-ink-black/[0.04] dark:bg-rice-white/[0.06]
                          text-ink-gray/70 dark:text-rice-white-dim/70"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {project.links.map((link) => (
                        <a
                          key={link.label}
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-sm text-ink-gray/60 dark:text-rice-white-dim/60
                            hover:text-ink-black dark:hover:text-rice-white transition-colors duration-200"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {link.icon === "github" && <FiGithub className="w-4 h-4" />}
                          {link.icon === "play" && <FiPlay className="w-4 h-4" />}
                          {link.label}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
                </BorderGlow>
              </motion.article>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
