"use client";

import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { COLORS } from "./constants";

const COUNT = 9000;

export default function LuminousPedestal() {
  const meshRef = useRef<THREE.Points>(null);
  const [pos, colors] = useMemo(() => {
    const p = new Float32Array(COUNT * 3);
    const c = new Float32Array(COUNT * 3);
    const tmpColor = new THREE.Color();
    for (let i = 0; i < COUNT; i++) {
      const r = 8.5 + Math.random() * 32.0;
      const theta = Math.random() * Math.PI * 2;
      p[i * 3] = Math.cos(theta) * r;
      p[i * 3 + 1] = (Math.random() - 0.5) * 1.2 - 11.5;
      p[i * 3 + 2] = Math.sin(theta) * r;
      tmpColor.copy(COLORS.HOT_PINK).lerp(
        COLORS.VIOLET,
        Math.random() * 0.5
      );
      c[i * 3] = tmpColor.r;
      c[i * 3 + 1] = tmpColor.g;
      c[i * 3 + 2] = tmpColor.b;
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
}
