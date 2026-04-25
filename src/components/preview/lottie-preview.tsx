"use client";

import { useState, useEffect } from "react";

export function LottiePreview() {
  const [playing, setPlaying] = useState(true);
  const [frame, setFrame] = useState(0);
  const [speed, setSpeed] = useState(1);
  const totalFrames = 60;

  useEffect(() => {
    if (!playing) return;
    const interval = setInterval(() => {
      setFrame((f) => {
        const next = f + speed;
        return next >= totalFrames ? 0 : next;
      });
    }, 1000 / 30);
    return () => clearInterval(interval);
  }, [playing, speed]);

  const progress = frame / totalFrames;
  const rotation = progress * 360;
  const scale = 0.8 + Math.sin(progress * Math.PI * 2) * 0.2;
  const hue = progress * 60;

  return (
    <div className="flex flex-col items-center gap-4 select-none">
      <div className="relative w-20 h-20 flex items-center justify-center">
        <div
          className="w-14 h-14 rounded-2xl"
          style={{
            background: `hsl(${240 + hue}, 70%, 60%)`,
            transform: `rotate(${rotation}deg) scale(${scale})`,
            borderRadius: `${16 + Math.sin(progress * Math.PI * 4) * 12}px`,
          }}
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          className="w-8 h-8 rounded-lg flex items-center justify-center border-none cursor-pointer"
          style={{ background: "rgba(0,0,0,0.06)", color: "rgba(0,0,0,0.85)" }}
          onClick={(e) => { e.stopPropagation(); setPlaying((p) => !p); }}
        >
          {playing ? "❚❚" : "▶"}
        </button>
        <div className="flex gap-1">
          {[0.5, 1, 1.5, 2].map((s) => (
            <button
              key={s}
              className="px-2 py-1 rounded-lg text-xs border-none cursor-pointer"
              style={{
                background: speed === s ? "rgba(0,122,255,0.15)" : "rgba(0,0,0,0.05)",
                color: speed === s ? "#007AFF" : "rgba(0,0,0,0.6)",
              }}
              onClick={(e) => { e.stopPropagation(); setSpeed(s); }}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>
      <span className="text-xs text-neutral-400 font-mono">
        frame {Math.round(frame)}/{totalFrames} · .animationSpeed({speed})
      </span>
    </div>
  );
}
