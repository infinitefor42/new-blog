/**
 * 主题初始化脚本（内联到 <head>）
 * 在页面加载前执行，防止暗黑模式切换时的闪烁。
 * App Router 中 next/script 的 beforeInteractive 不支持在页面级组件使用，
 * 官方推荐直接使用内联 <script> 标签。
 */
export function ThemeScript() {
  const script = `
    (function() {
      try {
        var theme = localStorage.getItem('theme');

        if (!theme || theme === 'system') {
          theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }

        if (theme === 'dark') {
          document.documentElement.classList.add('dark');
          document.documentElement.style.colorScheme = 'dark';
        } else {
          document.documentElement.classList.remove('dark');
          document.documentElement.style.colorScheme = 'light';
        }
      } catch (e) {
        document.documentElement.classList.remove('dark');
      }
    })();
  `;

  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
