"use client";

import { useState, useEffect, useRef } from "react";

export function ProgressBarPreview() {
  const [value, setValue] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    if (value >= 100) { setRunning(false); return; }
    const timer = setTimeout(() => setValue((v) => Math.min(100, v + 8 + Math.random() * 12)), 200);
    return () => clearTimeout(timer);
  }, [running, value]);

  const start = () => { setValue(0); setRunning(true); };

  return (
    <div className="w-full max-w-[240px] flex flex-col items-center gap-3 select-none">
      <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: "rgba(0,0,0,0.08)" }}>
        <div
          className="h-full rounded-full bg-[#007AFF]"
          style={{
            width: `${value}%`,
            transition: "width 0.3s cubic-bezier(0.25, 1, 0.5, 1)",
          }}
        />
      </div>
      <span className="text-sm text-neutral-600 font-mono tabular-nums">{Math.round(value)}%</span>
      <button
        className="px-4 py-1.5 rounded-xl text-xs font-medium border-none cursor-pointer"
        style={{ background: "rgba(0,0,0,0.06)", color: "rgba(0,0,0,0.7)" }}
        onClick={(e) => { e.stopPropagation(); start(); }}
      >
        {value >= 100 ? "Restart" : running ? "Loading..." : "Start"}
      </button>
    </div>
  );
}

export function ProgressRingPreview() {
  const [progress, setProgress] = useState(0);
  const [running, setRunning] = useState(false);
  const circumference = 2 * Math.PI * 36;

  useEffect(() => {
    if (!running) return;
    if (progress >= 1) { setRunning(false); return; }
    const timer = setTimeout(() => setProgress((p) => Math.min(1, p + 0.05 + Math.random() * 0.08)), 150);
    return () => clearTimeout(timer);
  }, [running, progress]);

  const start = () => { setProgress(0); setRunning(true); };

  return (
    <div className="flex flex-col items-center gap-3 select-none">
      <div className="relative w-20 h-20">
        <svg width="80" height="80" viewBox="0 0 80 80" className="absolute inset-0 -rotate-90">
          <circle cx="40" cy="40" r="36" fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth="5" />
          <circle
            cx="40" cy="40" r="36" fill="none" stroke="#007AFF" strokeWidth="5"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - progress)}
            style={{ transition: "stroke-dashoffset 0.4s cubic-bezier(0.25, 1, 0.5, 1)" }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm text-neutral-700 font-mono tabular-nums">{Math.round(progress * 100)}%</span>
        </div>
      </div>
      <button
        className="px-4 py-1.5 rounded-xl text-xs font-medium border-none cursor-pointer"
        style={{ background: "rgba(0,0,0,0.06)", color: "rgba(0,0,0,0.7)" }}
        onClick={(e) => { e.stopPropagation(); start(); }}
      >
        {progress >= 1 ? "Restart" : running ? "Loading..." : "Start"}
      </button>
    </div>
  );
}
