"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { appleEasing, createContainerVariants, createCardVariants } from "@/lib/animations";

const containerVariants = createContainerVariants();
const cardVariants = createCardVariants();

const skillCards = [
  { emoji: "💻", title: "核心修炼", desc: "C 语言 / 数据结构与算法" },
  { emoji: "🛠️", title: "工具链", desc: "Git 版本控制 / MiMo Code" },
  { emoji: "📝", title: "技能解锁", desc: "Linux操作系统" },
  { emoji: "🧠", title: "兴趣点", desc: "数学 / 计算机专业探索" },
];

export function SkillsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="skills" className="py-24 lg:py-32 relative">
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
              核心技能
            </motion.h2>
            <motion.p
              variants={cardVariants}
              className="text-lg text-ink-gray/50 dark:text-rice-white-dim/50"
            >
              我的工程实践
            </motion.p>
            <motion.div
              variants={cardVariants}
              className="w-16 h-0.5 bg-warm-gray dark:bg-warm-gray-dark mx-auto rounded-full mt-6"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
            {skillCards.map((card, index) => (
              <motion.div
                key={index}
                variants={cardVariants}
                whileHover={{ y: -8, transition: { duration: 0.4, ease: appleEasing } }}
                className="glass-card p-6 sm:p-8 group cursor-default"
                style={{ transition: "box-shadow 0.4s cubic-bezier(0.23, 1, 0.32, 1)" }}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 20px 40px rgba(25,19,15,0.12)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = ""; }}
              >
                <div className="flex items-center gap-4">
                  <span className="text-4xl sm:text-5xl flex-shrink-0 select-none" style={{ lineHeight: 1.2 }}>
                    {card.emoji}
                  </span>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-ink-black dark:text-rice-white mb-1">
                      {card.title}
                    </h3>
                    <p className="text-sm text-ink-gray/70 dark:text-rice-white-dim/70 leading-relaxed">
                      {card.desc}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
