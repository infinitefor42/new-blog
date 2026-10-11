"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { createContainerVariants, createCardVariants } from "@/lib/animations";
import { siteConfig } from "@/config/site";

const containerVariants = createContainerVariants();
const cardVariants = createCardVariants();

/**
 * 单行技术栈便签。
 * 走马灯通过「两份完全相同的内容 + 平移 -50%」实现无缝循环，
 * 因此该行会被渲染两次，第二份对屏幕阅读器隐藏。
 */
function StackRow({ ariaHidden = false }: { ariaHidden?: boolean }) {
  return (
    <div
      aria-hidden={ariaHidden || undefined}
      className="flex w-max items-center gap-4 pr-4 sm:gap-6 sm:pr-6"
    >
      {siteConfig.skills.stack.map((item) => (
        <div
          key={item.name}
          className="flex items-center gap-3 rounded-2xl border border-warm-gray-light/80 bg-paper-bg-light/80 px-5 py-3 shadow-sm shadow-black/5 transition-all duration-300 hover:scale-105 hover:border-accent/50 sm:px-6 sm:py-3.5 dark:border-rice-white/10 dark:bg-ink-deep-light/80 dark:shadow-black/20"
        >
          <item.icon className="h-6 w-6 shrink-0 text-ink-black/55 sm:h-7 sm:w-7 dark:text-rice-white-dim" />
          <span className="whitespace-nowrap text-base font-medium text-ink-black/75 sm:text-lg dark:text-rice-white/85">
            {item.name}
          </span>
        </div>
      ))}
    </div>
  );
}

export function SkillsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="skills" className="relative py-24 lg:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <div className="mb-16 text-center">
            <motion.h2
              variants={cardVariants}
              className="font-song text-4xl sm:text-5xl lg:text-6xl font-bold text-ink-black dark:text-rice-white mb-3"
            >
              {siteConfig.skills.title}
            </motion.h2>
            <motion.p
              variants={cardVariants}
              className="text-lg text-ink-gray/50 dark:text-rice-white-dim/50"
            >
              {siteConfig.skills.subtitle}
            </motion.p>
            <motion.div
              variants={cardVariants}
              className="w-16 h-0.5 bg-warm-gray dark:bg-warm-gray-dark mx-auto rounded-full mt-6"
            />
          </div>

          {/* 技术栈走马灯：全屏出血 + 两端渐隐遮罩，悬停暂停 */}
          <motion.div
            variants={cardVariants}
            className="relative left-1/2 w-screen -translate-x-1/2"
          >
            <div className="marquee-viewport overflow-hidden py-3 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
              <div className="marquee-track flex w-max items-center">
                <StackRow />
                <StackRow ariaHidden />
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
