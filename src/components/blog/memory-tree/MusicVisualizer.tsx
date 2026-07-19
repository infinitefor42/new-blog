"use client";

import React from "react";
import { motion } from "framer-motion";
import { Music } from "lucide-react";

export default function MusicVisualizer({ isPlaying }: { isPlaying: boolean }) {
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
