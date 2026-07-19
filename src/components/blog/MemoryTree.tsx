"use client";

import React, {
  useRef,
  useState,
  Suspense,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { AnimatePresence, motion } from "framer-motion";
import {
  X,
  ArrowLeft,
  Sparkles,
  Play,
  SkipForward,
} from "lucide-react";
import { PHOTO_DATA, ALBUM_DATA, type Photo, type Album } from "@/config/photos";
import { MUSIC_LIST } from "./memory-tree/constants";
import ParticleWave from "./memory-tree/ParticleWave";
import StarDust from "./memory-tree/StarDust";
import EnergyBeam from "./memory-tree/EnergyBeam";
import RadiantTree from "./memory-tree/RadiantTree";
import LuminousPedestal from "./memory-tree/LuminousPedestal";
import KleinBottle from "./memory-tree/KleinBottle";
import MediaNode, { getNebulaPos } from "./memory-tree/MediaNode";
import MusicVisualizer from "./memory-tree/MusicVisualizer";
import FrameTrigger from "./memory-tree/FrameTrigger";

export default function MemoryTree({
  onPhotoClick,
}: {
  onPhotoClick?: (photo: Photo) => void;
}) {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [canvasReady, setCanvasReady] = useState(false);
  const [progress, setProgress] = useState(0);
  const [forceLoad, setForceLoad] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  // 10s timeout force-show
  useEffect(() => {
    const timer = setTimeout(() => setForceLoad(true), 10000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.src = MUSIC_LIST[currentTrack].src;
    if (isPlaying) audioRef.current.play().catch(() => {});
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

  // Simulated progress
  const startTimeRef = useRef(performance.now());

  useEffect(() => {
    const startTime = startTimeRef.current;
    const minLoadTime = 3500;

    if (canvasReady) {
      const interval = setInterval(() => {
        const elapsed = performance.now() - startTime;
        const minProgress = Math.min((elapsed / minLoadTime) * 100, 100);

        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          const target = Math.max(minProgress, prev + 0.5);
          const next = prev + (target - prev) * 0.1;
          return next >= 100 ? 100 : Math.max(prev, next);
        });
      }, 30);
      return () => clearInterval(interval);
    } else {
      const interval = setInterval(() => {
        const elapsed = (performance.now() - startTime) / 1000;
        const t = Math.min(elapsed / 3.0, 1);
        const eased = t < 0.3
          ? 2 * t * t
          : 1 - Math.pow(-2 * t + 2, 3) / 2;
        const simulated = eased * 85;
        setProgress((prev) => (prev < 85 ? Math.max(prev, simulated) : prev));
      }, 50);
      return () => clearInterval(interval);
    }
  }, [canvasReady]);

  const isLoaded = progress >= 100 || forceLoad;

  // Temporarily override page background while MemoryTree is mounted
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `body, #root { background: black !important; } canvas { background: black !important; }`;
    document.head.appendChild(style);
    return () => { document.head.removeChild(style); };
  }, []);

  // Auto-play music on load
  useEffect(() => {
    if (isLoaded) setIsPlaying(true);
  }, [isLoaded]);

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
            transition={{ duration: 0.6, ease: "easeOut" }}
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
                animate={{ opacity: 0.6 }}
                transition={{ duration: 0.5 }}
                style={{
                  color: "#ffffff",
                  fontSize: "12px",
                  fontFamily: "monospace",
                  letterSpacing: "0.2em",
                  minWidth: "40px",
                  textAlign: "center",
                }}
              >
                {Math.round(progress)}%
              </motion.span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation bar */}
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

        {/* Music controls */}
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
            className="mt-btn-icon"
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
          >
            <SkipForward size={11} style={{ transform: "rotate(180deg)" }} />
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="mt-btn-play"
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
            className="mt-btn-icon"
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
          >
            <SkipForward size={11} />
          </button>

          <div style={{ display: "flex", flexDirection: "column", minWidth: "100px" }}>
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
            <MusicVisualizer isPlaying={isPlaying} />
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
        <FrameTrigger onFirstFrame={() => setCanvasReady(true)} />
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

      {/* Photo viewer modal */}
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
