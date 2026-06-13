"use client";

import React, {
  useMemo,
  useRef,
  useState,
  Suspense,
  useEffect,
  useCallback,
} from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  useTexture,
  useVideoTexture,
  useProgress,
} from "@react-three/drei";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ArrowLeft,
  Sparkles,
  Play,
  Pause,
  SkipForward,
  Music,
} from "lucide-react";
import { PHOTO_DATA, ALBUM_DATA, type Photo, type Album } from "@/config/photos";

const MUSIC_LIST = [
  { title: "这世界那么多人", src: "/audio/莫文蔚 - 这世界那么多人.mp3" },
  { title: "小半", src: "/audio/陈粒 - 小半.mp3" },
  { title: "世界赠予我的", src: "/audio/王菲 - 世界赠予我的.mp3" },
];

const COLORS = {
  STAR_WHITE: new THREE.Color("#ffffff"),
  HOT_PINK: new THREE.Color("#ff1493"),
  CYAN: new THREE.Color("#00ffff"),
  VIOLET: new THREE.Color("#8b00ff"),
  STAR_DUST: new THREE.Color("#ffffff"),
};

// ======================== ParticleWave ========================
const ParticleWave = () => {
  const count = 35000;
  const meshRef = useRef<THREE.Points>(null);

  const glowTexture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext("2d")!;
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 30);
    grad.addColorStop(0, "rgba(255, 255, 255, 0.9)");
    grad.addColorStop(0.4, "rgba(255, 255, 255, 0.3)");
    grad.addColorStop(1, "rgba(255, 255, 255, 0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(canvas);
  }, []);

  const [positions, offsets] = useMemo(() => {
    const p = new Float32Array(count * 3);
    const o = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      const r = 3.0 + Math.sqrt(Math.random()) * 58;
      const theta = Math.random() * Math.PI * 2;
      p[i * 3] = r * Math.cos(theta);
      p[i * 3 + 1] = -11.5 + (Math.random() - 0.5) * 0.8;
      p[i * 3 + 2] = r * Math.sin(theta);
      o[i] = r;
    }
    return [p, o];
  }, []);

  const yOffsets = useMemo(() => {
    const arr = new Float32Array(count);
    for (let i = 0; i < count; i++) arr[i] = (Math.random() - 0.5) * 0.8;
    return arr;
  }, []);

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.elapsedTime;
      const posAttr = meshRef.current.geometry.attributes
        .position as THREE.BufferAttribute;
      for (let i = 0; i < count; i++) {
        const r = offsets[i];
        const wave = Math.sin(r * 0.25 - time * 0.6) * 0.85;
        const wave2 = Math.cos(r * 0.12 + time * 0.4) * 0.3;
        posAttr.setY(i, -11.5 + yOffsets[i] + wave + wave2);
      }
      posAttr.needsUpdate = true;
      meshRef.current.rotation.y += 0.0003;
    }
  });

  return (
    <points ref={meshRef} renderOrder={5}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.6}
        map={glowTexture}
        transparent
        opacity={0.8}
        fog={false}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation={true}
      />
    </points>
  );
};

// ======================== StarDust ========================
const PartSet = ({
  count,
  texture,
  speedMult,
}: {
  count: number;
  texture: THREE.Texture;
  speedMult: number;
}) => {
  const meshRef = useRef<THREE.Points>(null);
  const pos = useMemo(() => {
    const p = new Float32Array(count * 3);
    const rand = () => Math.random();
    for (let i = 0; i < count; i++) {
      const r = 25 + rand() * 65;
      const theta = rand() * Math.PI * 2;
      const phi = Math.acos(rand() * 2 - 1);
      p[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      p[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      p[i * 3 + 2] = r * Math.cos(phi);
    }
    return p;
  }, [count]);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.00015 * speedMult;
      meshRef.current.rotation.x += 0.00008 * speedMult;
      (
        meshRef.current.material as THREE.PointsMaterial
      ).opacity =
        0.75 + Math.sin(state.clock.elapsedTime * 0.6 * speedMult) * 0.25;
    }
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[pos, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={1.05}
        map={texture}
        transparent
        alphaTest={0.05}
        color={COLORS.STAR_DUST}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation={true}
      />
    </points>
  );
};

const StarDust = () => {
  const totalCount = 5000;
  const countPerType = Math.floor(totalCount / 3);

  const textures = useMemo(() => {
    const createTex = (drawFn: (ctx: CanvasRenderingContext2D) => void) => {
      const canvas = document.createElement("canvas");
      canvas.width = 64;
      canvas.height = 64;
      const ctx = canvas.getContext("2d")!;
      ctx.fillStyle = "white";
      ctx.shadowBlur = 12;
      ctx.shadowColor = "white";
      drawFn(ctx);
      return new THREE.CanvasTexture(canvas);
    };

    return {
      star: createTex((ctx) => {
        const cx = 32,
          cy = 32,
          spikes = 5,
          outer = 28,
          inner = 12;
        let rot = (Math.PI / 2) * 3;
        const step = Math.PI / spikes;
        ctx.beginPath();
        ctx.moveTo(cx, cy - outer);
        for (let i = 0; i < spikes; i++) {
          ctx.lineTo(
            cx + Math.cos(rot) * outer,
            cy + Math.sin(rot) * outer
          );
          rot += step;
          ctx.lineTo(
            cx + Math.cos(rot) * inner,
            cy + Math.sin(rot) * inner
          );
          rot += step;
        }
        ctx.closePath();
        ctx.fill();
      }),
      snow: createTex((ctx) => {
        ctx.strokeStyle = "white";
        ctx.lineWidth = 5;
        ctx.lineCap = "round";
        const cx = 32,
          cy = 32;
        for (let i = 0; i < 6; i++) {
          const angle = (i * 60 * Math.PI) / 180;
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.lineTo(cx + Math.cos(angle) * 28, cy + Math.sin(angle) * 28);
          const bx = cx + Math.cos(angle) * 18;
          const by = cy + Math.sin(angle) * 18;
          ctx.moveTo(bx, by);
          ctx.lineTo(
            bx + Math.cos(angle + 0.6) * 10,
            by + Math.sin(angle + 0.6) * 10
          );
          ctx.moveTo(bx, by);
          ctx.lineTo(
            bx + Math.cos(angle - 0.6) * 10,
            by + Math.sin(angle - 0.6) * 10
          );
          ctx.stroke();
        }
      }),
      moon: createTex((ctx) => {
        ctx.beginPath();
        const start = Math.PI * 0.6;
        const end = Math.PI * 1.4;
        ctx.arc(32, 32, 26, start, end, true);
        ctx.bezierCurveTo(
          44,
          19,
          44,
          45,
          32 + Math.cos(start) * 26,
          32 + Math.sin(start) * 26
        );
        ctx.fill();
      }),
    };
  }, []);

  return (
    <group>
      <PartSet count={countPerType} texture={textures.star} speedMult={1.0} />
      <PartSet count={countPerType} texture={textures.snow} speedMult={0.8} />
      <PartSet count={countPerType} texture={textures.moon} speedMult={0.6} />
    </group>
  );
};

// ======================== EnergyBeam ========================
const EnergyBeam = () => {
  const count = 18000;
  const meshRef = useRef<THREE.Points>(null);
  const [pos, colors] = useMemo(() => {
    const p = new Float32Array(count * 3);
    const c = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const h = Math.random() * 32.5 - 11.5;
      const rBase = Math.pow(Math.random(), 5.0) * 1.5;
      const angle = Math.random() * Math.PI * 2;
      p[i * 3] = Math.cos(angle) * rBase;
      p[i * 3 + 1] = h;
      p[i * 3 + 2] = Math.sin(angle) * rBase;
      const bColor = COLORS.STAR_WHITE.clone();
      if (rBase > 0.6) bColor.lerp(COLORS.HOT_PINK, 0.4);
      c[i * 3] = bColor.r;
      c[i * 3 + 1] = bColor.g;
      c[i * 3 + 2] = bColor.b;
    }
    return [p, c];
  }, []);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y =
        (state.clock.elapsedTime * 0.15) % 0.12;
      meshRef.current.rotation.y += 0.008;
    }
  });

  return (
    <points ref={meshRef} renderOrder={11}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[pos, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.045}
        vertexColors
        transparent
        opacity={0.65}
        fog={false}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

// ======================== RadiantTree ========================
const RadiantTree = () => {
  const pointsCount = 95000;
  const { positions, colors, finalCount } = useMemo(() => {
    const p = new Float32Array(pointsCount * 3);
    const c = new Float32Array(pointsCount * 3);
    const numTiers = 6;
    let ptr = 0;
    for (let i = 0; i < pointsCount; i++) {
      const yNorm = Math.random();
      const tierIndex = Math.floor(yNorm * numTiers);
      const tierProgress = yNorm * numTiers - tierIndex;
      const baseRadius = 13.5;
      const tierExpansion =
        0.9 + Math.pow(1.0 - tierProgress, 3.5) * 0.45;
      const maxR = Math.max(
        0.35 * (1.1 - yNorm),
        baseRadius * (1.0 - Math.pow(yNorm, 1.2)) * tierExpansion
      );
      const r = Math.pow(Math.random(), 1.4) * maxR;
      if (r > maxR * 0.98) continue;
      const angle = Math.random() * Math.PI * 2;
      p[ptr * 3] = Math.cos(angle) * r;
      p[ptr * 3 + 1] = yNorm * 32.0 - 11.5;
      p[ptr * 3 + 2] = Math.sin(angle) * r;
      const bColor = COLORS.STAR_WHITE.clone();
      const rNorm = r / (maxR + 0.001);
      if (rNorm > 0.88) {
        const rand = Math.random();
        if (rand > 0.6) bColor.lerp(COLORS.CYAN, 0.6);
        else bColor.lerp(COLORS.HOT_PINK, 0.8);
      } else {
        bColor.lerp(
          COLORS.HOT_PINK,
          THREE.MathUtils.smoothstep(rNorm, 0.1, 0.8) * 0.8
        );
      }
      bColor.multiplyScalar(1.0 + (1.0 - rNorm) * 1.5);
      c[ptr * 3] = bColor.r;
      c[ptr * 3 + 1] = bColor.g;
      c[ptr * 3 + 2] = bColor.b;
      ptr++;
      if (ptr >= pointsCount) break;
    }
    return { positions: p, colors: c, finalCount: ptr };
  }, []);

  const geomRef = useRef<THREE.BufferGeometry>(null);
  useEffect(() => {
    if (geomRef.current) geomRef.current.setDrawRange(0, finalCount);
  }, [finalCount]);

  const ref = useRef<THREE.Points>(null);
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y -= 0.0004;
      (ref.current.material as THREE.PointsMaterial).opacity =
        0.85 + Math.sin(state.clock.elapsedTime * 1.8) * 0.08;
    }
  });

  return (
    <points ref={ref} renderOrder={10}>
      <bufferGeometry ref={geomRef}>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        vertexColors
        size={0.14}
        transparent
        opacity={0.9}
        fog={false}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
        sizeAttenuation={true}
      />
    </points>
  );
};

// ======================== LuminousPedestal ========================
const LuminousPedestal = () => {
  const count = 9000;
  const meshRef = useRef<THREE.Points>(null);
  const [pos, colors] = useMemo(() => {
    const p = new Float32Array(count * 3);
    const c = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 8.5 + Math.random() * 32.0;
      const theta = Math.random() * Math.PI * 2;
      p[i * 3] = Math.cos(theta) * r;
      p[i * 3 + 1] = (Math.random() - 0.5) * 1.2 - 11.5;
      p[i * 3 + 2] = Math.sin(theta) * r;
      const bColor = COLORS.HOT_PINK.clone().lerp(
        COLORS.VIOLET,
        Math.random() * 0.5
      );
      c[i * 3] = bColor.r;
      c[i * 3 + 1] = bColor.g;
      c[i * 3 + 2] = bColor.b;
    }
    return [p, c];
  }, []);

  useFrame(() => {
    if (meshRef.current) meshRef.current.rotation.y += 0.008;
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[pos, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.2}
        vertexColors
        transparent
        opacity={0.35}
        fog={false}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

// ======================== KleinBottle ========================
const KleinBottle = () => {
  const count = 12000;
  const meshRef = useRef<THREE.Points>(null);
  const colorRef = useRef<THREE.BufferAttribute>(null);
  const pos = useMemo(() => {
    const p = new Float32Array(count * 3);
    const c = new Float32Array(count * 3);
    const a = 3;
    const scale = 1.2;

    for (let i = 0; i < count; i++) {
      const u = Math.random() * Math.PI * 2;
      const v = Math.random() * Math.PI * 2;

      const cosU = Math.cos(u);
      const sinU = Math.sin(u);
      const cosHalfU = Math.cos(u / 2);
      const sinHalfU = Math.sin(u / 2);
      const sinV = Math.sin(v);
      const sin2V = Math.sin(2 * v);

      const x = (a + cosHalfU * sinV - sinHalfU * sin2V) * cosU;
      const y = (a + cosHalfU * sinV - sinHalfU * sin2V) * sinU;
      const z = sinHalfU * sinV + cosHalfU * sin2V;

      p[i * 3] = x * scale;
      p[i * 3 + 1] = y * scale + 23;
      p[i * 3 + 2] = z * scale;

      const t = (u + v) / (Math.PI * 4);
      const color = new THREE.Color();
      color.setHSL(0.55 + t * 0.15, 0.8, 0.6 + t * 0.2);
      c[i * 3] = color.r;
      c[i * 3 + 1] = color.g;
      c[i * 3 + 2] = color.b;
    }
    return { positions: p, colors: c };
  }, []);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.008;
      const time = state.clock.elapsedTime;
      const opacity = 0.8 + Math.sin(time * 1.5) * 0.2;
      (meshRef.current.material as THREE.PointsMaterial).opacity = opacity;
    }
  });

  return (
    <points ref={meshRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[pos.positions, 3]} />
        <bufferAttribute ref={colorRef} attach="attributes-color" args={[pos.colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.16}
        vertexColors
        transparent
        opacity={0.9}
        fog={false}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};

// ======================== MediaNode ========================
const getNebulaPos = (i: number, total: number): [number, number, number] => {
  const phi = Math.acos(0.85 - (1.7 * i) / total);
  const theta = Math.sqrt(total * Math.PI) * phi;
  const radius = 55 + Math.random() * 25;
  const angleOffset =
    Math.PI * 0.5 - Math.sqrt(total * Math.PI) * Math.acos(0.85);
  const x = radius * Math.cos(theta + angleOffset) * Math.sin(phi);
  const y = Math.random() * 40 - 5;
  const z = radius * Math.sin(theta + angleOffset) * Math.sin(phi);
  return [x, y, z];
};

const MediaNode = ({
  photo,
  position,
  onSelect,
}: {
  photo: Photo;
  position: [number, number, number];
  onSelect: (photo: Photo) => void;
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  const texture =
    photo.type === "video"
      ? // eslint-disable-next-line react-hooks/rules-of-hooks
        useVideoTexture(photo.url, {
          muted: true,
          loop: true,
          start: true,
          crossOrigin: "Anonymous",
        })
      : // eslint-disable-next-line react-hooks/rules-of-hooks
        useTexture(photo.url);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.quaternion.copy(state.camera.quaternion);
      const t = state.clock.elapsedTime;
      const phaseOffset =
        typeof photo.id === "number"
          ? photo.id
          : parseInt(String(photo.id).replace(/\D/g, ""), 10) || 0;
      meshRef.current.position.set(
        position[0],
        position[1] + Math.sin(t * 0.4 + phaseOffset) * 0.3,
        position[2]
      );
      const targetScale = hovered ? 1.2 : 1.0;
      meshRef.current.scale.lerp(
        new THREE.Vector3(targetScale, targetScale, targetScale),
        0.1
      );
    }
  });

  return (
    <mesh
      ref={meshRef}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={() => onSelect(photo)}
    >
      <planeGeometry args={[3.6, 5.4]} />
      <meshBasicMaterial map={texture} transparent opacity={1} fog={false} />
      <mesh position={[0, 0, -0.01]}>
        <planeGeometry args={[3.8, 5.6]} />
        <meshBasicMaterial
          color={hovered ? COLORS.HOT_PINK : "#ffffff"}
          transparent
          opacity={hovered ? 0.4 : 0.15}
          fog={false}
        />
      </mesh>
    </mesh>
  );
};

// ======================== MusicVisualizer ========================
function MusicVisualizer({ isPlaying }: { isPlaying: boolean }) {
  const notes = [
    { id: 1, delay: 0, size: 12 },
    { id: 2, delay: 0.2, size: 8 },
    { id: 3, delay: 0.4, size: 10 },
  ];

  return (
    <div className="flex items-center gap-[4px] h-3 justify-center pointer-events-none">
      {notes.map((note) => (
        <motion.div
          key={note.id}
          initial="stopped"
          animate={isPlaying ? "playing" : "stopped"}
          variants={{
            playing: {
              scale: [0.8, 1.2, 0.8],
              opacity: [0.6, 1, 0.6],
              color: ["#00ffff", "#ff1493", "#8b00ff", "#00ffff"],
              y: [0, -4, 0],
              transition: {
                scale: {
                  repeat: Infinity,
                  duration: 1.2,
                  ease: "easeInOut",
                  delay: note.delay,
                },
                opacity: {
                  repeat: Infinity,
                  duration: 1.2,
                  ease: "easeInOut",
                  delay: note.delay,
                },
                y: {
                  repeat: Infinity,
                  duration: 1.5,
                  ease: "easeInOut",
                  delay: note.delay,
                },
                color: { repeat: Infinity, duration: 3, ease: "linear" },
              },
            },
            stopped: {
              scale: 0.8,
              opacity: 0.3,
              y: 0,
              color: "rgba(255, 255, 255, 0.3)",
              transition: { duration: 0.5 },
            },
          }}
        >
          <Music size={note.size} strokeWidth={2.5} />
        </motion.div>
      ))}
    </div>
  );
}

// ======================== Main Component ========================
export default function MemoryTree({
  onPhotoClick,
}: {
  onPhotoClick?: (photo: Photo) => void;
}) {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const { progress: r3fProgress } = useProgress();
  const [simulatedProgress, setSimulatedProgress] = useState(0);
  const [forceLoad, setForceLoad] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [startProgress, setStartProgress] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.src = MUSIC_LIST[currentTrack].src;
    if (isPlaying) {
      audioRef.current.play().catch(() => {});
    }
  }, [currentTrack]);

  useEffect(() => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.play().catch(() => {});
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, currentTrack]);

  const handleNext = () => {
    setCurrentTrack((prev) => (prev + 1) % MUSIC_LIST.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentTrack((prev) => (prev - 1 + MUSIC_LIST.length) % MUSIC_LIST.length);
    setIsPlaying(true);
  };

  const startTimeRef = useRef(0);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      startTimeRef.current = performance.now();
      setStartProgress(true);
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!startProgress) return;
    const interval = setInterval(() => {
      const elapsed = (performance.now() - startTimeRef.current) / 1000;
      const t = Math.min(elapsed / 3.2, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      const simulated = Math.min(eased * 100, 99.5);
      setSimulatedProgress(simulated);
      if (t >= 1) clearInterval(interval);
    }, 50);
    return () => clearInterval(interval);
  }, [startProgress]);

  const progress = r3fProgress >= 100 || ready ? 100 : simulatedProgress;

  const handleSelect = useCallback(
    (photo: Photo) => {
      setSelectedPhoto(photo);
      if (photo.album) {
        const album = ALBUM_DATA.find((a) => a.id === photo.album);
        setSelectedAlbum(album || null);
        setCurrentPhotoIndex(0);
      } else {
        setSelectedAlbum(null);
      }
      onPhotoClick?.(photo);
    },
    [onPhotoClick]
  );

  useEffect(() => {
    if (!startProgress) return;
    const timer = setTimeout(() => setReady(true), 3500);
    return () => clearTimeout(timer);
  }, [startProgress]);

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      body, #root { background: black !important; overflow: hidden; margin: 0; } canvas { background: black !important; }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const isLoaded = progress >= 100 || forceLoad;

  const photoPositions = useMemo(
    () => PHOTO_DATA.map((_, i) => getNebulaPos(i, PHOTO_DATA.length)),
    []
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSelectedPhoto(null);
        setSelectedAlbum(null);
        setCurrentPhotoIndex(0);
      }
    },
    []
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 5000,
        backgroundColor: "black",
        overflow: "hidden",
        color: "white",
      }}
    >
      <AnimatePresence>
        {!isLoaded && (
          <motion.div
            key="loader"
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            style={{
              position: "absolute",
              inset: 0,
              zIndex: 10000,
              background: "radial-gradient(ellipse at center, #0a0a1a 0%, #000000 70%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "2rem",
              }}
            >
              <motion.span
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                style={{
                  color: "#ff1493",
                  fontFamily: "monospace",
                  letterSpacing: "0.4em",
                  fontSize: isMobile ? "12px" : "14px",
                }}
              >
                正在唤醒记忆星海...
              </motion.span>
              <div
                style={{
                  width: isMobile ? "180px" : "240px",
                  height: "2px",
                  background: "rgba(255,20,147,0.15)",
                  borderRadius: "1px",
                  overflow: "hidden",
                }}
              >
                <motion.div
                  style={{
                    height: "100%",
                    background: "linear-gradient(90deg, #ff1493, #00ffff, #ff1493)",
                    backgroundSize: "200% 100%",
                    borderRadius: "1px",
                  }}
                  animate={{
                    width: `${progress}%`,
                    backgroundPosition: ["0% 0%", "100% 0%"],
                  }}
                  transition={{
                    width: { duration: 0.3, ease: "easeOut" },
                    backgroundPosition: { duration: 2, repeat: Infinity, ease: "linear" },
                  }}
                />
              </div>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4 }}
                transition={{ delay: 1 }}
                style={{
                  color: "#ffffff",
                  fontSize: "11px",
                  fontFamily: "monospace",
                  letterSpacing: "0.2em",
                }}
              >
                {Math.round(progress)}%
              </motion.span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div
        style={{
          position: "absolute",
          top: isMobile ? "1rem" : "2.5rem",
          left: isMobile ? "1rem" : "2.5rem",
          zIndex: 6000,
          display: "flex",
          alignItems: "center",
          gap: isMobile ? "8px" : "15px",
        }}
      >
        <a
          href="/blog/memory-tree"
          style={{
            background: "rgba(255, 255, 255, 0.03)",
            backdropFilter: "blur(25px) saturate(180%)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            color: "white",
            padding: isMobile ? "0.6rem 1rem" : "1rem 2.2rem",
            borderRadius: isMobile ? "12px" : "16px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: isMobile ? "6px" : "12px",
            fontSize: isMobile ? "8px" : "10px",
            fontWeight: 900,
            letterSpacing: "0.3em",
            textDecoration: "none",
            transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
            boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
          }}
        >
          <ArrowLeft size={isMobile ? 12 : 16} strokeWidth={3} /> 返回文章
        </a>

        <div
          style={{
            background: "rgba(255, 255, 255, 0.03)",
            backdropFilter: "blur(30px) saturate(180%)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            color: "white",
            borderRadius: isMobile ? "12px" : "16px",
            padding: isMobile ? "0.4rem 0.6rem" : "0.6rem 1rem",
            display: "flex",
            alignItems: "center",
            gap: "15px",
            boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.2)",
          }}
        >
          <button
            onClick={handlePrev}
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              cursor: "pointer",
              padding: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "28px",
              height: "28px",
              borderRadius: "50%",
              color: "white",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.12)";
              e.currentTarget.style.borderColor = "rgba(0, 255, 255, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.15)";
            }}
          >
            <SkipForward size={11} style={{ transform: "rotate(180deg)" }} />
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "44px",
              height: "44px",
              position: "relative",
            }}
          >
            <div
              style={{
                width: "44px",
                height: "44px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #1a1a1a, #2d2d2d)",
                border: "2px solid rgba(255, 255, 255, 0.2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
                animation: isPlaying ? "spin 3s linear infinite" : "none",
                boxShadow: isPlaying
                  ? "0 0 20px rgba(255, 20, 147, 0.4), inset 0 0 15px rgba(0, 0, 0, 0.5)"
                  : "0 0 10px rgba(0, 0, 0, 0.3), inset 0 0 15px rgba(0, 0, 0, 0.5)",
                transition: "box-shadow 0.3s ease",
              }}
            >
              <div
                style={{
                  width: "30px",
                  height: "30px",
                  borderRadius: "50%",
                  background: "radial-gradient(circle at center, #333 0%, #1a1a1a 40%, #000 100%)",
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div
                  style={{
                    width: "10px",
                    height: "10px",
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #ff1493, #00ffff)",
                    boxShadow: "0 0 8px rgba(255, 20, 147, 0.6)",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    width: "100%",
                    height: "100%",
                    borderRadius: "50%",
                    background: "repeating-radial-gradient(circle at center, transparent 0px, transparent 3px, rgba(255,255,255,0.03) 3px, rgba(255,255,255,0.03) 4px)",
                  }}
                />
              </div>
            </div>
            <div
              style={{
                position: "absolute",
                color: "white",
                opacity: isPlaying ? 0 : 0.9,
                transition: "opacity 0.3s ease",
                pointerEvents: "none",
              }}
            >
              <Play size={14} style={{ marginLeft: "2px" }} />
            </div>
          </button>
          <button
            onClick={handleNext}
            style={{
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              cursor: "pointer",
              padding: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "28px",
              height: "28px",
              borderRadius: "50%",
              color: "white",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.12)";
              e.currentTarget.style.borderColor = "rgba(0, 255, 255, 0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)";
              e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.15)";
            }}
          >
            <SkipForward size={11} />
          </button>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              minWidth: "100px",
            }}
          >
            <span
              style={{
                fontSize: "11px",
                fontWeight: 900,
                letterSpacing: "0.05em",
                whiteSpace: "nowrap",
              }}
            >
              {MUSIC_LIST[currentTrack].title}
            </span>
            <span style={{ fontSize: "9px", fontWeight: 500, opacity: 0.5 }}>
              {currentTrack + 1} / {MUSIC_LIST.length}
            </span>
          </div>
        </div>
      </div>

      <audio ref={audioRef} src={MUSIC_LIST[currentTrack].src} loop />

      <Canvas
        dpr={isMobile ? [1, 1.2] : [1, 1.5]}
        camera={{ position: isMobile ? [0, 20, 100] : [0, 15, 80], fov: isMobile ? 50 : 42 }}
        gl={{ alpha: false, antialias: !isMobile, logarithmicDepthBuffer: true }}
      >
        <color attach="background" args={["#000000"]} />
        <Suspense fallback={null}>
          <fog attach="fog" args={["#000000", 30, 150]} />
          <group position={[0, -12, 0]}>
            <ParticleWave />
            <StarDust />
            <EnergyBeam />
            <RadiantTree />
            <LuminousPedestal />
            <KleinBottle />
            {PHOTO_DATA.map((p, i) => (
              <MediaNode
                key={p.id}
                photo={p}
                position={photoPositions[i]}
                onSelect={handleSelect}
              />
            ))}
          </group>
        </Suspense>
        <OrbitControls
          enablePan={false}
          autoRotate
          autoRotateSpeed={isMobile ? 0.15 : 0.3}
          maxPolarAngle={Math.PI / 2 + 0.12}
          minDistance={isMobile ? 60 : 45}
          maxDistance={isMobile ? 130 : 110}
          enableZoom={true}
          zoomSpeed={isMobile ? 0.5 : 1}
        />
      </Canvas>

      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 7000,
              backgroundColor: "rgba(0,0,0,0.7)",
              backdropFilter: "blur(40px) saturate(200%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "2rem",
            }}
            onClick={() => {
              setSelectedPhoto(null);
              setSelectedAlbum(null);
              setCurrentPhotoIndex(0);
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.95 }}
              style={{
                position: "relative",
                background: "rgba(10, 10, 20, 0.4)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                borderLeft: "2px solid rgba(0, 255, 255, 0.2)",
                borderTop: "1px solid rgba(255, 182, 193, 0.15)",
                borderRadius: "32px",
                overflow: "hidden",
                maxWidth: "1150px",
                width: "100%",
                display: "flex",
                flexDirection: isMobile ? "column" : "row",
                height: isMobile ? "90vh" : "80vh",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.8)",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
            onClick={() => {
              setSelectedPhoto(null);
              setSelectedAlbum(null);
              setCurrentPhotoIndex(0);
            }}
                style={{
                  position: "absolute",
                  top: "2rem",
                  right: "2rem",
                  zIndex: 8000,
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  color: "white",
                  width: "45px",
                  height: "45px",
                  borderRadius: "50%",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backdropFilter: "blur(10px)",
                }}
              >
                <X size={20} />
              </button>

              <div
                style={{
                  flex: isMobile ? "none" : 1.6,
                  height: isMobile ? "45%" : "auto",
                  background: "#000",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  position: "relative",
                  overflow: "hidden",
                  minHeight: isMobile ? "200px" : "auto",
                }}
              >
                {selectedAlbum && selectedAlbum.photos.length > 1 && (
                  <button
                    onClick={() => setCurrentPhotoIndex((prev) => (prev - 1 + selectedAlbum.photos.length) % selectedAlbum.photos.length)}
                    style={{
                      position: "absolute",
                      left: "1rem",
                      zIndex: 10,
                      background: "rgba(255, 255, 255, 0.1)",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      color: "white",
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    <SkipForward size={16} style={{ transform: "rotate(180deg)" }} />
                  </button>
                )}
                {selectedAlbum ? (
                  selectedAlbum.photos[currentPhotoIndex].type === "video" ? (
                    <video
                      ref={videoRef}
                      src={selectedAlbum.photos[currentPhotoIndex].url}
                      autoPlay
                      loop
                      controls
                      style={{ maxHeight: "100%", maxWidth: "100%" }}
                    />
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={selectedAlbum.photos[currentPhotoIndex].url}
                      alt={selectedPhoto.title}
                      style={{
                        maxHeight: "100%",
                        maxWidth: "100%",
                        objectFit: "contain",
                        transform: selectedAlbum.photos[currentPhotoIndex].rotate
                          ? `rotate(${selectedAlbum.photos[currentPhotoIndex].rotate}deg)`
                          : "none",
                        transition: "transform 0.4s ease",
                      }}
                    />
                  )
                ) : selectedPhoto.type === "video" ? (
                  <video
                    ref={videoRef}
                    src={selectedPhoto.url}
                    autoPlay
                    loop
                    controls
                    style={{ maxHeight: "100%", maxWidth: "100%" }}
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={selectedPhoto.url}
                    alt={selectedPhoto.title}
                    style={{
                      maxHeight: "100%",
                      maxWidth: "100%",
                      objectFit: "contain",
                      transform: selectedPhoto.rotate
                        ? `rotate(${selectedPhoto.rotate}deg)`
                        : "none",
                      transition: "transform 0.4s ease",
                    }}
                  />
                )}
                {selectedAlbum && selectedAlbum.photos.length > 1 && (
                  <button
                    onClick={() => setCurrentPhotoIndex((prev) => (prev + 1) % selectedAlbum.photos.length)}
                    style={{
                      position: "absolute",
                      right: "1rem",
                      zIndex: 10,
                      background: "rgba(255, 255, 255, 0.1)",
                      border: "1px solid rgba(255, 255, 255, 0.2)",
                      color: "white",
                      width: "40px",
                      height: "40px",
                      borderRadius: "50%",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    <SkipForward size={16} />
                  </button>
                )}
              </div>

              <div
                style={{
                  flex: 1,
                  padding: isMobile ? "1.5rem" : "4rem 3rem",
                  color: "white",
                  display: "flex",
                  flexDirection: "column",
                  height: isMobile ? "55%" : "100%",
                  position: "relative",
                  overflowY: "auto",
                }}
              >
                <div
                  style={{
                    color: "#ff1493",
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    marginBottom: "1.5rem",
                    flexShrink: 0,
                  }}
                >
                  <Sparkles size={16} />
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: 900,
                      letterSpacing: "0.4em",
                    }}
                  >
                    精神印记
                  </span>
                </div>
                <h2
                  style={{
                    fontSize: "2.5rem",
                    fontWeight: 900,
                    marginBottom: "1.5rem",
                    lineHeight: 1,
                    letterSpacing: "-0.02em",
                    whiteSpace: "pre-line",
                    flexShrink: 0,
                  }}
                >
                  {selectedPhoto.title}
                </h2>
                {selectedAlbum?.description && (
                  <div
                    style={{
                      fontSize: "14px",
                      fontWeight: 400,
                      lineHeight: 1.8,
                      opacity: 0.7,
                      marginBottom: "1.5rem",
                      flexShrink: 0,
                      borderLeft: "2px solid rgba(255, 20, 147, 0.3)",
                      paddingLeft: "1rem",
                    }}
                  >
                    {selectedAlbum.description}
                  </div>
                )}
                {selectedAlbum && selectedAlbum.photos[currentPhotoIndex]?.caption && (
                  <div
                    style={{
                      color: "#00ffff",
                      fontSize: "16px",
                      fontWeight: 600,
                      marginBottom: "1.5rem",
                      flexShrink: 0,
                    }}
                  >
                    {selectedAlbum.photos[currentPhotoIndex].caption}
                  </div>
                )}
                {selectedAlbum && selectedAlbum.photos.length > 1 && (
                  <div style={{ marginTop: "auto", flexShrink: 0 }}>
                    <div
                      style={{
                        fontSize: "10px",
                        opacity: 0.4,
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                        marginBottom: "12px",
                      }}
                    >
                      相册照片 ({currentPhotoIndex + 1}/{selectedAlbum.photos.length})
                    </div>
                    <div
                      style={{
                        display: "flex",
                        gap: "12px",
                        overflowX: "auto",
                        paddingBottom: "8px",
                      }}
                    >
                      {selectedAlbum.photos.map((photo, index) => (
                        <div
                          key={index}
                          onClick={() => setCurrentPhotoIndex(index)}
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: "6px",
                            cursor: "pointer",
                            flexShrink: 0,
                          }}
                        >
                          <div
                            style={{
                              width: "64px",
                              height: "64px",
                              borderRadius: "10px",
                              overflow: "hidden",
                              border: index === currentPhotoIndex
                                ? "2px solid #ff1493"
                                : "2px solid rgba(255, 255, 255, 0.1)",
                              transition: "all 0.3s ease",
                              boxShadow: index === currentPhotoIndex
                                ? "0 0 12px rgba(255, 20, 147, 0.4)"
                                : "none",
                            }}
                          >
                            {photo.type === "video" ? (
                              <div
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  background: "rgba(255, 255, 255, 0.1)",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                <Play size={16} />
                              </div>
                            ) : (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={photo.url}
                                alt={`Photo ${index + 1}`}
                                style={{
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                }}
                              />
                            )}
                          </div>
                          {photo.caption && (
                            <span
                              style={{
                                fontSize: "9px",
                                color: index === currentPhotoIndex ? "#ff1493" : "rgba(255, 255, 255, 0.5)",
                                textAlign: "center",
                                maxWidth: "70px",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                transition: "color 0.3s ease",
                              }}
                            >
                              {photo.caption.split(" — ")[1] || photo.caption}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
