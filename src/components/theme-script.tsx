/**
 * 主题初始化脚本（内联到 <head>）
 * 在页面加载前执行，防止暗黑模式切换时的闪烁
 */
export function ThemeScript() {
  const script = `
    (function() {
      try {
        // 从 localStorage 读取主题设置
        var theme = localStorage.getItem('theme');

        // 如果没有设置，使用系统偏好
        if (!theme || theme === 'system') {
          theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }

        // 立即应用主题类名
        if (theme === 'dark') {
          document.documentElement.classList.add('dark');
          document.documentElement.style.colorScheme = 'dark';
        } else {
          document.documentElement.classList.remove('dark');
          document.documentElement.style.colorScheme = 'light';
        }
      } catch (e) {
        // 如果出错，默认使用亮色主题
        document.documentElement.classList.remove('dark');
      }
    })();
  `;

  return (
    <script
      dangerouslySetInnerHTML={{ __html: script }}
      suppressHydrationWarning
    />
  );
}
