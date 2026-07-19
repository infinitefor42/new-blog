"use client";

import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { COLORS } from "./constants";

function PartSet({
  count,
  texture,
  speedMult,
}: {
  count: number;
  texture: THREE.Texture;
  speedMult: number;
}) {
  const meshRef = useRef<THREE.Points>(null);
  const pos = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 25 + Math.random() * 65;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
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
}

export default function StarDust() {
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
}
