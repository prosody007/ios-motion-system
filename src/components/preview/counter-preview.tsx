"use client";

import { useState, useEffect, useRef } from "react";

export function CounterTextPreview() {
  const [count, setCount] = useState(42);

  return (
    <div className="flex flex-col items-center gap-3 select-none">
      <div className="relative overflow-hidden h-10 flex items-center">
        <span
          key={count}
          className="text-3xl font-bold text-neutral-900 font-mono tabular-nums"
          style={{ animation: "counterSlide 0.3s cubic-bezier(0.25, 1, 0.5, 1)" }}
        >
          {count.toLocaleString()}
        </span>
      </div>
      <div className="flex gap-2">
        <button
          className="w-9 h-9 rounded-xl flex items-center justify-center text-neutral-900 text-lg font-bold border-none cursor-pointer"
          style={{ background: "rgba(0,0,0,0.06)" }}
          onClick={(e) => { e.stopPropagation(); setCount((c) => c - 1); }}
        >−</button>
        <button
          className="w-9 h-9 rounded-xl flex items-center justify-center text-neutral-900 text-lg font-bold border-none cursor-pointer"
          style={{ background: "rgba(0,0,0,0.06)" }}
          onClick={(e) => { e.stopPropagation(); setCount((c) => c + 1); }}
        >+</button>
        <button
          className="px-3 h-9 rounded-xl flex items-center justify-center text-neutral-700 text-xs font-medium border-none cursor-pointer"
          style={{ background: "rgba(0,0,0,0.06)" }}
          onClick={(e) => { e.stopPropagation(); setCount(Math.floor(Math.random() * 10000)); }}
        >Random</button>
      </div>
      <style>{`@keyframes counterSlide { from { opacity:0; transform:translateY(-12px) } to { opacity:1; transform:translateY(0) } }`}</style>
    </div>
  );
}

export function CounterCustomPreview() {
  const [target, setTarget] = useState(0);
  const [display, setDisplay] = useState(0);
  const raf = useRef(0);

  useEffect(() => {
    const start = display;
    const diff = target - start;
    if (diff === 0) return;
    const startTime = performance.now();
    const duration = 800;
    const ease = (t: number) => 1 - Math.pow(1 - t, 3);

    const animate = (now: number) => {
      const p = Math.min((now - startTime) / duration, 1);
      setDisplay(Math.round(start + diff * ease(p)));
      if (p < 1) raf.current = requestAnimationFrame(animate);
    };
    raf.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf.current);
  }, [target]);

  return (
    <div className="flex flex-col items-center gap-3 select-none">
      <span className="text-3xl font-bold text-[#0051D5] font-mono tabular-nums">
        {display.toLocaleString()}
      </span>
      <button
        className="px-4 py-1.5 rounded-xl text-xs font-medium border-none cursor-pointer"
        style={{ background: "rgba(0,0,0,0.06)", color: "rgba(0,0,0,0.7)" }}
        onClick={(e) => { e.stopPropagation(); setTarget(Math.floor(Math.random() * 100000)); }}
      >
        Animate to Random
      </button>
      <span className="text-xs text-neutral-400 font-mono">easeOutCubic · 800ms</span>
    </div>
  );
}
