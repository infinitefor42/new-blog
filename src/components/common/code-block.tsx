"use client";

import { useState } from "react";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import bash from "react-syntax-highlighter/dist/esm/languages/prism/bash";
import c from "react-syntax-highlighter/dist/esm/languages/prism/c";
import javascript from "react-syntax-highlighter/dist/esm/languages/prism/javascript";
import latex from "react-syntax-highlighter/dist/esm/languages/prism/latex";
import markdown from "react-syntax-highlighter/dist/esm/languages/prism/markdown";
import typescript from "react-syntax-highlighter/dist/esm/languages/prism/typescript";
import { FiCopy, FiCheck, FiFile } from "react-icons/fi";

// 仅注册文章实际用到的语言（bash/c/javascript/latex/markdown/typescript），
// 避免全量 Prism 打包全部语言包撑大文章页 chunk（gitignore 无对应语言包，保持无高亮渲染，与此前行为一致）
SyntaxHighlighter.registerLanguage("bash", bash);
SyntaxHighlighter.registerLanguage("c", c);
SyntaxHighlighter.registerLanguage("javascript", javascript);
SyntaxHighlighter.registerLanguage("latex", latex);
SyntaxHighlighter.registerLanguage("markdown", markdown);
SyntaxHighlighter.registerLanguage("typescript", typescript);

interface CodeBlockProps {
  code: string;
  language: string;
  filename?: string;
  highlightLines?: number[];
}

export function CodeBlock({
  code,
  language,
  filename,
  highlightLines = [],
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // 非安全上下文或权限被拒绝时剪贴板不可用，静默忽略
    }
  };

  return (
    <div className="my-6 rounded-xl overflow-hidden border border-warm-gray/20 dark:border-rice-white/10">
      {/* 顶部栏：文件名 + 复制按钮 */}
      <div className="flex items-center justify-between px-4 py-2
        bg-ink-black/[0.03] dark:bg-rice-white/[0.05]
        border-b border-warm-gray/20 dark:border-rice-white/10">
        <div className="flex items-center gap-2 text-xs text-ink-gray/50 dark:text-rice-white-dim/50">
          {filename && (
            <>
              <FiFile className="w-3 h-3" />
              <span>{filename}</span>
            </>
          )}
          {!filename && (
            <span className="uppercase tracking-wider">{language}</span>
          )}
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs
            text-ink-gray/50 dark:text-rice-white-dim/50
            hover:text-ink-black dark:hover:text-rice-white
            hover:bg-ink-black/5 dark:hover:bg-rice-white/5
            transition-all duration-200"
        >
          {copied ? (
            <>
              <FiCheck className="w-3 h-3 text-green-500" />
              <span>已复制</span>
            </>
          ) : (
            <>
              <FiCopy className="w-3 h-3" />
              <span>复制</span>
            </>
          )}
        </button>
      </div>

      {/* 代码区域 */}
      <SyntaxHighlighter
        language={language}
        style={oneDark}
        showLineNumbers
        wrapLines
        lineProps={(lineNumber) => ({
          style: {
            background: highlightLines.includes(lineNumber)
              ? "rgba(255, 255, 255, 0.06)"
              : "transparent",
            display: "block",
            padding: "0 1rem",
          },
        })}
        customStyle={{
          margin: 0,
          padding: "1rem 0",
          background: "transparent",
          fontSize: "0.875rem",
          lineHeight: "1.7",
        }}
      >
        {code.replace(/\n$/, "")}
      </SyntaxHighlighter>
    </div>
  );
}
