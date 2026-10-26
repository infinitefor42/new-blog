<div align="center">

# INFINITE

**A modern personal blog & tech lab with "Chinese elegance · paper-texture minimalism" aesthetics**

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61dafb?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss)
![License](https://img.shields.io/badge/License-MIT-green)

[🌐 Live Demo](https://caobowen.top) · [📦 Source](https://github.com/infinitefor42/new-blog)

**🌐 English (current) | [简体中文](README.md)**

</div>

---

## 📖 About The Project

INFINITE is a personal tech blog built on a warm rice-paper palette (`#F5EDE0`), Songti serif typography, and glassmorphism components.

---

## 🛠 Tech Stack

| Layer | Tech | Notes |
|:---|:---|:---|
| **Framework** | Next.js 16 (App Router) | Static export (SSG), hosted on GitHub Pages |
| **Language** | TypeScript 5 | Full type safety |
| **Styling** | Tailwind CSS 4 | Utility CSS + custom theme tokens |
| **UI Base** | HeroUI | Global provider & style infrastructure |
| **Animation** | Framer Motion | Apple-easing transitions & SVG icon morphing |
| **3D** | Three.js + React Three Fiber | Particle systems & scene rendering |
| **Icons** | Lucide React / React Icons | Vector icon sets |
| **Comments** | GitHub Giscus | Powered by GitHub Discussions, seamless theme sync |
| **Backend** | Supabase | Guestbook storage & visit analytics (RLS + DB rate-limit triggers) |
| **Theming** | next-themes | Light / dark mode |

---

## 📁 Project Structure

<details>
<summary>📂 <strong>Click to expand the full project tree</strong> (collapsed by default)</summary>

```
my-new-blog/
├── .github/
│   └── workflows/
│       └── deploy.yml              # GitHub Pages auto-deploy workflow
│
├── public/                         # Static assets
│   ├── images/                     # Site logo & post illustrations
│   ├── audio/                      # Memory Tree BGM (CC0 original synthesized ambient)
│   ├── games/                      # HTML5 mini-games (Snake, MIT LICENSE included)
│   ├── icons/                      # PWA icons (192 / 512 / maskable)
│   ├── CNAME                       # Custom domain binding
│   ├── manifest.json               # PWA manifest
│   ├── robots.txt                  # Search engine crawl rules
│   └── sw.js                       # Service Worker (static asset caching)
│
├── src/
│   ├── app/                        # Next.js App Router routes
│   │   ├── layout.tsx              # Root layout (fonts, Providers)
│   │   ├── page.tsx                # Home (Hero + Skills + Projects + Blog preview)
│   │   ├── globals.css             # Global styles (paper bg, glassmorphism, typography)
│   │   ├── not-found.tsx           # 404 page
│   │   ├── sitemap.ts              # Sitemap (generated at build time)
│   │   ├── search-index.json/      # Full-text search static index (build-time)
│   │   ├── memory-tree/
│   │   │   ├── layout.tsx          # Memory Tree SEO metadata (server-injected)
│   │   │   └── page.tsx            # Memory Tree page entry
│   │   ├── guestbook/
│   │   │   ├── layout.tsx          # Guestbook SEO metadata
│   │   │   └── page.tsx            # Guestbook page
│   │   └── blog/
│   │       ├── layout.tsx          # Blog section layout
│   │       ├── page.tsx            # Post list (tag cloud + category filter)
│   │       ├── archive/page.tsx    # Archive page
│   │       ├── search/page.tsx     # Full-text search page
│   │       ├── tags/               # Tag aggregation (list + single tag)
│   │       ├── categories/         # Category aggregation (list + single category)
│   │       └── [slug]/page.tsx     # Post detail page (SSG)
│   │
│   ├── components/
│   │   ├── landing/                # Home page sections
│   │   │   ├── hero.tsx            # Avatar, motto, social link capsules
│   │   │   ├── skills-section.tsx  # Tech-stack marquee (full-bleed + edge fade)
│   │   │   ├── projects-section.tsx# Project showcase
│   │   │   ├── blog-preview.tsx    # Latest posts preview
│   │   │   ├── landing-sections.tsx# Below-fold sections bundle (merged chunk)
│   │   │   └── lazy-sections.tsx   # Lazy entry for below-fold sections
│   │   │
│   │   ├── blog/                   # Blog feature components
│   │   │   ├── blog-post.tsx       # Post renderer (Markdown + highlight + KaTeX)
│   │   │   ├── blog-card.tsx       # Post card
│   │   │   ├── post-grid.tsx       # Post grid list
│   │   │   ├── page-header.tsx     # Section page header
│   │   │   ├── search-client.tsx   # Search client component
│   │   │   ├── table-of-contents.tsx # Table of contents (TOC)
│   │   │   ├── reading-progress.tsx# Reading progress bar
│   │   │   ├── giscus-comments.tsx # Giscus comments (theme-synced)
│   │   │   ├── MemoryTree.tsx      # Memory Tree 3D scene
│   │   │   └── memory-tree/        # Memory Tree sub-scenes (particle tree, energy beam, Klein bottle...)
│   │   │
│   │   ├── guestbook/              # Guestbook components
│   │   │   └── guestbook-client.tsx# Guestbook (post / like / draft / anti-spam)
│   │   │
│   │   ├── layout/                 # Global layout components
│   │   │   ├── navbar.tsx          # Top navbar (scroll-aware + mobile drawer)
│   │   │   ├── theme-toggle.tsx    # Dark/light theme toggle
│   │   │   └── footer.tsx          # Footer
│   │   │
│   │   ├── common/                 # Shared components
│   │   │   ├── back-to-top.tsx     # Back to top
│   │   │   ├── page-view-tracker.tsx # Visit tracking (route change → Supabase)
│   │   │   ├── visit-stats.tsx     # Visit stats display (footer site-wide)
│   │   │   ├── code-block.tsx      # Code block (PrismLight on-demand + copy button)
│   │   │   ├── morph-icon.tsx      # SVG morph icons (hamburger ⇄ close)
│   │   │   ├── typewriter.tsx      # Typewriter effect
│   │   │   ├── space-button.tsx    # Space-style button
│   │   │   ├── border-glow.tsx     # Border glow
│   │   │   ├── spotlight-card.tsx  # Spotlight card
│   │   │   ├── split-text.tsx      # Split-text animation
│   │   │   └── service-worker-register.tsx # SW registration & update prompt
│   │   │
│   │   ├── providers.tsx           # Global Providers (HeroUI + next-themes)
│   │   └── theme-script.tsx        # Anti-flash dark-mode init script
│   │
│   ├── lib/                        # Utilities
│   │   ├── posts.ts                # Markdown post loading & metadata (build-time cache)
│   │   ├── slugify.ts              # Heading → URL slug (shared by content & TOC, dedup)
│   │   ├── supabase.ts             # Supabase REST client (guestbook CRUD + atomic-like RPC)
│   │   ├── analytics.ts            # Visit analytics reporting & queries
│   │   └── animations.ts           # Shared animation constants & variant factories
│   │
│   ├── config/                     # Configuration
│   │   ├── site.ts                 # Site info (nav, social links, Giscus config)
│   │   └── photos.ts               # Memory Tree album data config
│   │
│   └── posts/                      # Blog posts (Markdown source)
│
├── supabase/
│   └── page_views.sql              # DB scripts (stats table / RPC / RLS / rate-limit triggers)
│
├── next.config.ts                  # Next.js config (static export)
├── tsconfig.json                   # TypeScript compiler config
├── pnpm-workspace.yaml             # pnpm workspace config
├── .env.local                      # Env vars (Giscus + Supabase, not committed)
└── package.json                    # Dependencies & scripts
```

</details>

---

## ✨ Key Features

- **🎨 Paper aesthetics** — `#F5EDE0` warm cream base with SVG noise texture, Songti SC headings, three-tier glassmorphism cards
- **📝 Polished Markdown** — KaTeX math, GFM tables, PrismLight on-demand highlighting, filename bar + one-click copy, TOC anchors with deduplicated heading IDs
- **🔍 Full-text search** — Build-time static index (`/search-index.json`), client-side search over title / excerpt / body, tag & category aggregation pages
- **💬 Guestbook** — Anonymous notes with draft autosave, atomic like counting via Supabase RPC, layered anti-spam (client filters + DB rate-limit triggers), anon role locked to SELECT + INSERT only
- **📊 Self-hosted analytics** — PV/UV stats on Supabase (replacing busuanzi), RLS write-only for anon, DB-level insert rate limiting
- **⚡ Performance & PWA** — Service Worker Cache First for hashed assets, lazy below-fold sections, installable manifest
- **🎮 Game lab** — Classic Snake (keyboard + touch), served at `/games/Snake_Game/index.html`, MIT licensed
- **🌳 Memory Tree** — 174,000-particle Three.js dreamscape, CC0 original synthesized ambient music, album system, 3-tier device-adaptive particle scaling (35%/60%/100%), audio loaded on demand
- **💬 Giscus comments** — Theme-synced via `postMessage` on every post page
- **📱 Responsive** — Adaptive layouts, mobile drawer navigation, touch gestures

---

## 🚀 Quick Start

```bash
pnpm install     # Install dependencies
pnpm dev         # Dev server on :3000
pnpm build       # Static export to ./out
pnpm lint        # ESLint
```

Copy `.env.local` with your Giscus & Supabase variables (see `src/config/site.ts` and `supabase/page_views.sql` for reference). Deploy by pushing to `main` — GitHub Actions builds and publishes to GitHub Pages automatically.

---

## 📄 License

- **Code**: open-sourced under the [MIT License](LICENSE)
- **Articles** (posts under `src/posts/`): licensed under [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/) — attribution to **INFINITE (caobowen.top)** with a link to the original article is required; no commercial use; derivatives must be shared under the same license

<div align="center">

**Built with ❤️ by INFINITE**

</div>
