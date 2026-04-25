"use client";

import { useState, useEffect, useRef } from "react";

const phases = [
  { scale: 1, rotation: 0, opacity: 0.4, label: "Phase 0: idle" },
  { scale: 1.2, rotation: -8, opacity: 1, label: "Phase 1: highlight" },
  { scale: 0.9, rotation: 5, opacity: 0.7, label: "Phase 2: shake" },
  { scale: 1.1, rotation: 0, opacity: 1, label: "Phase 3: settle" },
  { scale: 1, rotation: 0, opacity: 1, label: "Phase 4: done" },
];

export function PhasePreview() {
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [auto, setAuto] = useState(true);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    if (!auto) return;
    timer.current = setTimeout(() => {
      setPhaseIdx((p) => (p + 1) % phases.length);
    }, 800);
    return () => clearTimeout(timer.current);
  }, [phaseIdx, auto]);

  const phase = phases[phaseIdx];

  return (
    <div className="flex flex-col items-center gap-4 select-none">
      <div
        className="w-16 h-16 rounded-2xl bg-[#007AFF] will-change-transform"
        style={{
          transform: `scale(${phase.scale}) rotate(${phase.rotation}deg)`,
          opacity: phase.opacity,
          transition: "all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)",
        }}
      />
      <span className="text-xs text-neutral-500 font-mono">{phase.label}</span>
      <div className="flex gap-2">
        <button
          className="px-3 py-1.5 rounded-xl text-xs font-medium border-none cursor-pointer"
          style={{ background: auto ? "rgba(0,122,255,0.15)" : "rgba(0,0,0,0.06)", color: auto ? "#007AFF" : "rgba(0,0,0,0.7)" }}
          onClick={(e) => { e.stopPropagation(); setAuto((a) => !a); }}
        >
          {auto ? "Auto ●" : "Auto ○"}
        </button>
        <button
          className="px-3 py-1.5 rounded-xl text-xs font-medium border-none cursor-pointer"
          style={{ background: "rgba(0,0,0,0.06)", color: "rgba(0,0,0,0.7)" }}
          onClick={(e) => { e.stopPropagation(); setPhaseIdx((p) => (p + 1) % phases.length); }}
        >
          Next Phase
        </button>
      </div>
    </div>
  );
}
