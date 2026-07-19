"use client";

import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { COLORS } from "./constants";

const COUNT = 18000;

export default function EnergyBeam() {
  const meshRef = useRef<THREE.Points>(null);
  const [pos, colors] = useMemo(() => {
    const p = new Float32Array(COUNT * 3);
    const c = new Float32Array(COUNT * 3);
    const tmpColor = new THREE.Color();
    for (let i = 0; i < COUNT; i++) {
      const h = Math.random() * 32.5 - 11.5;
      const rBase = Math.pow(Math.random(), 5.0) * 1.5;
      const angle = Math.random() * Math.PI * 2;
      p[i * 3] = Math.cos(angle) * rBase;
      p[i * 3 + 1] = h;
      p[i * 3 + 2] = Math.sin(angle) * rBase;
      tmpColor.copy(COLORS.STAR_WHITE);
      if (rBase > 0.6) tmpColor.lerp(COLORS.HOT_PINK, 0.4);
      c[i * 3] = tmpColor.r;
      c[i * 3 + 1] = tmpColor.g;
      c[i * 3 + 2] = tmpColor.b;
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
}
