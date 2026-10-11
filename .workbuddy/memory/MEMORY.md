# INFINITE Blog — 长期项目记忆

## 用户工作偏好（长期有效，2026-10-11 确立）
- **验证环节由用户自行负责**：所有代码修改直接执行，不要跑 tsc / eslint / build / dev 等任何验证步骤，改完直接交付。
- 例外：写代码前的「读文件确认事实」（如确认某图标在依赖中存在、某函数签名）属于正常编码动作，不算验证。

## 项目关键约束
- Next.js 16 静态导出（output: "export"），所有数据必须构建期可得；无运行时 SSR。
- 本地 `pnpm build` 会被 WorkBuddy 沙箱 safe-delete 保护拦截（Next.js 清 .next 触发批量删除阈值），且 dev server 持有 .next 文件锁——构建验证只能靠用户本地或 GitHub Actions CI。
- pnpm 在 Windows 下依赖符号链接易损坏，曾手工 mklink /J 修复。
- 内容集中在 `src/config/site.ts`（nav/hero/skills/projects/giscus）；留言墙数据层 `src/lib/supabase.ts` 为裸 fetch PostgREST（不用 supabase-js SDK）。
