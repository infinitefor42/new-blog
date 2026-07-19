"use client";

import React, { useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { useTexture, useVideoTexture } from "@react-three/drei";
import * as THREE from "three";
import { _vec3a } from "./constants";
import type { Photo } from "@/config/photos";

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

export { getNebulaPos };

function LazyMaterial({ photo }: { photo: Photo }) {
  const texture =
    photo.type === "video"
      ? useVideoTexture(photo.url, {
          muted: true,
          loop: true,
          start: true,
          crossOrigin: "Anonymous",
        })
      : useTexture(photo.url);

  return <meshBasicMaterial map={texture} transparent opacity={1} fog={false} />;
}

export default function MediaNode({
  photo,
  position,
  onSelect,
}: {
  photo: Photo;
  position: [number, number, number];
  onSelect: (photo: Photo) => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const distanceRef = useRef(100);
  const { camera } = useThree();

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
      _vec3a.set(targetScale, targetScale, targetScale);
      meshRef.current.scale.lerp(_vec3a, 0.1);

      const dx = camera.position.x - position[0];
      const dy = camera.position.y - position[1];
      const dz = camera.position.z - position[2];
      distanceRef.current = Math.sqrt(dx * dx + dy * dy + dz * dz);

      const visible = distanceRef.current < 120;
      if (visible !== isVisible) setIsVisible(visible);
      if (distanceRef.current < 80 && !shouldLoad) setShouldLoad(true);
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
      {shouldLoad && isVisible ? (
        <LazyMaterial photo={photo} />
      ) : (
        <meshBasicMaterial
          color={hovered ? "#ff1493" : "#222233"}
          transparent
          opacity={hovered ? 0.8 : 0.5}
          fog={false}
        />
      )}
      <mesh position={[0, 0, -0.01]}>
        <planeGeometry args={[3.8, 5.6]} />
        <meshBasicMaterial
          color={hovered ? "#ff1493" : "#ffffff"}
          transparent
          opacity={hovered ? 0.4 : 0.15}
          fog={false}
        />
      </mesh>
    </mesh>
  );
}
