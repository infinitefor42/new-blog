# AGENTS.md — INFINITE Blog

## Quick Commands

```bash
pnpm dev          # Dev server (Next.js 16, port 3000)
pnpm build        # Static export to ./out (GitHub Pages)
pnpm lint         # ESLint (Next.js core-web-vitals + TypeScript rules)
```

No typecheck script — run `npx tsc --noEmit` if needed.

## Architecture

- **Framework**: Next.js 16 App Router, **static export** (`output: "export"` in next.config.ts)
- **Deploy**: GitHub Pages via `.github/workflows/deploy.yml` (push to `main` → build → deploy)
- **Package manager**: pnpm (v11)
- **Node**: 22 (CI)

### Key Paths

| Path | Purpose |
|------|---------|
| `src/app/` | Next.js routes (App Router) |
| `src/components/` | React components: `landing/`, `blog/`, `layout/`, `common/` |
| `src/posts/` | Markdown blog posts (`.md` files) |
| `src/lib/posts.ts` | Post loading, metadata parsing, frontmatter handling |
| `src/lib/animations.ts` | Shared Framer Motion variants |
| `public/` | Static assets (avatars, PWA icons, games) |

### Blog System

- Posts in `src/posts/*.md` use YAML frontmatter (`title`, `date`, `tags`, `categories`, `excerpt`)
- `gray-matter` parses frontmatter; reading time estimated at 400 chars/min (Chinese)
- `getAllSlugs()` generates static params for SSG
- Categories have a preset order: 算法 → 数学 → 项目 → 笔记

## Style Conventions

- **Colors**: `paper-bg` (#f3eee5 warm cream), `ink-black` (#19130f), `ink-deep` (#121212 dark mode)
- **Fonts**: Songti SC for headings/logo, Geist for body text
- **Components**: Glassmorphism cards (`glass-card` classes in globals.css)
- **Animation**: Framer Motion for page transitions; `layoutId` for nav indicators
- **Tailwind v4**: Theme defined via `@theme inline` in `globals.css`

## Gotchas

- Static export means **no server-side rendering at runtime** — all data must be available at build time
- `public/games/` contains standalone HTML5 games (not Next.js routes)
- `public/images/` holds blog post images — reference them in markdown as `/images/xxx.png`
- `.env.local` contains Giscus config (excluded from git) — needed for comments to work
- `tunnel.js` uses localtunnel for temporary public previews (subdomain: `infinite-blog-preview`)
