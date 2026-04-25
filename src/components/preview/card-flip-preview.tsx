"use client";

import { useState } from "react";

export function CardExpandPreview() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="relative w-full h-full select-none cursor-pointer p-3"
      onClick={() => setExpanded((e) => !e)}
    >
      <div
        className="absolute overflow-hidden bg-gradient-to-br from-[#007AFF] to-[#0040A8] text-white will-change-transform shadow-[0_8px_24px_rgba(0,81,213,0.35)]"
        style={{
          top: expanded ? 12 : "calc(50% - 40px)",
          left: expanded ? 12 : "calc(50% - 40px)",
          right: expanded ? 12 : "calc(50% - 40px)",
          bottom: expanded ? 12 : "calc(50% - 40px)",
          borderRadius: expanded ? 20 : 18,
          transition:
            "top 0.5s cubic-bezier(0.32, 0.72, 0, 1), left 0.5s cubic-bezier(0.32, 0.72, 0, 1), right 0.5s cubic-bezier(0.32, 0.72, 0, 1), bottom 0.5s cubic-bezier(0.32, 0.72, 0, 1), border-radius 0.5s cubic-bezier(0.32, 0.72, 0, 1)",
        }}
      >
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            opacity: expanded ? 0 : 1,
            transition: `opacity 180ms ease ${expanded ? "0ms" : "220ms"}`,
          }}
        >
          <div className="w-9 h-9 rounded-xl bg-white/25" />
        </div>

        <div
          className="absolute inset-0 flex flex-col p-5"
          style={{
            opacity: expanded ? 1 : 0,
            transform: expanded ? "translateY(0)" : "translateY(8px)",
            transition: expanded
              ? "opacity 240ms ease 180ms, transform 280ms cubic-bezier(0.32, 0.72, 0, 1) 180ms"
              : "opacity 100ms ease 0ms, transform 160ms cubic-bezier(0.32, 0.72, 0, 1) 0ms",
            pointerEvents: expanded ? "auto" : "none",
          }}
        >
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-white/25" />
            <div className="w-7 h-7 rounded-full bg-white/15 flex items-center justify-center text-white/70 text-xs">
              ✕
            </div>
          </div>
          <div className="text-base font-bold leading-tight mb-1">
            Card Title
          </div>
          <div className="text-xs text-white/65 leading-relaxed">
            点击空白处折叠 · 展开后内容延迟淡入，营造连贯的层级过渡感。
          </div>
          <div className="mt-auto text-[11px] text-white/45 font-mono">
            spring(response: 0.5, damping: 0.85)
          </div>
        </div>
      </div>
    </div>
  );
}

export function CardFlipPreview() {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="flex items-center justify-center select-none cursor-pointer"
      onClick={() => setFlipped((f) => !f)}
      style={{ perspective: 800 }}
    >
      <div
        className="relative will-change-transform"
        style={{
          width: 140,
          height: 90,
          transformStyle: "preserve-3d",
          transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)",
          transition: "transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <div
          className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#007AFF] to-[#0051D5] flex flex-col items-center justify-center text-white"
          style={{ backfaceVisibility: "hidden" }}
        >
          <div className="w-8 h-8 rounded-lg bg-white/20 mb-1" />
          <span className="text-sm font-bold">Front</span>
        </div>
        <div
          className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#AF52DE] to-[#6D1E99] flex flex-col items-center justify-center text-white"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <span className="text-sm font-bold">Back</span>
          <span className="text-xs text-white/40 mt-0.5">.easeInOut(0.5s)</span>
        </div>
      </div>
    </div>
  );
}
