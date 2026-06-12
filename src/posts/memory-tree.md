---
title: "记忆树 — 3D 照片记忆墙"
date: "2026-06-12"
tags: ["Three.js", "React", "3D", "WebGL"]
categories: ["项目"]
excerpt: "基于 Three.js 的交互式 3D 照片展示组件，将照片以圣诞树形态螺旋排列，配合粒子特效和音乐可视化营造沉浸式回忆体验。"
---

## 项目简介

记忆树是一个基于 Three.js 的 3D 照片展示组件，灵感来源于圣诞树上悬挂的装饰球——把照片以螺旋形态排列在三维空间中，配合粒子背景和自动旋转，营造沉浸式的回忆浏览体验。

## 技术栈

| 技术 | 用途 |
|------|------|
| **Three.js** | 3D 渲染引擎，处理粒子系统和几何体 |
| **React Three Fiber** | Three.js 的 React 封装，声明式 3D 开发 |
| **@react-three/drei** | 常用 3D 组件（OrbitControls、useTexture、useVideoTexture） |
| **Framer Motion** | 2D UI 动画（加载界面、弹窗过渡） |
| **Lucide React** | 图标库（关闭、返回、音乐等图标） |

## 项目架构

```
src/
├── app/memory-tree/page.tsx      # 页面入口，动态加载 3D 组件
├── components/blog/MemoryTree.tsx # 核心 3D 场景组件（1138 行）
└── config/photos.ts              # 照片数据配置
```

## 核心组件解析

### 1. 粒子系统（Particle Systems）

记忆树由多层粒子系统叠加构成，营造星空效果：

| 组件 | 粒子数 | 作用 |
|------|--------|------|
| **ParticleWave** | 35,000 | 地面波浪，青紫双色交替，模拟海面波动 |
| **StarDust** | 5,000 | 星尘背景，三种纹理（星星、雪花、月亮）以不同速度旋转 |
| **EnergyBeam** | 18,000 | 能量光束，从树心向外发散的细小粒子 |
| **RadiantTree** | 95,000 | 树冠主体，6 层结构，粉白渐变 |
| **LuminousPedestal** | 9,000 | 底座光环，粉紫色旋转基座 |
| **KleinBottle** | 12,000 | 克莱因瓶装饰，青色渐变悬浮在树顶 |

**总计约 174,000 个粒子**，全部使用 `AdditiveBlending` 实现发光效果。

### 2. 照片节点（MediaNode）

照片以 billboard 方式始终面向相机：

```typescript
// 照片定位算法：斐波那契球面分布
const getNebulaPos = (i: number, total: number): [number, number, number] => {
  const phi = Math.acos(0.85 - (1.7 * i) / total);
  const theta = Math.sqrt(total * Math.PI) * phi;
  const radius = 55 + Math.random() * 25;
  // ...
};
```

特性：
- 使用 `useTexture` / `useVideoTexture` 加载媒体
- 悬停时粉色发光边框 + 放大 1.2 倍
- 点击弹出大图预览（支持视频自动播放）
- 每个节点有独立的浮动相位，形成波浪效果

### 3. 加载动画

采用模拟进度条 + 真实加载进度混合策略：

```typescript
// 模拟进度：快速到达 90%，等待真实加载完成
const increment = Math.max(remaining * 0.15, Math.random() * 8 + 2);

// 超时保护：4.5 秒后强制显示
useEffect(() => {
  const timer = setTimeout(() => {
    if (progress < 100) setForceLoad(true);
  }, 4500);
}, [progress]);
```

### 4. 音乐可视化

顶部工具栏包含音乐控制按钮，使用 Framer Motion 实现音符跳动动画：

- 三个音符图标以不同延迟循环缩放
- 颜色在青色、粉色、紫色之间渐变
- 播放/暂停状态切换时有平滑过渡

## 响应式设计

针对移动端做了专门优化：

| 配置项 | 桌面端 | 移动端 |
|--------|--------|--------|
| 相机位置 | `[0, 15, 80]` | `[0, 20, 100]` |
| 视场角 | 42° | 50° |
| DPR | 1-1.5 | 1-1.2 |
| 自动旋转速度 | 0.3 | 0.15 |
| 最小距离 | 45 | 60 |
| 抗锯齿 | 开启 | 关闭（性能优先） |

## 数据配置

照片数据在 `src/config/photos.ts` 中定义：

```typescript
export interface Photo {
  id: number | string;
  url: string;           // 图片/视频路径
  type: "image" | "video";
  title: string;         // 标题
  location: string;      // 拍摄地点/备注
  rotate?: number;       // 可选：图片旋转角度
}

export const PHOTO_DATA: Photo[] = [
  // 添加你的照片数据...
];
```

照片路径建议放在 `public/images/memory-tree/` 目录下。

## 性能优化

1. **动态加载**：使用 `next/dynamic` + `ssr: false` 避免服务端渲染
2. **粒子复用**：所有粒子使用 `useMemo` 缓存，避免重复计算
3. **移动端降级**：关闭抗锯齿、降低 DPR、减少旋转速度
4. **超时保护**：4.5 秒后强制显示，避免白屏

## 交互说明

- **拖拽旋转**：鼠标左键拖动视角（移动端支持触控）
- **滚轮缩放**：调整与树的距离
- **点击照片**：弹出大图预览（支持视频自动播放）
- **ESC 键**：关闭预览弹窗
- **自动旋转**：松手后缓慢回正

## 快速体验

[🌳 打开记忆树](/memory-tree)
