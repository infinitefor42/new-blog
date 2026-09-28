interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

/** 博客各页统一的居中标题块 */
export function PageHeader({ title, subtitle }: PageHeaderProps) {
  return (
    <div className="text-center mb-12">
      <h1 className="font-song text-4xl sm:text-5xl font-bold text-ink-black dark:text-rice-white mb-4">
        {title}
      </h1>
      {subtitle && (
        <p className="text-lg text-ink-gray/60 dark:text-rice-white-dim/60">
          {subtitle}
        </p>
      )}
      <div className="w-16 h-0.5 bg-warm-gray dark:bg-warm-gray-dark mx-auto rounded-full mt-6" />
    </div>
  );
}
