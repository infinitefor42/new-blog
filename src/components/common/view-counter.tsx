"use client";

import { FiEye } from "react-icons/fi";
import { useViewCount } from "@/hooks/use-view-count";

interface ViewCounterProps {
  projectId: string;
}

export function ViewCounter({ projectId }: ViewCounterProps) {
  const { count, mounted } = useViewCount(projectId);

  return (
    <span className="inline-flex items-center gap-1 text-xs text-ink-gray/40 dark:text-rice-white-dim/40">
      <FiEye className="w-3 h-3" />
      {mounted ? count.toLocaleString() : "—"}
    </span>
  );
}
