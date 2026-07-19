"use client";

import React, { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { COLORS } from "./constants";

const POINTS_COUNT = 95000;

export default function RadiantTree() {
  const { positions, colors, finalCount } = useMemo(() => {
    const p = new Float32Array(POINTS_COUNT * 3);
    const c = new Float32Array(POINTS_COUNT * 3);
    const numTiers = 6;
    let ptr = 0;
    const tmpColor = new THREE.Color();
    for (let i = 0; i < POINTS_COUNT; i++) {
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
      tmpColor.copy(COLORS.STAR_WHITE);
      const rNorm = r / (maxR + 0.001);
      if (rNorm > 0.88) {
        const rand = Math.random();
        if (rand > 0.6) tmpColor.lerp(COLORS.CYAN, 0.6);
        else tmpColor.lerp(COLORS.HOT_PINK, 0.8);
      } else {
        tmpColor.lerp(
          COLORS.HOT_PINK,
          THREE.MathUtils.smoothstep(rNorm, 0.1, 0.8) * 0.8
        );
      }
      tmpColor.multiplyScalar(1.0 + (1.0 - rNorm) * 1.5);
      c[ptr * 3] = tmpColor.r;
      c[ptr * 3 + 1] = tmpColor.g;
      c[ptr * 3 + 2] = tmpColor.b;
      ptr++;
      if (ptr >= POINTS_COUNT) break;
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
}
