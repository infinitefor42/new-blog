"use client";

import React, { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const COUNT = 35000;

export default function ParticleWave() {
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
    const p = new Float32Array(COUNT * 3);
    const o = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
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
    const arr = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) arr[i] = (Math.random() - 0.5) * 0.8;
    return arr;
  }, []);

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.elapsedTime;
      const posAttr = meshRef.current.geometry.attributes
        .position as THREE.BufferAttribute;
      for (let i = 0; i < COUNT; i++) {
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
}
