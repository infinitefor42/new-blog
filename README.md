<div align="center">

# INFINITE

**一个主打「中式文雅 · 纸质感极简」美学的现代个人博客系统与技术实验室**

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61dafb?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss)
![License](https://img.shields.io/badge/License-MIT-green)

[🌐 在线预览](https://caobowen.top) · [📦 源码仓库](https://github.com/infinitefor42/new-blog)

</div>

---

## 📖 About The Project

INFINITE 是一个以 **宣纸暖米色 `#f3eee5`** 为底色、融合 **宋体字型** 与 **玻璃拟态（Glassmorphism）** 组件的个人技术博客。

---

## 🛠 Tech Stack

| 层级 | 技术 | 说明 |
|:---|:---|:---|
| **框架** | Next.js 16 (App Router) | React 服务端渲染 + 静态导出 |
| **语言** | TypeScript 5 | 全站类型安全 |
| **样式** | Tailwind CSS 4 | 原子化 CSS + 自定义主题变量 |
| **组件库** | HeroUI | 玻璃拟态风格的 React 组件 |
| **动画** | Framer Motion | Apple 风格缓动曲线的页面转场 |
| **评论** | GitHub Giscus | 基于 GitHub Discussions，明暗主题丝滑联动 |
| **Markdown** | react-markdown + remark-gfm + remark-math + rehype-katex | 数学公式 + 代码高亮 + 表格支持 |
| **主题** | next-themes | 亮色 / 暗色 / 二态切换|

---

## 📁 Project Structure

```
my-new-blog/
├── .github/
│   └── workflows/
│       └── deploy.yml              # GitHub Pages 自动部署工作流
│
├── public/                         # 静态公共资源
│   ├── avatar.png                  # 个人头像
│   ├── CNAME                       # 自定义域名绑定
│   ├── manifest.json               # PWA 应用清单
│   ├── sw.js                       # Service Worker（离线缓存）
│   ├── icons/                      # PWA 图标（192 / 512）
│   └── games/
│
├── src/
│   ├── app/                        # Next.js App Router 路由
│   │   ├── layout.tsx              # 根布局（字体加载、Providers 注入）
│   │   ├── page.tsx                # 首页（Hero + 技能 + 项目 + 博客预览）
│   │   ├── globals.css             # 全局样式（宣纸背景、玻璃拟态、排版系统）
│   │   ├── not-found.tsx           # 404 页面
│   │   └── blog/
│   │       ├── page.tsx            # 博客列表页（筛选 + 分类）
│   │       ├── archive/page.tsx    # 文章归档页
│   │       └── [slug]/page.tsx     # 文章详情页（SSG 静态生成）
│   │
│   ├── components/
│   │   ├── landing/                # 首页板块组件
│   │   │   ├── hero.tsx            # 头像、座右铭、社交链接胶囊
│   │   │   ├── skills-section.tsx  # 核心技能卡片网格
│   │   │   ├── projects-section.tsx# 项目作品展示（含浏览量统计）
│   │   │   └── blog-preview.tsx    # 最新文章预览
│   │   │
│   │   ├── blog/                   # 博客功能组件
│   │   │   ├── blog-post.tsx       # 文章渲染（Markdown + 代码高亮 + 数学公式）
│   │   │   ├── blog-card.tsx       # 文章卡片
│   │   │   ├── blog-list-client.tsx# 博客列表客户端组件
│   │   │   ├── filter-panel.tsx    # 标签 / 分类筛选面板
│   │   │   └── giscus-comments.tsx # Giscus 评论组件（明暗主题联动）
│   │   │
│   │   ├── layout/                 # 全局布局组件
│   │   │   ├── navbar.tsx          # 顶部导航栏（滚动感知 + 移动端抽屉）
│   │   │   └── footer.tsx          # 页脚
│   │   │
│   │   ├── common/                 # 通用组件
│   │   │   ├── view-counter.tsx    # 浏览量计数器
│   │   │   └── service-worker-register.tsx
│   │   │
│   │   ├── providers.tsx           # 全局 Provider（HeroUI + next-themes）
│   │   └── theme-script.tsx        # 防闪烁暗色模式初始化脚本
│   │
│   ├── hooks/                      # 自定义 Hooks
│   │   └── use-view-count.ts       # 单页浏览量计数
│   │
│   ├── lib/                        # 工具库
│   │   ├── posts.ts                # Markdown 文章加载与元数据解析
│   │   └── animations.ts           # 共享动画常量与变体工厂
│   │
│   └── posts/                      # 博客文章（Markdown 源文件）
│       
│
├── next.config.ts                  # Next.js 配置（静态导出 + PWA headers）
├── tsconfig.json                   # TypeScript 编译配置
├── pnpm-workspace.yaml             # pnpm 工作区配置
├── .env.local                      # 环境变量（Giscus 配置，不提交）
└── package.json                    # 项目依赖与脚本
```

---

## ✨ Key Features

### 🎨 宣纸美学视觉体系

- 全站 `#f3eee5` 暖米色底色，搭配 `body::before` SVG 噪声纹理模拟宣纸纤维质感
- 宋体（Songti SC）字型贯穿标题与 Logo，技术内容兼具人文温度
- 三层玻璃拟态卡片（`glass-card` / `glass-card-subtle` / `glass-card-strong`），覆盖所有交互组件
- 彻底抹平组件间色差与顽固横线，页面背景浑然一体

### 📝 极致的 Markdown 排版

- 修复 Tailwind Typography 默认反引号伪元素（`::before` / `::after`）导致的行内代码外露 Bug
- 行内代码渲染为暖灰色微代码块：`rgba(25,19,15,0.05)` 背景 + 圆角边框 + 微妙阴影
- 完美支持数学公式（KaTeX）、表格（GFM）、任务列表等扩展语法

### 🎮 原生游戏实验室

- 通过 Next.js 静态资源路由无缝内嵌 HTML5 Canvas 小游戏
- 经典贪吃蛇（Snake Game）：支持 PC 键盘 + 移动端触控适配
- 访问路径：`/games/Snake_Game/index.html`

### 💬 GitHub Giscus 评论系统

- 基于 GitHub Discussions 的评论，零后端、零成本
- 明暗主题丝滑联动：切换主题时通过 `postMessage` 实时切换 Giscus iframe 样式
- 全站文章详情页自动覆盖，无需手动嵌入

### 📊 项目浏览量

- **项目卡片浏览量**：基于 localStorage 的轻量级计数，展示在卡片右下角
---
<div align="center">

**Built with ❤️ by INFINITE**

*以热爱为引，期待与你同行。*

</div>
