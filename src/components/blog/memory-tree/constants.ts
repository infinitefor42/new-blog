import * as THREE from "three";

// 背景音乐：程序化合成的原创环境音乐（CC0，无版权风险）
export const MUSIC_LIST = [
  { title: "星尘漫游", src: "/audio/ambient-stardust.wav" },
];

export const COLORS = {
  STAR_WHITE: new THREE.Color("#ffffff"),
  HOT_PINK: new THREE.Color("#ff1493"),
  CYAN: new THREE.Color("#00ffff"),
  VIOLET: new THREE.Color("#8b00ff"),
  STAR_DUST: new THREE.Color("#ffffff"),
};

// Pre-allocated reusable objects for useFrame loops (avoid GC pressure)
export const _vec3a = new THREE.Vector3();
export const _vec3b = new THREE.Vector3();
export const _color = new THREE.Color();
