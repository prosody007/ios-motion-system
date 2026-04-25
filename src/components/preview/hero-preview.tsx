"use client";

import { useState, useRef, useCallback } from "react";

export function HeroPreview() {
  const [expanded, setExpanded] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const cellRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [rect, setRect] = useState({ top: 0, left: 0, w: 0, h: 0 });

  const colors = ["from-[#3395FF] to-[#0051D5]", "from-[#C88BE8] to-[#8E2CC4]", "from-[#FF5A7A] to-[#E01E45]"];

  const expand = useCallback((i: number) => {
    const cell = cellRefs.current[i];
    const container = containerRef.current;
    if (!cell || !container) return;
    const cR = container.getBoundingClientRect();
    const eR = cell.getBoundingClientRect();
    setRect({ top: eR.top - cR.top, left: eR.left - cR.left, w: eR.width, h: eR.height });
    setSelectedIdx(i);
    requestAnimationFrame(() => setExpanded(true));
  }, []);

  const collapse = useCallback(() => {
    setExpanded(false);
    setTimeout(() => setSelectedIdx(-1), 500);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-full select-none overflow-hidden">
      <div className="absolute inset-0 p-4 flex gap-2 items-center justify-center">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            ref={(el) => { cellRefs.current[i] = el; }}
            className={`w-16 h-20 rounded-xl bg-gradient-to-br ${colors[i]} cursor-pointer flex items-center justify-center`}
            style={{ opacity: selectedIdx === i && expanded ? 0 : 1, transition: "opacity 0.15s" }}
            onClick={(e) => { e.stopPropagation(); expand(i); }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.5 }}>
              <rect x="2" y="2" width="12" height="12" rx="2" />
              <circle cx="5.5" cy="5.5" r="1" />
              <path d="M14 10L11 7L4 14" />
            </svg>
          </div>
        ))}
      </div>

      {selectedIdx >= 0 && (
        <div
          className={`absolute bg-gradient-to-br ${colors[selectedIdx]} rounded-2xl flex flex-col items-center justify-center text-white cursor-pointer will-change-[top,left,width,height]`}
          style={{
            top: expanded ? 8 : rect.top,
            left: expanded ? 8 : rect.left,
            width: expanded ? "calc(100% - 16px)" : rect.w,
            height: expanded ? "calc(100% - 16px)" : rect.h,
            borderRadius: expanded ? 16 : 12,
            transition: `all 0.45s cubic-bezier(0.32, 0.72, 0, 1)`,
          }}
          onClick={(e) => { e.stopPropagation(); collapse(); }}
        >
          <div style={{ opacity: expanded ? 1 : 0, transition: "opacity 0.2s ease " + (expanded ? "0.2s" : "0s") }}
            className="flex flex-col items-center gap-1"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.6, marginBottom: 4 }}>
              <rect x="3" y="3" width="18" height="18" rx="3" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="M21 15L16 10L5 21" />
            </svg>
            <span className="text-sm font-bold">Photo Detail</span>
            <span className="text-xs text-white/40">hero transition · tap to close</span>
          </div>
        </div>
      )}
    </div>
  );
}
