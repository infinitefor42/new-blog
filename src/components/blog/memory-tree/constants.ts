import * as THREE from "three";

export const MUSIC_LIST = [
  { title: "小半", src: "/audio/陈粒 - 小半.mp3" },
  { title: "这世界那么多人", src: "/audio/莫文蔚 - 这世界那么多人.mp3" },
  { title: "世界赠予我的", src: "/audio/王菲 - 世界赠予我的.mp3" },
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
