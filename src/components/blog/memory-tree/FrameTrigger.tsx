"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

export default function FrameTrigger({ onFirstFrame }: { onFirstFrame: () => void }) {
  const triggered = useRef(false);
  useFrame(() => {
    if (!triggered.current) {
      triggered.current = true;
      setTimeout(onFirstFrame, 0);
    }
  });
  return null;
}
