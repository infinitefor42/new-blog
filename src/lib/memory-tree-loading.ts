/**
 * 记忆树加载进度计算（纯函数，与渲染解耦）。
 *
 * 两段式语义：
 * 1. Canvas 首帧未就绪：模拟进度缓动上升，但封顶 PRE_READY_CAP（60%），
 *    不假装接近完成，避免"卡在高位却迟迟进不去"的假等待感；
 * 2. Canvas 就绪后：按真实流逝时间给下限（minLoadTime 保底展示），
 *    同时以固定步进 + 缓动系数快速收尾到 100%。
 */

/** Canvas 未就绪阶段的进度封顶值（%） */
export const PRE_READY_CAP = 60;
/** 就绪前的缓动总时长（秒） */
export const PRE_READY_DURATION_S = 2.0;
/** 最短展示时间（毫秒），防止进度条一闪而过 */
export const MIN_LOAD_TIME_MS = 1200;
/** 就绪后每 tick 的固定步进（%） */
export const READY_STEP = 4;
/** 就绪后向目标收敛的缓动系数 */
export const READY_EASE = 0.35;

/**
 * 阶段一：Canvas 未就绪时的模拟进度。
 * @param elapsedSec 距加载开始的秒数
 * @returns 0 ~ PRE_READY_CAP 之间的进度，单调不减（对 elapsedSec 单调）
 */
export function preReadyProgress(elapsedSec: number): number {
  const t = Math.min(Math.max(elapsedSec, 0) / PRE_READY_DURATION_S, 1);
  const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
  return eased * PRE_READY_CAP;
}

/**
 * 阶段二：Canvas 就绪后，根据上一帧进度计算下一帧进度。
 * @param prev 当前进度（%）
 * @param elapsedMs 距加载开始的毫秒数
 * @returns 收敛到 100 的下一帧进度，保证单调不减
 */
export function readyNextProgress(prev: number, elapsedMs: number): number {
  if (prev >= 100) return 100;
  const minProgress = Math.min((elapsedMs / MIN_LOAD_TIME_MS) * 100, 100);
  const target = Math.max(minProgress, prev + READY_STEP);
  const next = prev + (target - prev) * READY_EASE;
  return next >= 100 ? 100 : Math.max(prev, next);
}
