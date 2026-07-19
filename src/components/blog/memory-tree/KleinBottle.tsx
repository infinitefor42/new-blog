"use client";

import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const COUNT = 12000;

export default function KleinBottle() {
  const meshRef = useRef<THREE.Points>(null);
  const pos = useMemo(() => {
    const p = new Float32Array(COUNT * 3);
    const c = new Float32Array(COUNT * 3);
    const a = 3;
    const scale = 1.2;
    const tmpColor = new THREE.Color();

    for (let i = 0; i < COUNT; i++) {
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
      tmpColor.setHSL(0.55 + t * 0.15, 0.8, 0.6 + t * 0.2);
      c[i * 3] = tmpColor.r;
      c[i * 3 + 1] = tmpColor.g;
      c[i * 3 + 2] = tmpColor.b;
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
        <bufferAttribute attach="attributes-color" args={[pos.colors, 3]} />
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
}
