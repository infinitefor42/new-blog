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
| **3D** | Three.js + React Three Fiber | 3D 粒子系统与场景渲染 |
| **图标** | Lucide React | 矢量图标库 |
| **评论** | GitHub Giscus | 基于 GitHub Discussions，明暗主题丝滑联动 |
| **主题** | next-themes | 亮色 / 暗色切换 |

---

## 📁 Project Structure

```
my-new-blog/
├── .github/
│   └── workflows/
│       └── deploy.yml              # GitHub Pages 自动部署工作流
│
├── public/                         # 静态公共资源
│   ├── images/                     # 网站 Logo 与文章配图
│   ├── audio/                      # 记忆树背景音乐
│   ├── games/                      # HTML5 小游戏（贪吃蛇）
│   ├── icons/                      # PWA 图标（192 / 512）
│   ├── CNAME                       # 自定义域名绑定
│   ├── manifest.json               # PWA 应用清单
│   └── sw.js                       # Service Worker（静态资源缓存）
│
├── src/
│   ├── app/                        # Next.js App Router 路由
│   │   ├── layout.tsx              # 根布局（字体加载、Providers 注入）
│   │   ├── page.tsx                # 首页（Hero + 技能 + 项目 + 博客预览）
│   │   ├── globals.css             # 全局样式（宣纸背景、玻璃拟态、排版系统）
│   │   ├── not-found.tsx           # 404 页面
│   │   ├── search-index.json/      # 全文搜索静态索引（构建时生成）
│   │   ├── memory-tree/
│   │   │   └── page.tsx            # 记忆树页面入口
│   │   └── blog/
│   │       ├── layout.tsx          # 博客分区布局
│   │       ├── page.tsx            # 博客列表页（标签云 + 分类筛选）
│   │       ├── archive/page.tsx    # 文章归档页
│   │       ├── search/page.tsx     # 全文搜索页
│   │       ├── tags/               # 标签聚合页（列表 + 单标签）
│   │       ├── categories/         # 分类聚合页（列表 + 单分类）
│   │       └── [slug]/page.tsx     # 文章详情页（SSG 静态生成）
│   │
│   ├── components/
│   │   ├── landing/                # 首页板块组件
│   │   │   ├── hero.tsx            # 头像、座右铭、社交链接胶囊
│   │   │   ├── skills-section.tsx  # 核心技能卡片网格
│   │   │   ├── projects-section.tsx# 项目作品展示
│   │   │   ├── blog-preview.tsx    # 最新文章预览
│   │   │   ├── landing-sections.tsx# 非首屏区块聚合（合并 chunk）
│   │   │   └── lazy-sections.tsx   # 非首屏区块懒加载入口
│   │   │
│   │   ├── blog/                   # 博客功能组件
│   │   │   ├── blog-post.tsx       # 文章渲染（Markdown + 代码高亮 + 数学公式）
│   │   │   ├── blog-card.tsx       # 文章卡片
│   │   │   ├── post-grid.tsx       # 文章网格列表
│   │   │   ├── page-header.tsx     # 分区页头
│   │   │   ├── search-client.tsx   # 搜索客户端组件
│   │   │   ├── table-of-contents.tsx # 文章目录（TOC）
│   │   │   ├── reading-progress.tsx# 阅读进度条
│   │   │   ├── giscus-comments.tsx # Giscus 评论组件（明暗主题联动）
│   │   │   ├── MemoryTree.tsx      # 记忆树 3D 场景组件
│   │   │   └── memory-tree/        # 记忆树子场景（粒子树 / 能量束 / 克莱因瓶等）
│   │   │
│   │   ├── layout/                 # 全局布局组件
│   │   │   ├── navbar.tsx          # 顶部导航栏（滚动感知 + 移动端抽屉）
│   │   │   ├── theme-toggle.tsx    # 暗亮主题切换按钮
│   │   │   └── footer.tsx          # 页脚
│   │   │
│   │   ├── common/                 # 通用组件
│   │   │   ├── back-to-top.tsx     # 回到顶部
│   │   │   ├── busuanzi.tsx        # 不蒜子访问量统计
│   │   │   ├── code-block.tsx      # 代码块（文件名 + 复制按钮）
│   │   │   ├── typewriter.tsx      # 打字机效果
│   │   │   ├── space-button.tsx    # 太空风格按钮
│   │   │   ├── border-glow.tsx     # 边框辉光
│   │   │   ├── spotlight-card.tsx  # 聚光灯卡片
│   │   │   ├── split-text.tsx      # 文字分割动画
│   │   │   └── service-worker-register.tsx # SW 注册与更新提示
│   │   │
│   │   ├── providers.tsx           # 全局 Provider（HeroUI + next-themes）
│   │   └── theme-script.tsx        # 防闪烁暗色模式初始化脚本
│   │
│   ├── lib/                        # 工具库
│   │   ├── posts.ts                # Markdown 文章加载与元数据解析
│   │   ├── slugify.ts              # 标题转 URL slug（与 TOC 共用）
│   │   └── animations.ts           # 共享动画常量与变体工厂
│   │
│   ├── config/                     # 配置文件
│   │   ├── site.ts                 # 站点信息（导航、社交链接）
│   │   └── photos.ts               # 记忆树相册数据配置
│   │
│   └── posts/                      # 博客文章（Markdown 源文件）
│
├── next.config.ts                  # Next.js 配置（静态导出 + PWA headers）
├── tsconfig.json                   # TypeScript 编译配置
├── pnpm-workspace.yaml             # pnpm 工作区配置
├── tunnel.js                       # localtunnel 临时公网预览脚本
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
- 代码块带文件名顶栏与一键复制按钮
- 文章目录（TOC）锚点跳转 + 顶部阅读进度条 + 回到顶部

### 🔍 全文搜索与聚合页

- 构建时生成静态搜索索引（`/search-index.json`），客户端检索标题 / 摘要 / 标签
- 标签云按文章数分档展示，标签 / 分类均有独立聚合页

### ⚡ 性能与 PWA

- Service Worker 对 `_next/static` 静态资源采用 Cache First 策略，二次访问秒开
- 首页非首屏区块懒加载 + 合并动态 import，减少 chunk 碎片化
- PWA 应用清单 + 图标，支持添加到主屏幕
- 不蒜子访问量统计（本地开发环境自动屏蔽，避免污染数据）

### 🎮 原生游戏实验室

- 通过 Next.js 静态资源路由无缝内嵌 HTML5 Canvas 小游戏
- 经典贪吃蛇（Snake Game）：支持 PC 键盘 + 移动端触控适配
- 访问路径：`/games/Snake_Game/index.html`

### 🌳 记忆树 — 3D 沉浸式记忆空间

- 基于 Three.js 的 3D 粒子系统，174,000 个粒子构建梦幻星海
- 内置音乐播放器，支持多首歌曲切换，唱片机样式控制按钮
- 相册系统：支持多张照片组成相册，点击查看详情，懒加载优化性能（目前无照片）
- 响应式设计：桌面端与移动端自适应，性能动态调整
- 访问路径：`/memory-tree`

### 💬 GitHub Giscus 评论系统

- 基于 GitHub Discussions 的评论，零后端、零成本
- 明暗主题丝滑联动：切换主题时通过 `postMessage` 实时切换 Giscus iframe 样式
- 全站文章详情页自动覆盖，无需手动嵌入

### 📱 响应式设计

- 桌面端与移动端自适应布局
- 移动端导航抽屉、触控手势支持
- 性能优化：懒加载、粒子数量动态调整

---
<div align="center">

**Built with ❤️ by INFINITE**

*以热爱为引，期待与你同行。*

</div>
