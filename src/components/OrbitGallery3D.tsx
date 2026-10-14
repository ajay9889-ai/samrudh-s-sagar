"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Image from "next/image";
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  RotateCcw,
  Eye,
  FileText,
  Download,
  Volume2,
  VolumeX,
  Compass,
} from "lucide-react";
import { ProjectModalData } from "./ProjectGalleryModal";

interface OrbitGallery3DProps {
  projects: ProjectModalData[];
  onSelectProject: (project: ProjectModalData) => void;
}

export function OrbitGallery3D({ projects, onSelectProject }: OrbitGallery3DProps) {
  if (!projects || projects.length === 0) return null;

  return <OrbitGalleryInner projects={projects} onSelectProject={onSelectProject} />;
}

function OrbitGalleryInner({
  projects,
  onSelectProject,
}: {
  projects: ProjectModalData[];
  onSelectProject: (project: ProjectModalData) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [rotateSpeed, setRotateSpeed] = useState<number>(0.16); // deg per frame
  const [viewMode, setViewMode] = useState<"cylinder" | "arc">("cylinder");
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  const [tilt, setTilt] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [containerWidth, setContainerWidth] = useState<number>(1000);

  // Audio synthesizer ref
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Physics refs
  const dragStartXRef = useRef<number>(0);
  const dragStartRotationRef = useRef<number>(0);
  const lastXRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const velocityRef = useRef<number>(0);
  const animFrameRef = useRef<number | null>(null);
  const hasMovedRef = useRef<boolean>(false);
  const lastSnappedIndexRef = useRef<number>(-1);

  const N = projects.length;
  const stepAngle = 360 / N;

  // Responsive radius calculation
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const radius = useMemo(() => {
    if (containerWidth < 480) return 210;
    if (containerWidth < 768) return 270;
    if (containerWidth < 1024) return 350;
    return 420;
  }, [containerWidth]);

  // Web Audio Synth for futuristic UI feedback
  const playOrbitTick = useCallback((pitch = 640) => {
    if (!soundEnabled) return;
    try {
      if (!audioCtxRef.current) {
        const AudioContextClass =
          window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new AudioContextClass();
      }
      if (audioCtxRef.current.state === "suspended") {
        audioCtxRef.current.resume();
      }
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(pitch, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(pitch * 0.5, ctx.currentTime + 0.06);

      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.06);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.07);
    } catch {
      // Audio not permitted or failed
    }
  }, [soundEnabled]);

  // Normalize angle to -180 to 180
  const getNormalizedAngle = useCallback((angle: number) => {
    return ((((angle % 360) + 540) % 360) - 180);
  }, []);

  // Determine currently focused index (card closest to 0 deg front)
  const activeIndex = useMemo(() => {
    let closestIdx = 0;
    let minDiff = 9999;
    for (let i = 0; i < N; i++) {
      const cardAngle = rotation + i * stepAngle;
      const diff = Math.abs(getNormalizedAngle(cardAngle));
      if (diff < minDiff) {
        minDiff = diff;
        closestIdx = i;
      }
    }
    return closestIdx;
  }, [rotation, N, stepAngle, getNormalizedAngle]);

  // Audio tick when active card changes
  useEffect(() => {
    if (lastSnappedIndexRef.current !== -1 && lastSnappedIndexRef.current !== activeIndex) {
      playOrbitTick(720);
    }
    lastSnappedIndexRef.current = activeIndex;
  }, [activeIndex, playOrbitTick]);

  // Auto-rotation continuous loop
  useEffect(() => {
    if (!autoRotate || isDragging) return;

    let localFrame: number;
    const loop = () => {
      setRotation((prev) => (prev - rotateSpeed) % 360);
      localFrame = requestAnimationFrame(loop);
    };
    localFrame = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(localFrame);
  }, [autoRotate, isDragging, rotateSpeed]);

  // Pointer drag handling
  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    hasMovedRef.current = false;
    dragStartXRef.current = e.clientX;
    dragStartRotationRef.current = rotation;
    lastXRef.current = e.clientX;
    lastTimeRef.current = performance.now();
    velocityRef.current = 0;

    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) {
      // Mouse tilt parallax on the 3D stage when not dragging
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const normX = (e.clientX - rect.left) / rect.width - 0.5;
        const normY = (e.clientY - rect.top) / rect.height - 0.5;
        setTilt({
          x: -normY * 8, // subtle tilt up/down
          y: normX * 10, // subtle tilt left/right
        });
      }
      return;
    }

    const deltaX = e.clientX - dragStartXRef.current;
    if (Math.abs(deltaX) > 4) {
      hasMovedRef.current = true;
    }

    const sensitivity = containerWidth < 768 ? 0.35 : 0.25;
    setRotation(dragStartRotationRef.current + deltaX * sensitivity);

    const now = performance.now();
    const dt = Math.max(now - lastTimeRef.current, 8);
    const dx = e.clientX - lastXRef.current;
    velocityRef.current = (dx / dt) * 12;

    lastXRef.current = e.clientX;
    lastTimeRef.current = now;
  };

  const handlePointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);

    let currentVel = velocityRef.current;
    const friction = 0.93;

    const stepInertia = () => {
      if (Math.abs(currentVel) > 0.12) {
        currentVel *= friction;
        setRotation((prev) => prev + currentVel * 0.35);
        animFrameRef.current = requestAnimationFrame(stepInertia);
      } else {
        snapToNearest();
      }
    };

    if (Math.abs(currentVel) > 0.4) {
      animFrameRef.current = requestAnimationFrame(stepInertia);
    } else {
      snapToNearest();
    }
  };

  // Smooth snap to target card angle
  const rotateToCard = useCallback(
    (index: number) => {
      const targetDelta = -index * stepAngle;
      const currentMod = rotation % 360;
      let diff = (targetDelta - currentMod) % 360;
      if (diff > 180) diff -= 360;
      if (diff < -180) diff += 360;

      const targetRotation = rotation + diff;

      const startRot = rotation;
      const startTime = performance.now();
      const duration = 480;

      const animateSnap = (now: number) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        setRotation(startRot + diff * ease);

        if (progress < 1) {
          animFrameRef.current = requestAnimationFrame(animateSnap);
        } else {
          setRotation(targetRotation % 360);
        }
      };

      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = requestAnimationFrame(animateSnap);
      playOrbitTick(880);
    },
    [rotation, stepAngle, playOrbitTick]
  );

  const snapToNearest = useCallback(() => {
    rotateToCard(activeIndex);
  }, [rotateToCard, activeIndex]);

  const handlePrev = () => {
    const nextIdx = (activeIndex - 1 + N) % N;
    rotateToCard(nextIdx);
  };

  const handleNext = () => {
    const nextIdx = (activeIndex + 1) % N;
    rotateToCard(nextIdx);
  };

  const activeProject = projects[activeIndex] || projects[0];
  const compassDegree = Math.round(((((-rotation) % 360) + 360) % 360));

  return (
    <div
      ref={containerRef}
      className="relative w-full select-none overflow-hidden bg-[#ECECEC] dark:bg-[#141414] border border-[#BDBDBD] dark:border-[#262626] text-[#111111] dark:text-white transition-colors duration-200 py-6 sm:py-8 px-3 sm:px-6 mb-12 flat-box"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={() => {
        if (isDragging) handlePointerUp();
        setTilt({ x: 0, y: 0 });
      }}
      style={{ touchAction: "pan-y" }}
    >
      {/* BACKGROUND AMBIENCE: Tech Grid & Subtle Radial Glow (adaptive to theme) */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40 dark:opacity-20 transition-opacity"
        style={{
          backgroundImage: `
            radial-gradient(circle at 50% 40%, rgba(0, 161, 156, 0.18) 0%, transparent 60%),
            radial-gradient(circle at 80% 90%, rgba(128, 20, 43, 0.12) 0%, transparent 50%),
            linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px)
          `,
          backgroundSize: "100% 100%, 100% 100%, 48px 48px, 48px 48px",
        }}
      />

      {/* TOP HUD BAR: Realtime telemetry, compass & quick switches */}
      <div className="relative z-30 flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#BDBDBD] dark:border-[#262626]">
        {/* Left: Orbit Status & Mode Tag */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-2.5 py-1 bg-white dark:bg-[#1E1E1E] border border-[#BDBDBD] dark:border-[#333333] text-[10px] font-heading font-bold uppercase tracking-[0.2em] flat-box">
            <span
              className={`w-2 h-2 rounded-full ${
                autoRotate && !isDragging
                  ? "bg-[#00A19C] dark:bg-[#00D1C7] animate-pulse"
                  : isDragging
                  ? "bg-[#80142B] dark:bg-[#E03B5B]"
                  : "bg-[#888888]"
              }`}
            />
            <span className="text-[#333333] dark:text-white/80">
              {isDragging ? "ORBIT SCRUB" : autoRotate ? "AUTO-ORBIT" : "MANUAL FOCUS"}
            </span>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-[10px] font-heading tracking-widest text-[#666666] dark:text-white/50">
            <Compass className="w-3.5 h-3.5 text-[#00A19C]" />
            <span>BEARING {String(compassDegree).padStart(3, "0")}°</span>
            <span className="text-black/20 dark:text-white/20">|</span>
            <span>SLOT [{String(activeIndex + 1).padStart(2, "0")}/{String(N).padStart(2, "0")}]</span>
          </div>
        </div>

        {/* Right: Controls (View geometry, Audio toggle, Auto speed, Reset) */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Mode Switch: 360 Cylinder vs 180 Arc */}
          <div className="flex items-center bg-white dark:bg-[#1E1E1E] border border-[#BDBDBD] dark:border-[#333333] p-0.5 flat-box">
            <button
              onClick={() => setViewMode("cylinder")}
              className={`px-2 py-1 text-[9px] font-heading font-bold uppercase tracking-wider transition-colors flat-box ${
                viewMode === "cylinder"
                  ? "bg-[#00A19C] text-white"
                  : "text-[#666666] dark:text-white/50 hover:text-[#111111] dark:hover:text-white"
              }`}
              title="Full 360° Cylindrical Orbit"
            >
              360° ORBIT
            </button>
            <button
              onClick={() => setViewMode("arc")}
              className={`px-2 py-1 text-[9px] font-heading font-bold uppercase tracking-wider transition-colors flat-box ${
                viewMode === "arc"
                  ? "bg-[#00A19C] text-white"
                  : "text-[#666666] dark:text-white/50 hover:text-[#111111] dark:hover:text-white"
              }`}
              title="180° Curved Stage Arc"
            >
              180° ARC
            </button>
          </div>

          {/* Sound FX Button */}
          <button
            onClick={() => setSoundEnabled((prev) => !prev)}
            aria-label={soundEnabled ? "Mute audio fx" : "Enable audio fx"}
            className={`p-1.5 border transition-colors flat-box cursor-pointer ${
              soundEnabled
                ? "bg-[#00A19C]/20 border-[#00A19C] text-[#00A19C] dark:text-[#00D1C7]"
                : "bg-white dark:bg-[#1E1E1E] border-[#BDBDBD] dark:border-[#333333] text-[#666666] dark:text-white/40 hover:text-[#111111] dark:hover:text-white"
            }`}
            title="Futuristic Orbit Haptic Clicks"
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>

          {/* Auto-rotate Toggle */}
          <button
            onClick={() => setAutoRotate((prev) => !prev)}
            aria-label={autoRotate ? "Pause orbit" : "Start auto-orbit"}
            className="flex items-center gap-1 px-2.5 py-1 bg-white dark:bg-[#1E1E1E] hover:bg-[#F2F2F2] dark:hover:bg-[#252525] border border-[#BDBDBD] dark:border-[#333333] text-[9px] font-heading font-bold uppercase tracking-wider text-[#111111] dark:text-white transition-colors flat-box cursor-pointer"
          >
            {autoRotate ? (
              <>
                <Pause className="w-3 h-3 text-[#80142B] dark:text-[#E03B5B]" />
                <span className="hidden sm:inline">PAUSE</span>
              </>
            ) : (
              <>
                <Play className="w-3 h-3 text-[#00A19C] dark:text-[#00D1C7]" />
                <span className="hidden sm:inline">AUTOROTATE</span>
              </>
            )}
          </button>

          {/* Speed Toggle (when auto-rotating) */}
          {autoRotate && (
            <button
              onClick={() => setRotateSpeed((prev) => (prev > 0.22 ? 0.1 : prev > 0.12 ? 0.28 : 0.16))}
              className="px-2 py-1 bg-white dark:bg-[#1E1E1E] border border-[#BDBDBD] dark:border-[#333333] hover:border-[#00A19C] text-[9px] font-heading font-bold tracking-wider text-[#444444] dark:text-white/70 transition-colors flat-box cursor-pointer"
              title="Change rotation velocity"
            >
              {rotateSpeed > 0.22 ? "2X SPEED" : rotateSpeed > 0.12 ? "1X SPEED" : "0.5X SLOW"}
            </button>
          )}

          {/* Reset Orbit Angle */}
          <button
            onClick={() => rotateToCard(0)}
            aria-label="Reset orbit angle"
            className="p-1.5 bg-white dark:bg-[#1E1E1E] border border-[#BDBDBD] dark:border-[#333333] text-[#666666] dark:text-white/50 hover:text-[#111111] dark:hover:text-white hover:border-[#00A19C] transition-colors flat-box cursor-pointer"
            title="Reset orbit angle"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 3D ORBITAL STAGE */}
      <div
        className="relative w-full h-[380px] sm:h-[440px] md:h-[480px] flex items-center justify-center cursor-grab active:cursor-grabbing overflow-visible my-3"
        style={{
          perspective: "1100px",
          perspectiveOrigin: "50% 48%",
        }}
      >
        {/* HOLOGRAPHIC ORBITAL FLOOR DISK / RADAR */}
        <div
          className="absolute w-[340px] sm:w-[500px] md:w-[680px] h-[340px] sm:h-[500px] md:h-[680px] pointer-events-none transition-transform duration-300"
          style={{
            top: "68%",
            transform: `translate(-50%, -50%) rotateX(75deg) rotateZ(${-rotation}deg)`,
            left: "50%",
            transformStyle: "preserve-3d",
          }}
        >
          {/* Outer ring */}
          <div className="absolute inset-0 rounded-full border border-dashed border-[#00A19C]/40 animate-[spin_60s_linear_infinite]" />
          {/* Middle ring */}
          <div className="absolute inset-8 rounded-full border border-[#80142B]/30" />
          {/* Inner ring */}
          <div className="absolute inset-24 rounded-full border border-black/15 dark:border-white/10" />
          {/* Cardinal Axis Markers */}
          <div className="absolute inset-0 flex items-center justify-between text-[8px] font-heading font-bold text-black/30 dark:text-white/20 tracking-widest px-2">
            <span>270°</span>
            <span>090°</span>
          </div>
          <div className="absolute inset-0 flex flex-col items-center justify-between text-[8px] font-heading font-bold text-black/30 dark:text-white/20 tracking-widest py-2">
            <span>000° [N]</span>
            <span>180° [S]</span>
          </div>
          {/* Center radar glow */}
          <div className="absolute inset-1/3 rounded-full bg-gradient-to-tr from-[#00A19C]/20 via-transparent to-[#80142B]/15 blur-xl" />
        </div>

        {/* 3D ROTATING ORBIT CONTAINER */}
        <div
          className="relative w-full h-full flex items-center justify-center transition-transform"
          style={{
            transformStyle: "preserve-3d",
            transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
            transition: isDragging ? "none" : "transform 0.2s ease-out",
          }}
        >
          {projects.map((project, idx) => {
            const rawAngle = rotation + idx * stepAngle;
            // In arc mode, curve items into an amphitheater front arc
            const angle =
              viewMode === "arc"
                ? getNormalizedAngle(rawAngle) * 0.72
                : rawAngle;

            const norm = getNormalizedAngle(angle);
            const rad = (norm * Math.PI) / 180;
            const cosVal = Math.cos(rad);

            // Dynamic 3D depth factors
            const scale = Math.max(0.66, 1.0 - (Math.abs(norm) / 180) * 0.42);
            const opacity = Math.max(0.25, 0.98 - (Math.abs(norm) / 180) * 0.72);
            const blurAmount = Math.max(0, (Math.abs(norm) / 180) * 2.5);
            const zIndex = Math.round((cosVal + 1) * 500);
            const isCurrentActive = idx === activeIndex;

            // Compact card dimensions so it never collides with controls
            const cardWidth = containerWidth < 480 ? 180 : containerWidth < 768 ? 220 : 260;
            const cardHeight = Math.round(cardWidth * 1.34);

            return (
              <div
                key={project.id}
                onClick={(e) => {
                  e.stopPropagation();
                  if (hasMovedRef.current) return;
                  if (isCurrentActive) {
                    onSelectProject(project);
                  } else {
                    rotateToCard(idx);
                  }
                }}
                className={`absolute group cursor-pointer transition-shadow duration-300 ${
                  isCurrentActive
                    ? "ring-2 ring-[#00A19C] shadow-[0_10px_30px_rgba(0,161,156,0.35)] dark:shadow-[0_0_35px_rgba(0,161,156,0.45)]"
                    : ""
                }`}
                style={{
                  width: `${cardWidth}px`,
                  height: `${cardHeight}px`,
                  transformStyle: "preserve-3d",
                  transform: `rotateY(${angle}deg) translateZ(${radius}px) scale(${scale})`,
                  opacity,
                  filter: blurAmount > 0.4 ? `blur(${blurAmount}px)` : "none",
                  zIndex,
                  transition: isDragging ? "none" : "transform 0.12s ease-out, opacity 0.2s ease-out",
                }}
              >
                {/* 3D Card Shell */}
                <div className="relative w-full h-full bg-white dark:bg-[#161616] border border-[#BDBDBD] dark:border-[#2E2E2E] group-hover:border-[#00A19C] overflow-hidden flat-box flex flex-col justify-between shadow-sm">
                  {/* Card Artwork Image */}
                  <div className="relative w-full h-full overflow-hidden bg-[#111111]">
                    <Image
                      src={project.imageUrl}
                      alt={project.title}
                      fill
                      sizes="280px"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      priority={idx < 3}
                    />

                    {/* Gradient Overlay for high-end typographic legibility */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/20 pointer-events-none" />

                    {/* Top Badges */}
                    <div className="absolute top-2 left-2 right-2 flex items-center justify-between z-10">
                      <span className="px-1.5 py-0.5 bg-[#80142B] text-white font-heading text-[8px] font-bold uppercase tracking-wider">
                        {project.category}
                      </span>
                      <span className="px-1.5 py-0.5 bg-black/75 backdrop-blur-sm text-white font-heading text-[8px] font-bold tracking-widest border border-white/20">
                        #{String(idx + 1).padStart(2, "0")}
                      </span>
                    </div>

                    {/* Center "EXPLORE" Hover Cue (Active card) */}
                    {isCurrentActive && (
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-20 pointer-events-none">
                        <div className="px-3 py-1.5 bg-black/85 backdrop-blur-md border border-[#00A19C] text-white font-heading text-[9px] font-bold uppercase tracking-widest flex items-center gap-1.5">
                          <Eye className="w-3 h-3 text-[#00A19C]" />
                          <span>EXPAND GALLERY</span>
                        </div>
                      </div>
                    )}

                    {/* Bottom Card Caption */}
                    <div className="absolute bottom-0 left-0 right-0 p-2.5 z-10">
                      <div className="w-5 h-[2px] bg-[#00A19C] mb-1 transition-all group-hover:w-10" />
                      <h3 className="font-heading text-xs font-extrabold uppercase text-white truncate group-hover:text-[#00D1C7] transition-colors">
                        {project.title}
                      </h3>
                      <p className="font-body text-[9px] text-white/70 line-clamp-1 mt-0.5">
                        {project.description || "Portfolio graphic design asset"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Subsurface Floor Reflection */}
                <div
                  className="absolute left-0 right-0 top-[102%] h-[45px] overflow-hidden pointer-events-none opacity-20 dark:opacity-25 mt-0.5"
                  style={{
                    transform: "scaleY(-1)",
                    maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.7), transparent)",
                    WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,0.7), transparent)",
                  }}
                >
                  <Image
                    src={project.imageUrl}
                    alt=""
                    fill
                    className="object-cover blur-[1px]"
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* ORBITAL LEFT & RIGHT NAVIGATION BUTTONS */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            handlePrev();
          }}
          aria-label="Orbit previous project"
          className="absolute left-1 sm:left-3 top-1/2 -translate-y-1/2 z-40 p-2 sm:p-2.5 bg-white/90 dark:bg-black/80 hover:bg-[#80142B] dark:hover:bg-[#80142B] text-[#111111] dark:text-white hover:text-white border border-[#BDBDBD] dark:border-white/20 hover:border-[#80142B] transition-colors flat-box cursor-pointer shadow-sm"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleNext();
          }}
          aria-label="Orbit next project"
          className="absolute right-1 sm:right-3 top-1/2 -translate-y-1/2 z-40 p-2 sm:p-2.5 bg-white/90 dark:bg-black/80 hover:bg-[#80142B] dark:hover:bg-[#80142B] text-[#111111] dark:text-white hover:text-white border border-[#BDBDBD] dark:border-white/20 hover:border-[#80142B] transition-colors flat-box cursor-pointer shadow-sm"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* INTERACTIVE ORBIT DEGREE TIMELINE SCRUBBER */}
      <div className="relative z-30 max-w-xl mx-auto px-4 mb-4">
        <div className="flex items-center justify-between text-[10px] font-heading font-semibold text-[#666666] dark:text-white/50 mb-1">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-[#00A19C]" />
            <span>ORBIT COMPASS SCRUBBER</span>
          </span>
          <span className="font-mono text-[#00A19C] dark:text-[#00D1C7]">{compassDegree}° / 360°</span>
        </div>
        <div className="relative w-full h-2 bg-[#D4D4D4] dark:bg-[#222222] border border-[#BDBDBD] dark:border-[#333333] cursor-pointer">
          <div
            className="absolute left-0 top-0 bottom-0 bg-gradient-to-r from-[#80142B] to-[#00A19C] transition-all"
            style={{ width: `${(compassDegree / 360) * 100}%` }}
          />
          {projects.map((_, i) => {
            const pos = (i / N) * 100;
            return (
              <div
                key={i}
                onClick={(e) => {
                  e.stopPropagation();
                  rotateToCard(i);
                }}
                className={`absolute top-0 bottom-0 w-1 -translate-x-1/2 hover:scale-150 transition-transform ${
                  i === activeIndex
                    ? "bg-[#111111] dark:bg-white ring-2 ring-[#00A19C] dark:ring-[#00D1C7]"
                    : "bg-[#777777] dark:bg-white/40"
                }`}
                style={{ left: `${pos}%` }}
                title={`Project #${i + 1}`}
              />
            );
          })}
        </div>
      </div>

      {/* ACTIVE CARD TELEMETRY & ACTION COCKPIT */}
      <div className="relative z-30 max-w-3xl mx-auto p-4 sm:p-5 bg-white/95 dark:bg-[#181818]/90 backdrop-blur-md border border-[#BDBDBD] dark:border-[#2E2E2E] flat-box shadow-sm transition-colors">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          {/* Left: Project Info */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 bg-[#00A19C] text-white font-heading text-[9px] font-bold uppercase tracking-wider">
                {activeProject.category}
              </span>
              <span className="text-[10px] font-heading font-semibold text-[#777777] dark:text-white/40 tracking-widest">
                CARD #{String(activeIndex + 1).padStart(2, "0")}
              </span>
            </div>
            <h2 className="font-heading text-base sm:text-lg font-extrabold uppercase text-[#111111] dark:text-white tracking-tight">
              {activeProject.title}
            </h2>
            <p className="font-body text-xs text-[#555555] dark:text-white/70 mt-1 line-clamp-2 leading-relaxed">
              {activeProject.description || "Portfolio artwork showcasing modern graphic design identity."}
            </p>
          </div>

          {/* Right: Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 shrink-0 w-full md:w-auto">
            {/* Primary: Open Gallery Modal */}
            <button
              onClick={() => onSelectProject(activeProject)}
              className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#00A19C] hover:bg-[#008d88] text-white font-heading text-[11px] font-bold uppercase tracking-wider flat-box transition-colors cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>EXPLORE GALLERY</span>
            </button>

            {/* Direct JPG Download */}
            <a
              href={activeProject.imageUrl}
              download={`${activeProject.title.toLowerCase().replace(/\s+/g, "-")}.jpg`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-[#F2F2F2] dark:bg-[#242424] hover:bg-[#E5E5E5] dark:hover:bg-[#303030] border border-[#BDBDBD] dark:border-[#3A3A3A] text-[#111111] dark:text-white font-heading text-[11px] font-bold uppercase tracking-wider flat-box transition-colors cursor-pointer"
              title="Download high-res artwork"
            >
              <Download className="w-3.5 h-3.5 text-[#00A19C]" />
              <span>JPG</span>
            </a>

            {/* PDF Lookbook (if available) */}
            {activeProject.pdfUrl && (
              <a
                href={activeProject.pdfUrl}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-[#80142B] hover:bg-[#6b1124] text-white font-heading text-[11px] font-bold uppercase tracking-wider flat-box transition-colors cursor-pointer"
                title="Download PDF case study"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>PDF</span>
              </a>
            )}
          </div>
        </div>
      </div>

      {/* INSTRUCTION FOOTNOTE */}
      <div className="relative z-30 mt-3 text-center">
        <p className="font-heading text-[9px] font-medium tracking-[0.2em] text-[#777777] dark:text-white/40 uppercase">
          Drag horizontally or swipe to orbit • Click any card to rotate to front • Click center card to open high-res assets
        </p>
      </div>
    </div>
  );
}
