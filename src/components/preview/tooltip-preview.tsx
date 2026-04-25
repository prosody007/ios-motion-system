"use client";

import { useState } from "react";

export function TooltipPreview() {
  const [show, setShow] = useState(false);

  return (
    <div className="flex flex-col items-center gap-6 select-none">
      {/* Tooltip */}
      <div className="relative">
        <div
          className="absolute bottom-full left-1/2 mb-2 px-3 py-1.5 rounded-lg text-xs text-white whitespace-nowrap"
          style={{
            background: "rgba(30,30,35,0.95)",
            backdropFilter: "blur(12px)",
            boxShadow: "0 6px 18px rgba(0,0,0,0.18)",
            transform: show ? "translate(-50%, 0) scale(1)" : "translate(-50%, 4px) scale(0.95)",
            opacity: show ? 1 : 0,
            transformOrigin: "bottom center",
            transition: show
              ? "all 0.2s cubic-bezier(0.32, 0.72, 0, 1)"
              : "all 0.15s ease-in",
            pointerEvents: "none",
          }}
        >
          Add to favorites
          {/* Arrow */}
          <div
            className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0"
            style={{ borderLeft: "5px solid transparent", borderRight: "5px solid transparent", borderTop: "5px solid rgba(30,30,35,0.95)" }}
          />
        </div>

        <button
          className="w-10 h-10 rounded-xl flex items-center justify-center border-none cursor-pointer"
          style={{ background: "rgba(0,0,0,0.06)" }}
          onPointerEnter={() => setShow(true)}
          onPointerLeave={() => setShow(false)}
          onClick={(e) => { e.stopPropagation(); setShow((s) => !s); }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="rgba(0,0,0,0.55)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 3L10.5 6.5L14.5 7L11.75 9.5L12.5 13.5L9 11.5L5.5 13.5L6.25 9.5L3.5 7L7.5 6.5L9 3Z" />
          </svg>
        </button>
      </div>

      <span className="text-xs text-neutral-400">hover or tap</span>
    </div>
  );
}
