export interface NavChild {
  label: string;
  href: string;
}

export interface NavItem {
  label: string;
  href: string;
  children?: NavChild[];
}

export const navItems: NavItem[] = [
  { label: "首页", href: "/" },
  {
    label: "博客",
    href: "/blog",
    children: [
      { label: "分类", href: "/blog/categories" },
      { label: "标签", href: "/blog/tags" },
      { label: "归档", href: "/blog/archive" },
      { label: "搜索", href: "/blog/search" },
    ],
  },
];

export const siteConfig = {
  name: "INFINITE",
  author: "Bowen Cao",
  description: "一个极简风格的个人博客",
  avatar: "/images/website-logo.png",
  lang: "zh-CN",

  title: {
    default: "DevLog",
    template: "%s | DevLog",
  },

  social: {
    github: "https://github.com/infinitefor42",
    email: "mailto:pcodeinfinite@qq.com",
  },

  nav: navItems,

  hero: {
    greeting: "你好，我是",
    subtitle: "大二学生 | 数据科学与大数据技术专业",
    bio: "这里沉淀知识笔记、数学推导、算法分析，也记录数据、代码与成长的细碎感悟。不求一步到位，只求日日精进。愿以热爱为引，期待与你同行。",
    quote: "We are not behind. We are just not there yet.",
    ctaLabel: "阅读博客",
  },

  skills: {
    title: "核心技能",
    subtitle: "我的学习与实践",
    cards: [
      { emoji: "💻", title: "编程基础", desc: "C 语言 / Python / 数据结构与算法" },
      { emoji: "🖥️", title: "系统与数据", desc: "Linux 操作系统 / MySQL 数据库" },
      { emoji: "🛠️", title: "工程工具", desc: "Git 版本控制 / 命令行 / MiMo Code" },
      { emoji: "🧮", title: "数学基础", desc: "高等数学 / 线性代数" },
    ],
  },

  projects: {
    title: "项目作品",
    subtitle: "我参与开发的项目",
    cards: [
      {
        name: "INFINITE 博客",
        nameEn: "INFINITE Blog",
        description: "一个极简风格的个人博客系统，中式纸质感与苹果玻璃拟态的融合",
        tags: ["Next.js", "Tailwind CSS", "TypeScript"],
        emoji: "📝",
        links: [
          { label: "查看代码", icon: "github" as const, href: "https://github.com/infinitefor42/new-blog" },
        ],
      },
      {
        name: "经典贪吃蛇",
        nameEn: "Classic Snake",
        description: "基于 HTML5 Canvas 的复古贪吃蛇小游戏，怀旧像素风格",
        tags: ["HTML5", "JavaScript", "Canvas"],
        emoji: "🐍",
        links: [
          { label: "开始游戏", icon: "play" as const, href: "/games/Snake_Game/index.html" },
        ],
      },
    ],
  },

  giscus: {
    repo: "infinitefor42/new-blog",
    repoId: "R_kgDOStseQg",
    category: "General",
    categoryId: "DIC_kwDOStseQs4C-Ru4",
    mapping: "pathname",
    lang: "zh-CN",
    themes: { dark: "noborder_dark", light: "noborder_light" },
  },

  katex: {
    version: "0.16.11",
    integrity: "sha384-nB0miv6/jRmo5UMMR1wu3Gz6NLsoTkbqJghGIsx//Rlm+ZU03BU6SQNC66uf4l5+",
  },
};
