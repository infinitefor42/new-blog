import Link from "next/link";

interface SpaceButtonProps {
  href: string;
  children: React.ReactNode;
}

/**
 * 星空按钮（改编自 Uiverse.io by StealthWorm · spotty-horse-48）
 * 彩虹渐变边框 + 旋转星空背景 + 光晕脉冲，用于首页主 CTA。
 */
export function SpaceButton({ href, children }: SpaceButtonProps) {
  return (
    <Link href={href} className="space-btn">
      <strong className="space-btn__label">{children}</strong>
      <div className="space-btn__stars">
        <div className="space-btn__stars-inner" />
      </div>
      <div className="space-btn__glow">
        <div className="space-btn__circle" />
        <div className="space-btn__circle" />
      </div>
    </Link>
  );
}
