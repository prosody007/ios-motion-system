"use client";

import { useState, useEffect } from "react";

export function KeyframePreview() {
  const [playing, setPlaying] = useState(false);
  const [key, setKey] = useState(0);

  const play = () => {
    setPlaying(false);
    setKey((k) => k + 1);
    requestAnimationFrame(() => setPlaying(true));
  };

  useEffect(() => { setPlaying(true); }, []);

  return (
    <div className="flex flex-col items-center gap-4 select-none" key={key}>
      <div
        className="w-14 h-14 rounded-2xl bg-[#007AFF]"
        style={{
          animation: playing ? "kfDemo 1.2s cubic-bezier(0.4, 0, 0.2, 1) forwards" : "none",
        }}
      />
      <button
        className="px-4 py-1.5 rounded-xl text-xs font-medium border-none cursor-pointer"
        style={{ background: "rgba(0,0,0,0.06)", color: "rgba(0,0,0,0.7)" }}
        onClick={(e) => { e.stopPropagation(); play(); }}
      >
        Replay
      </button>
      <span className="text-xs text-neutral-400 font-mono">KeyframeAnimator · multi-property</span>
      <style>{`@keyframes kfDemo {
        0%   { transform: scale(1) rotate(0deg) translateX(0); opacity: 0.5; border-radius: 16px; }
        25%  { transform: scale(1.3) rotate(-10deg) translateX(-20px); opacity: 1; border-radius: 50%; }
        50%  { transform: scale(0.8) rotate(15deg) translateX(30px); opacity: 0.8; border-radius: 8px; }
        75%  { transform: scale(1.1) rotate(-5deg) translateX(-10px); opacity: 1; border-radius: 24px; }
        100% { transform: scale(1) rotate(0deg) translateX(0); opacity: 1; border-radius: 16px; }
      }`}</style>
    </div>
  );
}
