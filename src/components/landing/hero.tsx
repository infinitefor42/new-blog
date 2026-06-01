"use client";

import { motion, type Variants } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { FiArrowDown, FiArrowRight, FiMail } from "react-icons/fi";
import { FaGithub } from "react-icons/fa";

const appleEasing: [number, number, number, number] = [0.23, 1, 0.32, 1];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.3 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: appleEasing },
  },
};

const avatarVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 1, ease: appleEasing },
  },
};

export function Hero() {
  const socialLinks = [
    { icon: FaGithub, href: "https://github.com/infinitefor42", label: "GitHub" },
    { icon: FiMail, href: "mailto:pcodeinfinite@qq.com", label: "Email" },
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] left-[10%] w-[600px] h-[600px] bg-warm-gray/20 dark:bg-warm-gray/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[20%] right-[10%] w-[500px] h-[500px] bg-warm-gray/15 dark:bg-warm-gray/5 rounded-full blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-5xl mx-auto"
        >
          {/* 头像区域 */}
          <motion.div variants={avatarVariants} className="flex justify-center mb-12">
            <div className="relative group">
              <div className="absolute -inset-2 bg-gradient-to-br from-warm-gray/30 to-warm-gray/10 dark:from-warm-gray/20 dark:to-warm-gray/5 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48 rounded-full overflow-hidden bg-white/30 dark:bg-white/10 backdrop-blur-md border border-white/20 dark:border-white/10 shadow-xl">
                <Image
                  src="/avatar.png"
                  alt="个人头像"
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 640px) 128px, (max-width: 1024px) 160px, 192px"
                />
                <div className="absolute inset-0 bg-ink-black/0 group-hover:bg-ink-black/5 dark:group-hover:bg-rice-white/5 transition-all duration-300 rounded-full" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-4 border-paper-bg dark:border-ink-deep shadow-lg" />
            </div>
          </motion.div>

          {/* 文字区域 */}
          <div className="text-center">
            <motion.p
              variants={itemVariants}
              className="text-base sm:text-lg text-ink-gray/60 dark:text-rice-white-dim/60 mb-4 font-light tracking-wider uppercase"
            >
              你好，我是
            </motion.p>

            <motion.h1
              variants={itemVariants}
              className="font-song text-2xl sm:text-3xl md:text-4xl font-bold text-ink-black dark:text-rice-white mb-8 tracking-wide leading-none"
            >
              INFINITE
            </motion.h1>

            <motion.div variants={itemVariants} className="mb-6">
              <h2 className="text-xl sm:text-2xl text-ink-gray dark:text-rice-white-dim font-light">
                大一学生 | 数据科学与大数据技术专业
              </h2>
            </motion.div>

            <motion.p
              variants={itemVariants}
              className="text-base sm:text-lg text-ink-gray/70 dark:text-rice-white-dim/70 max-w-2xl mx-auto mb-8 leading-relaxed"
            >
              数据科学与大数据技术——从录取通知书上的抽象概念，到如今我正试图拆解的逻辑。这里沉淀课程笔记、数学推导、算法复盘，也记录数据、代码与成长的碎碎念。不求一步到位，只求日日精进。愿以热爱为引，期待与你同行。
            </motion.p>

            <motion.blockquote
              variants={itemVariants}
              className="text-sm sm:text-base text-ink-gray/50 dark:text-rice-white-dim/50 max-w-xl mx-auto mb-12
                italic tracking-wide text-center w-full"
            >
              &ldquo;We are not behind. We are just not there yet.&rdquo;
            </motion.blockquote>

            {/* CTA 按钮组 */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10"
            >
              <Link
                href="/blog"
                className="group relative inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl
                  bg-ink-black dark:bg-rice-white text-paper-bg dark:text-ink-deep
                  font-medium text-sm sm:text-base
                  transition-all duration-500
                  hover:shadow-[0_20px_40px_rgba(25,19,15,0.2)] dark:hover:shadow-[0_20px_40px_rgba(245,240,232,0.15)]
                  hover:scale-[1.02] active:scale-[0.98]"
                style={{ transitionTimingFunction: `cubic-bezier(${appleEasing.join(",")})` }}
              >
                阅读博客
                <FiArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </motion.div>

            {/* 社交链接 - 玻璃拟态胶囊 */}
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-5 px-7 py-3 mx-auto
                bg-white/40 dark:bg-white/10 backdrop-blur-lg
                rounded-full border border-white/20 dark:border-white/10
                shadow-sm"
            >
              {socialLinks.map((social) => {
                const isMail = social.href.startsWith("mailto:");
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    {...(isMail ? {} : { target: "_blank", rel: "noopener noreferrer" })}
                    className="group relative p-2.5 rounded-xl
                      text-ink-gray/40 dark:text-rice-white-dim/40
                      hover:text-ink-black dark:hover:text-rice-white
                      hover:bg-ink-black/5 dark:hover:bg-rice-white/5
                      transition-all duration-300"
                    aria-label={social.label}
                    onClick={(e) => e.stopPropagation()}
                    style={{ transitionTimingFunction: `cubic-bezier(${appleEasing.join(",")})` }}
                  >
                    <social.icon className="w-5 h-5 sm:w-6 sm:h-6 transition-transform duration-300 group-hover:scale-110" />
                  </a>
                );
              })}
            </motion.div>
          </div>

          {/* 滚动指示器 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 1 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2"
          >
            <a
              href="#skills"
              className="flex flex-col items-center gap-3 text-ink-gray/30 dark:text-rice-white-dim/30
                hover:text-ink-gray/60 dark:hover:text-rice-white-dim/60 transition-colors duration-300"
            >
              <span className="text-[10px] tracking-[0.3em] uppercase">向下滚动</span>
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <FiArrowDown className="w-4 h-4" />
              </motion.div>
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
